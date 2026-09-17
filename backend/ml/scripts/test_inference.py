import argparse
import sys
import os

# Add backend/ml to path
sys.path.append(os.path.join(os.getcwd(), "backend/ml"))
from inference import analyze_text

def run_inference(text):
    try:
        result = analyze_text(text)
        print("\nOMNITRIX MuRIL Inference")
        print("-" * 24)
        print(f"Input: {text}")
        print(f"Emotion: {result['emotion']}")
        print(f"Confidence: {result['confidence']:.2f}")
        print(f"Model: {result['model']}")
    except Exception as e:
        print(f"Error during inference: {e}")

def main():
    parser = argparse.ArgumentParser(description="Test OMNITRIX Emotion Classification")
    parser.add_argument("--text", type=str, help="Text to analyze")
    args = parser.parse_args()

    if args.text:
        run_inference(args.text)
    else:
        print("Entering Interactive Mode. Type 'exit' or 'quit' to stop.")
        while True:
            user_input = input("\nEnter text to analyze: ")
            if user_input.lower() in ['exit', 'quit']:
                break
            if not user_input.strip():
                continue
            run_inference(user_input)

if __name__ == "__main__":
    main()
