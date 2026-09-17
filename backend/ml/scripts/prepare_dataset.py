from preprocessing import preprocess_emotion_data
import os

if __name__ == "__main__":
    RAW_DATA_PATH = "backend/ml/data/raw/emotion_hinghlish_dataset.xlsx"
    PROCESSED_DIR = "backend/ml/data/processed"

    label_mapping, splits = preprocess_emotion_data(RAW_DATA_PATH, PROCESSED_DIR)
    print("\nDataset preparation complete.")
    print(f"Label mapping saved to {PROCESSED_DIR}/label_mapping.json")
    print(f"Splits: Train={splits[0]}, Val={splits[1]}, Test={splits[2]}")
