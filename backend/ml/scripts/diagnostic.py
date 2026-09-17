import os
import json
import torch
import pandas as pd
import numpy as np
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from peft import PeftModel
import sys

# Add backend/ml to path
sys.path.append(os.path.join(os.getcwd(), "backend/ml"))
from config import MODEL_SAVE_PATH, PROCESSED_DIR, DEVICE

def run_diagnostic():
    print("=== OMNITRIX Model Diagnostic (Fixed Loading) ===")

    # 1. Check Label Mapping
    with open(os.path.join(MODEL_SAVE_PATH, "label_mapping.json"), "r") as f:
        label_mapping = json.load(f)
    num_labels = len(label_mapping)
    print(f"\n[1] Label Mapping: {num_labels} classes found.")

    # 2. Load Tokenizer
    tokenizer = AutoTokenizer.from_pretrained(MODEL_SAVE_PATH)

    # 3. Load Model CORRECTLY
    print("\n[2] Loading model with explicit Base + Adapter...")
    base_model_name = "google/muril-base-cased"

    # Load base model with correct num_labels
    base_model = AutoModelForSequenceClassification.from_pretrained(
        base_model_name,
        num_labels=num_labels
    ).to(DEVICE)

    # Load adapter
    model = PeftModel.from_pretrained(base_model, MODEL_SAVE_PATH).to(DEVICE)
    model.eval()
    print("Model loaded via Base + PeftModel.from_pretrained.")

    # 4. Verify Architecture
    print("\n[3] Architecture Check:")
    print(f"Model Class: {type(model)}")

    # Check classifier dimensions
    # For PEFT model, the classifier is usually in the base_model
    if hasattr(model.base_model, 'classifier'):
        print(f"Classifier output dim: {model.base_model.classifier.out_features}")
    else:
        # Fallback search
        for name, module in model.named_modules():
            if "classifier" in name.lower() and hasattr(module, 'out_features'):
                print(f"Found classifier {name} with output dim: {module.out_features}")

    # 5. Test Set Prediction Distribution
    print("\n[4] Prediction Distribution (Fixed Load):")
    test_df = pd.read_csv(os.path.join(PROCESSED_DIR, "test.csv"))
    texts = test_df['text'].astype(str).tolist()
    true_labels = test_df['label'].tolist()

    preds = []
    with torch.no_grad():
        for text in texts:
            inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=128, padding=True).to(DEVICE)
            outputs = model(**inputs)
            pred = torch.argmax(outputs.logits, dim=1).item()
            preds.append(pred)

    actual_counts = pd.Series(true_labels).value_counts().sort_index()
    pred_counts = pd.Series(preds).value_counts().sort_index()

    print("\nClass | Actual | Predicted")
    print("-" * 25)
    for i in range(num_labels):
        actual = actual_counts.get(i, 0)
        pred = pred_counts.get(i, 0)
        print(f"{i:4}   | {actual:6} | {pred:9}")

if __name__ == "__main__":
    run_diagnostic()
