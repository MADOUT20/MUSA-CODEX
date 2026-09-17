import re
import os

log_path = 'backend/ml/models/muril_emotion/training.log'
losses = []
try:
    with open(log_path, 'r', errors='replace') as f:
        for line in f:
            match = re.search(r"'loss':\s*'([\d\.]+)'", line)
            if match:
                losses.append(float(match.group(1)))
except Exception as e:
    print(f'Error: {e}')

if losses:
    print(f"Early: {losses[:5]}")
    print(f"Middle: {losses[len(losses)//2-2 : len(losses)//2+3]}")
    print(f"Final: {losses[-5:]}")
    print(f"Start: {losses[0]}, End: {losses[-1]}")
    print(f"Decreased: {losses[-1] < losses[0]}")
else:
    print('No losses found')
