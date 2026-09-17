import os
import json
import pandas as pd
import torch
import argparse
import sys
import time
from torch.utils.data import Dataset
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    Trainer,
    TrainingArguments,
    DataCollatorWithPadding
)
from peft import LoraConfig, get_peft_model, TaskType

# Add backend/ml to path for config import
sys.path.append(os.path.join(os.getcwd(), "backend/ml"))
from config import MODEL_NAME, MAX_SEQ_LENGTH, BATCH_SIZE, EPOCHS, LEARNING_RATE, PROCESSED_DIR, MODEL_SAVE_PATH, DEVICE

class EmotionDataset(Dataset):
    def __init__(self, csv_file, tokenizer):
        self.df = pd.read_csv(csv_file)
        self.tokenizer = tokenizer

    def __len__(self):
        return len(self.df)

    def __getitem__(self, idx):
        text = str(self.df.iloc[idx]['text'])
        label = int(self.df.iloc[idx]['label'])

        encoding = self.tokenizer(
            text,
            truncation=True,
            max_length=MAX_SEQ_LENGTH,
            padding=False
        )

        return {
            'input_ids': torch.tensor(encoding['input_ids']),
            'attention_mask': torch.tensor(encoding['attention_mask']),
            'labels': torch.tensor(label)
        }

def train(sanity_test=False):
    print(f"Using device: {DEVICE}")

    with open(os.path.join(PROCESSED_DIR, "label_mapping.json"), "r") as f:
        label_mapping = json.load(f)
    num_labels = len(label_mapping)

    os.makedirs(MODEL_SAVE_PATH, exist_ok=True)
    log_file_path = os.path.join(MODEL_SAVE_PATH, "training.log")

    class LineBufferedLogger:
        def __init__(self, path):
            self.file = open(path, "w", buffering=1)
        def log(self, message):
            timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
            full_msg = f"[{timestamp}] {message}\n"
            print(message)
            self.file.write(full_msg)
            self.file.flush()
        def close(self):
            self.file.close()

    logger = LineBufferedLogger(log_file_path)
    logger.log(f"Training started. Model: {MODEL_NAME}, Device: {DEVICE}")

    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    train_dataset = EmotionDataset(os.path.join(PROCESSED_DIR, "train.csv"), tokenizer)
    val_dataset = EmotionDataset(os.path.join(PROCESSED_DIR, "val.csv"), tokenizer)

    logger.log("Loading base model...")
    model = AutoModelForSequenceClassification.from_pretrained(
        MODEL_NAME,
        num_labels=num_labels,
        attn_implementation="eager"
    ).to(DEVICE)

    logger.log("Applying LoRA (PEFT) v3 Configuration...")
    peft_config = LoraConfig(
        task_type=TaskType.SEQ_CLS,
        inference_mode=False,
        r=16,
        lora_alpha=32,
        lora_dropout=0.1,
        target_modules=["query", "value"]
    )

    model = get_peft_model(model, peft_config)
    model.print_trainable_parameters()

    # --- SAFETY GATE: LoRA Gradient Flow Check ---
    print("\n--- SAFETY GATE: LoRA Gradient Flow Check ---")
    model.train()
    collator = DataCollatorWithPadding(tokenizer=tokenizer)
    samples = [train_dataset[i] for i in range(4)]
    batch = collator(samples)
    batch = {k: v.to(DEVICE) for k, v in batch.items()}

    # Forward pass
    outputs = model(**batch)
    loss = outputs.loss
    print(f"Initial Loss: {loss.item():.4f}")

    # Backward pass to check gradients
    loss.backward()

    lora_grad_norm = 0.0
    for name, param in model.named_parameters():
        if param.grad is not None and "lora_" in name:
            lora_grad_norm += param.grad.norm().item()

    print(f"LoRA Gradient Norm: {lora_grad_norm:.6f}")
    if lora_grad_norm == 0:
        print("CRITICAL FAILURE: LoRA gradients are ZERO. Aborting training to prevent collapse.")
        sys.exit(1)

    # Reset gradients for training
    model.zero_grad()
    print("LoRA Gradient Flow verified. Proceeding.\n")
    # -----------------------------------------------

    training_args = TrainingArguments(
        output_dir="./results_v3",
        num_train_epochs=EPOCHS if not sanity_test else 1,
        max_steps=100 if sanity_test else -1,
        per_device_train_batch_size=1,
        gradient_accumulation_steps=16,
        per_device_eval_batch_size=1,
        learning_rate=LEARNING_RATE,
        weight_decay=0.01,
        warmup_steps=10,
        eval_strategy="epoch" if not sanity_test else "steps",
        eval_steps=50 if sanity_test else -1,
        save_strategy="epoch" if not sanity_test else "no",
        load_best_model_at_end=not sanity_test,
        metric_for_best_model="accuracy",
        logging_steps=10,
        save_total_limit=2,
        fp16=False,
        gradient_checkpointing=False,
        report_to="none",
        logging_first_step=True
    )

    def compute_metrics(pred):
        labels = pred.label_ids
        preds = pred.predictions.argmax(-1)
        acc = (labels == preds).mean().item()
        return {"accuracy": acc}

    from transformers import TrainerCallback
    class LiveLoggerCallback(TrainerCallback):
        def on_log(self, args, state, control, logs=None, **kwargs):
            if logs:
                step = state.global_step
                epoch = state.epoch
                loss = logs.get("loss", "N/A")
                lr = logs.get("learning_rate", "N/A")
                eval_loss = logs.get("eval_loss", "N/A")
                eval_acc = logs.get("eval_accuracy", "N/A")
                msg = f"Step {step}/{state.max_steps} | Epoch {epoch:.2f} | Loss: {loss} | LR: {lr} | EvalLoss: {eval_loss} | EvalAcc: {eval_acc}"
                logger.log(msg)

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        data_collator=collator,
        compute_metrics=compute_metrics,
        callbacks=[LiveLoggerCallback()]
    )

    if sanity_test:
        logger.log("Starting SANITY TEST (100 steps)...")
    else:
        logger.log("Starting FULL training with LoRA v3...")

    trainer.train()

    if not sanity_test:
        logger.log(f"Saving model to {MODEL_SAVE_PATH}...")
        os.makedirs(MODEL_SAVE_PATH, exist_ok=True)
        trainer.model.save_pretrained(MODEL_SAVE_PATH)
        tokenizer.save_pretrained(MODEL_SAVE_PATH)
        with open(os.path.join(MODEL_SAVE_PATH, "label_mapping.json"), "w") as f:
            json.dump(label_mapping, f)

    logger.log("Training process completed!")
    logger.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--sanity", action="store_true", help="Run a short sanity test")
    args = parser.parse_args()
    train(sanity_test=args.sanity)
