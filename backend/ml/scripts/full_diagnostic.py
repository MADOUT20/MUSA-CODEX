import os
import json
import pandas as pd
import numpy as np
import re
from collections import Counter

# Paths
PROCESSED_DIR = "backend/ml/data/processed"
MODEL_SAVE_PATH = "backend/ml/models/muril_emotion"
TRAINING_LOG = os.path.join(MODEL_SAVE_PATH, "training.log")
CM_PATH = os.path.join(MODEL_SAVE_PATH, "confusion_matrix.npy")

def analyze_dataset(file_name):
    df = pd.read_csv(os.path.join(PROCESSED_DIR, file_name))
    counts = df['label'].value_counts().sort_index()
    total = len(df)
    return counts, total

def analyze_training_log(log_path):
    losses = []
    try:
        with open(log_path, 'r') as f:
            for line in f:
                match = re.search(r"'loss':\s*'([\d\.]+)'", line)
                if match:
                    losses.append(float(match.group(1)))
    except Exception as e:
        return f"Error reading log: {e}"
    
    if not losses:
        return "No loss values found in log."
    
    return {
        "early": losses[:5],
        "middle": losses[len(losses)//2 - 2 : len(losses)//2 + 3],
        "final": losses[-5:],
        "start": losses[0],
        "end": losses[-1],
        "decreased": losses[-1] < losses[0]
    }

def analyze_confusion_matrix(cm_path):
    if not os.path.exists(cm_path):
        return "Confusion matrix file not found."
    cm = np.load(cm_path)
    return cm

def main():
    print("=== STARTING FULL DIAGNOSTIC ===\n")

    # 1. Training Loss
    print("Analyzing Training Loss...")
    loss_data = analyze_training_log(TRAINING_LOG)
    print(f"Loss Data: {loss_data}\n")

    # 2. Dataset Balance
    print("Analyzing Dataset Balance...")
    for split in ['train.csv', 'val.csv', 'test.csv']:
        counts, total = analyze_dataset(split)
        print(f"\nSplit: {split}")
        print(f"Total samples: {total}")
        for i in range(10):
            count = counts.get(i, 0)
            print(f"Class {i}: {count} ({count/total*100:.2f}%)")

    # 3. Confusion Matrix & Predictions
    print("\nAnalyzing Confusion Matrix...")
    cm = analyze_confusion_matrix(CM_PATH)
    if isinstance(cm, np.ndarray):
        print("Confusion Matrix:\n", cm)
        # Calculate predicted distribution from CM
        # CM rows = actual, cols = predicted
        pred_dist = cm.sum(axis=0)
        actual_dist = cm.sum(axis=1)
        print("\nActual Distribution:", actual_dist)
        print("Predicted Distribution:", pred_dist)
    else:
        print(cm)

if __name__ == "__main__":
    main()
