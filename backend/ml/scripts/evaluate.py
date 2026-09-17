import os
import json
import torch
import pandas as pd
import numpy as np
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix, classification_report
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import sys

# Add backend/ml to path
sys.path.append(os.path.join(os.getcwd(), "backend/ml"))
from config import MODEL_SAVE_PATH, PROCESSED_DIR, DEVICE

def evaluate_model():
    print(f"Evaluating model from {MODEL_SAVE_PATH}...")

    # Load label mapping
    with open(os.path.join(MODEL_SAVE_PATH, "label_mapping.json"), "r") as f:
        label_mapping = json.load(f)

    # The mapping is stored as {"0": "label1", "1": "label2", ...}
    # We need a list of labels in order of their IDs for the classification report
    labels = [label_mapping[str(i)] for i in range(len(label_mapping))]

    # Load tokenizer and model
    tokenizer = AutoTokenizer.from_pretrained(MODEL_SAVE_PATH)

    # Load base model with correct num_labels
    from transformers import AutoModelForSequenceClassification
    from peft import PeftModel
    base_model = AutoModelForSequenceClassification.from_pretrained(
        "google/muril-base-cased",
        num_labels=len(label_mapping)
    ).to(DEVICE)
    model = PeftModel.from_pretrained(base_model, MODEL_SAVE_PATH).to(DEVICE)
    model.eval()

    # Load test dataset
    test_df = pd.read_csv(os.path.join(PROCESSED_DIR, "test.csv"))
    texts = test_df['text'].astype(str).tolist()
    true_labels = test_df['label'].tolist()

    preds = []
    print("Performing inference on test set...")
    with torch.no_grad():
        for text in texts:
            inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=128, padding=True).to(DEVICE)
            outputs = model(**inputs)
            pred = torch.argmax(outputs.logits, dim=1).item()
            preds.append(pred)

    # Metrics
    accuracy = accuracy_score(true_labels, preds)
    precision, recall, f1, _ = precision_recall_fscore_support(true_labels, preds, average='macro')
    weighted_f1 = precision_recall_fscore_support(true_labels, preds, average='weighted')[2]

    print("\n--- Final Test Performance ---")
    print(f"Accuracy: {accuracy:.4f}")
    print(f"Macro Precision: {precision:.4f}")
    print(f"Macro Recall: {recall:.4f}")
    print(f"Macro F1: {f1:.4f}")
    print(f"Weighted F1: {weighted_f1:.4f}")

    print("\n--- Classification Report ---")
    print(classification_report(true_labels, preds, target_names=labels))

    # Confusion Matrix
    cm = confusion_matrix(true_labels, preds)
    np.save(os.path.join(MODEL_SAVE_PATH, "confusion_matrix.npy"), cm)
    print(f"\nConfusion matrix saved to {MODEL_SAVE_PATH}/confusion_matrix.npy")

    # Save results to a file
    results = {
        "accuracy": accuracy,
        "macro_precision": precision,
        "macro_recall": recall,
        "macro_f1": f1,
        "weighted_f1": weighted_f1
    }
    with open(os.path.join(MODEL_SAVE_PATH, "eval_results.json"), "w") as f:
        json.dump(results, f, indent=4)

if __name__ == "__main__":
    evaluate_model()
