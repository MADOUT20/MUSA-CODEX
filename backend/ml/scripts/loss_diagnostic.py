import os
import json
import pandas as pd
import torch
import sys
from torch.utils.data import DataLoader
from transformers import AutoTokenizer, AutoModelForSequenceClassification, DataCollatorWithPadding
from peft import LoraConfig, get_peft_model, TaskType

# Add backend/ml to path
sys.path.append(os.path.join(os.getcwd(), "backend/ml"))
from config import MODEL_NAME, MAX_SEQ_LENGTH, PROCESSED_DIR, DEVICE

def diagnostic():
    print(f"Using device: {DEVICE}")
    
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    
    # Load dataset
    df = pd.read_csv(os.path.join(PROCESSED_DIR, "train.csv"))
    
    class SimpleDataset:
        def __init__(self, df, tokenizer):
            self.df = df
            self.tokenizer = tokenizer
        def __len__(self):
            return len(self.df)
        def __getitem__(self, idx):
            text = str(self.df.iloc[idx]['text'])
            label = int(self.df.iloc[idx]['label'])
            encoding = self.tokenizer(text, truncation=True, max_length=MAX_SEQ_LENGTH, padding=False)
            return {'input_ids': torch.tensor(encoding['input_ids']), 
                    'attention_mask': torch.tensor(encoding['attention_mask']), 
                    'labels': torch.tensor(label)}

    dataset = SimpleDataset(df, tokenizer)
    collator = DataCollatorWithPadding(tokenizer=tokenizer)
    
    # Load model
    model = AutoModelForSequenceClassification.from_pretrained(
        MODEL_NAME, num_labels=10, attn_implementation="eager"
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
    
    losses = []
    # Sample 1000 random indices
    import random
    indices = random.sample(range(len(dataset)), 1000)
    
    print("Computing losses for 1000 random samples...")
    with torch.no_grad():
        for i in indices:
            item = dataset[i]
            # Batch it for the collator
            batch = collator([item])
            batch = {k: v.to(DEVICE) for k, v in batch.items()}
            outputs = model(**batch)
            losses.append(outputs.loss.item())
            
    losses_tensor = torch.tensor(losses)
    print(f"\nLoss Statistics (1000 samples, TRAIN mode):")
    print(f"Mean: {losses_tensor.mean().item():.4f}")
    print(f"Median: {losses_tensor.median().item():.4f}")
    print(f"Max: {losses_tensor.max().item():.4f}")
    print(f"Min: {losses_tensor.min().item():.4f}")
    print(f"Std: {losses_tensor.std().item():.4f}")
    
    # Check for extreme values
    outliers = [l for l in losses if l > 10.0]
    print(f"Number of samples with loss > 10: {len(outliers)}")
    if outliers:
        print(f"Example outliers: {outliers[:5]}")

if __name__ == "__main__":
    diagnostic()
