import os
import json
import pandas as pd
import torch
import numpy as np
import sys
from torch.utils.data import DataLoader
from transformers import AutoTokenizer, AutoModelForSequenceClassification, DataCollatorWithPadding
from peft import LoraConfig, get_peft_model, TaskType
from torch.optim import AdamW

# Add backend/ml to path
sys.path.append(os.path.join(os.getcwd(), "backend/ml"))
from config import MODEL_NAME, MAX_SEQ_LENGTH, PROCESSED_DIR, DEVICE, MODEL_SAVE_PATH

def run_diagnostics():
    print("=== 1. DATASET DIAGNOSTICS ===")
    files = {"train": "train.csv", "val": "val.csv", "test": "test.csv"}
    data_frames = {}
    
    # Load label mapping
    with open(os.path.join(PROCESSED_DIR, "label_mapping.json"), "r") as f:
        label_mapping = json.load(f)
    print(f"Label Mapping: {label_mapping}")

    for split, filename in files.items():
        df = pd.read_csv(os.path.join(PROCESSED_DIR, filename))
        data_frames[split] = df
        counts = df['label'].value_counts().sort_index()
        pcts = df['label'].value_counts(normalize=True).sort_index() * 100
        print(f"\nSplit: {split}")
        print(f"Counts:\n{counts}")
        print(f"Percentages:\n{pcts}")
        
        # Check label types
        print(f"Label dtype: {df['label'].dtype}")
        if not df['label'].isin(range(len(label_mapping))).all():
            print(f"CRITICAL: Labels in {split} not in range(0, {len(label_mapping)})")

    # Check for duplicates across splits
    all_texts = pd.concat([df['text'] for df in data_frames.values()])
    dupes = all_texts[all_texts.duplicated()].unique()
    print(f"\nTotal unique texts: {all_texts.nunique()} / Total rows: {len(all_texts)}")
    print(f"Global duplicate texts: {len(dupes)}")

    # Check for conflicting labels for same text
    full_df = pd.concat([df[['text', 'label']] for df in data_frames.values()])
    conflicts = full_df.groupby('text')['label'].nunique()
    conflict_count = (conflicts > 1).sum()
    print(f"Texts with conflicting labels: {conflict_count}")

    # Random examples
    print("\nRandom Examples (Train):")
    sample_df = data_frames['train'].sample(20)
    for _, row in sample_df.iterrows():
        print(f"Text: {row['text']} | Raw Label: {row['label']} | Mapped: {label_mapping.get(str(int(row['label'])), 'Unknown')}")

    print("\n=== 2. CLASSIFIER HEAD & MODEL INITIALIZATION ===")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForSequenceClassification.from_pretrained(
        MODEL_NAME, num_labels=len(label_mapping), attn_implementation="eager"
    ).to(DEVICE)
    
    peft_config = LoraConfig(
        task_type=TaskType.SEQ_CLS,
        inference_mode=False,
        r=16,
        lora_alpha=32,
        lora_dropout=0.1,
        target_modules=["query", "value"]
    )
    model = get_peft_model(model, peft_config)
    model.train()

    classifier = model.classifier
    print(f"Classifier Weight Mean: {classifier.weight.data.mean().item():.6f}, Std: {classifier.weight.data.std().item():.6f}")
    print(f"Classifier Bias Mean: {classifier.bias.data.mean().item():.6f}, Std: {classifier.bias.data.std().item():.6f}")
    print(f"Classifier Bias Values:\n{classifier.bias.data}")

    print("\n=== 3. LOGITS & PREDICTIONS (BEFORE TRAINING) ===")
    # Use one sample
    text = "Sample Hinglish text"
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=MAX_SEQ_LENGTH).to(DEVICE)
    with torch.no_grad():
        logits = model(**inputs).logits
        probs = torch.softmax(logits, dim=-1)
    print(f"Logits:\n{logits}")
    print(f"Probs:\n{probs}")
    print(f"Prediction: {torch.argmax(logits, dim=-1).item()}")

    print("\n=== 4. GRADIENT DIAGNOSTICS ===")
    # Single batch
    train_df = data_frames['train'].sample(4)
    texts = train_df['text'].tolist()
    labels = torch.tensor(train_df['label'].tolist()).to(DEVICE)
    inputs = tokenizer(texts, return_tensors="pt", padding=True, truncation=True, max_length=MAX_SEQ_LENGTH).to(DEVICE)
    
    optimizer = AdamW(model.parameters(), lr=1e-5)
    
    # Step 0
    outputs = model(**inputs, labels=labels)
    loss = outputs.loss
    loss.backward()
    
    def get_grad_norm(name, param):
        if param.grad is not None:
            return param.grad.norm().item()
        return 0.0

    print(f"Initial Loss: {loss.item():.4f}")
    print(f"Classifier Grad Norm: {get_grad_norm('classifier', model.classifier.weight)}")
    print(f"LoRA Grad Norm (first layer): {get_grad_norm('lora', model.base_model.model.bert.encoder.layer[0].attention.self.query.lora_A.default.weight)}")
    
    # Base model check (should be 0)
    base_param = model.base_model.model.bert.encoder.layer[0].attention.self.query.weight
    print(f"Base MuRIL Grad Norm: {get_grad_norm('base', base_param)}")
    
    # Optimizer step
    classifier_weight_before = model.classifier.weight.data.clone()
    optimizer.step()
    optimizer.zero_grad()
    
    classifier_weight_after = model.classifier.weight.data
    diff = torch.norm(classifier_weight_after - classifier_weight_before).item()
    print(f"Classifier weight change after 1 step: {diff:.8f}")

    print("\n=== 5. LEARNING RATE VERIFICATION ===")
    # Inspect optimizer
    for group in optimizer.param_groups:
        print(f"Optimizer Group LR: {group['lr']}")

    print("\n=== 6. EVALUATION LABEL MATCHING ===")
    # Mock evaluation check
    # In evaluate.py:
    # predictions = model(inputs).logits.argmax(-1)
    # labels = labels_tensor
    # This means labels in the file MUST be 0-9.
    # We already checked that in Step 1.
    print("Verification: Label indices in CSVs are used directly as targets in CrossEntropyLoss.")

if __name__ == "__main__":
    run_diagnostics()
