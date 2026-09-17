import os
import sys
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from peft import LoraConfig, get_peft_model, TaskType
from torch.optim import AdamW

# Add backend/ml to path
sys.path.append(os.path.join(os.getcwd(), "backend/ml"))
from config import MODEL_NAME, DEVICE

def verify_lora():
    print(f"Using device: {DEVICE}")
    
    # 1. Load model and tokenizer
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForSequenceClassification.from_pretrained(
        MODEL_NAME, num_labels=10, attn_implementation="eager"
    ).to(DEVICE)
    
    # 2. Discover actual module names
    print("\n--- Discovering Module Names ---")
    all_modules = [name for name, _ in model.named_modules()]
    query_modules = [m for m in all_modules if "query" in m.lower()]
    value_modules = [m for m in all_modules if "value" in m.lower()]
    print(f"Modules containing 'query': {query_modules[:3]} ... (total {len(query_modules)})")
    print(f"Modules containing 'value': {value_modules[:3]} ... (total {len(value_modules)})")

    # 3. Apply LoRA
    # We use the discovered names or standard BERT names. 
    # In Bert, it's usually 'query' and 'value' within the Attention layer.
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

    print("\n--- Verifying Parameter Trainability ---")
    params = list(model.parameters())
    trainable_params = []
    frozen_params = []
    for name, param in model.named_parameters():
        if param.requires_grad:
            trainable_params.append(name)
        else:
            frozen_params.append(name)

    print(f"Total Parameters: {len(params)}")
    print(f"Trainable Parameters: {len(trainable_params)}")
    print(f"Frozen Parameters: {len(frozen_params)}")
    
    lora_trainable = [n for n in trainable_params if "lora_" in n]
    print(f"LoRA parameters marked trainable: {len(lora_trainable)}")
    if not lora_trainable:
        print("CRITICAL: No LoRA parameters are marked as trainable!")
        sys.exit(1)
    
    # Print first few LoRA params
    for n in lora_trainable[:5]:
        print(f"  - {n}")

    # 4. Gradient Flow Check
    print("\n--- Gradient Flow Diagnostic ---")
    optimizer = AdamW(model.parameters(), lr=5e-5)
    
    # Dummy data
    inputs = tokenizer("test text", return_tensors="pt").to(DEVICE)
    labels = torch.tensor([1]).to(DEVICE)
    
    # Forward
    outputs = model(**inputs, labels=labels)
    loss = outputs.loss
    print(f"Initial Loss: {loss.item():.4f}")
    
    # Backward
    loss.backward()
    
    # Check gradients
    lora_grad_norm = 0.0
    classifier_grad_norm = 0.0
    base_grad_norm = 0.0
    
    for name, param in model.named_parameters():
        if param.grad is not None:
            gnorm = param.grad.norm().item()
            if "lora_" in name:
                lora_grad_norm += gnorm
            elif "classifier" in name:
                classifier_grad_norm += gnorm
            else:
                base_grad_norm += gnorm
    
    print(f"LoRA Gradient Norm: {lora_grad_norm:.6f}")
    print(f"Classifier Gradient Norm: {classifier_grad_norm:.6f}")
    print(f"Base MuRIL Gradient Norm: {base_grad_norm:.6f}")
    
    if lora_grad_norm == 0:
        print("\nCRITICAL FAILURE: LoRA gradients are still ZERO.")
        sys.exit(1)
    if base_grad_norm != 0:
        print("\nWARNING: Base model is NOT frozen.")
        
    if lora_grad_norm > 0 and classifier_grad_norm > 0 and base_grad_norm == 0:
        print("\nSUCCESS: LoRA and Classifier gradients are flowing. Base model is frozen.")
        sys.exit(0)
    else:
        print("\nFAILURE: Gradient flow is incorrect.")
        sys.exit(1)

if __name__ == "__main__":
    verify_lora()
