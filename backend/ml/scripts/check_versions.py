import torch
import transformers
import peft
import sys
import os

print(f"Executable: {sys.executable}")
print(f"Python: {sys.version}")
print(f"PyTorch: {torch.__version__}")
print(f"Transformers: {transformers.__version__}")
print(f"PEFT: {peft.__version__}")
device = "mps" if torch.backends.mps.is_available() else "cpu"
print(f"Device: {device}")
