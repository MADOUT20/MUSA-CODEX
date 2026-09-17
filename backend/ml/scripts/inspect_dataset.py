import pandas as pd
import os

def inspect_dataset(file_path):
    print(f"Inspecting dataset: {file_path}")

    try:
        # Read the excel file
        df = pd.read_excel(file_path)

        print("\n--- Basic Info ---")
        print(f"Number of rows: {len(df)}")
        print(f"Number of columns: {len(df.columns)}")
        print(f"Column names: {list(df.columns)}")

        print("\n--- Sample Records ---")
        print(df.head())

        print("\n--- Missing Values ---")
        print(df.isnull().sum())

        print("\n--- Duplicate Rows ---")
        print(f"Number of duplicate rows: {df.duplicated().sum()}")

        # We don't know the column names yet, so we'll try to guess the label column
        # or just print the distribution of all columns if they are categorical.
        print("\n--- Value Distributions (Categorical) ---")
        for col in df.columns:
            if df[col].nunique() < 20:
                print(f"\nDistribution for {col}:")
                print(df[col].value_counts())

    except Exception as e:
        print(f"Error reading the file: {e}")

if __name__ == "__main__":
    # The path relative to the project root
    DATA_PATH = "backend/ml/data/raw/emotion_hinghlish_dataset.xlsx"
    inspect_dataset(DATA_PATH)
