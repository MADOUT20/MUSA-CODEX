import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import json
import os

def preprocess_emotion_data(raw_data_path, processed_dir):
    print(f"Loading data from {raw_data_path}...")
    df = pd.read_excel(raw_data_path)

    # 1. Remove missing values in text or emotion
    initial_len = len(df)
    df = df.dropna(subset=['text', 'emotion'])
    print(f"Removed {initial_len - len(df)} rows with missing values.")

    # 2. Remove duplicates
    initial_len = len(df)
    df = df.drop_duplicates()
    print(f"Removed {initial_len - len(df)} duplicate rows.")

    # 3. Label Encoding
    le = LabelEncoder()
    df['label'] = le.fit_transform(df['emotion'])

    label_mapping = {int(i): label for i, label in enumerate(le.classes_)}

    print("\nLabel Mapping:")
    for i, label in label_mapping.items():
        print(f"{i}: {label}")

    # 4. Split Dataset (80% train, 10% val, 10% test)
    # First split into train (80%) and temp (20%)
    train_df, temp_df = train_test_split(
        df,
        test_size=0.2,
        random_state=42,
        stratify=df['label']
    )

    # Then split temp into val (50% of 20% = 10%) and test (50% of 20% = 10%)
    val_df, test_df = train_test_split(
        temp_df,
        test_size=0.5,
        random_state=42,
        stratify=temp_df['label']
    )

    print(f"\nSplit sizes: Train={len(train_df)}, Val={len(val_df)}, Test={len(test_df)}")

    # Save the processed datasets
    os.makedirs(processed_dir, exist_ok=True)
    train_df.to_csv(os.path.join(processed_dir, "train.csv"), index=False)
    val_df.to_csv(os.path.join(processed_dir, "val.csv"), index=False)
    test_df.to_csv(os.path.join(processed_dir, "test.csv"), index=False)

    # Save label mapping
    with open(os.path.join(processed_dir, "label_mapping.json"), "w") as f:
        json.dump(label_mapping, f)

    return label_mapping, (len(train_df), len(val_df), len(test_df))
