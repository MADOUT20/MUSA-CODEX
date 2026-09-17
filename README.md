# OMNITRIX: Privacy-Preserving Student Safety Intelligence

OMNITRIX is a specialized NLP pipeline designed for detecting distress and emotion in code-mixed (Hinglish) text, specifically tailored for student safety assessments. It employs a privacy-first architecture where analysis is performed on a secure backend, returning only high-level safety indicators to the end-user.

## 🚀 Architecture

The system follows a decoupled architecture:

**Android App (Kotlin/Compose)** $ightarrow$ **FastAPI Backend** $ightarrow$ **MuRIL v3 (PEFT/LoRA)** $ightarrow$ **Result**

### 🧠 Machine Learning Core
- **Base Model**: `google/muril-base-cased` (Multilingual Representations for Indian Languages).
- **Tuning Technique**: Parameter-Efficient Fine-Tuning (PEFT) using **LoRA** (Low-Rank Adaptation).
- **Configuration (v3)**:
  - Rank ($r$): 16
  - Alpha ($lpha$): 32
  - Target Modules: `query`, `value`
  - Learning Rate: $5 	imes 10^{-5}$
  - Hardware Acceleration: GPU acceleration.
- **Task**: 10-class emotion classification (Anger, Joy, Disapproval, etc.).

### 🌐 Backend
- **Framework**: FastAPI.
- **Inference**: Real-time prediction using the trained LoRA adapters.
- **Mapping**: Converts raw emotion labels into actionable safety metrics: `Risk Level` and `Distress Category`.

### 📱 Android Integration
- **UI**: Modern Jetpack Compose interface.
- **Connectivity**: Asynchronous HTTP communication with the backend.
- **Privacy**: No raw text is stored on the device; only the safety assessment is displayed.

## 🛠️ Installation & Setup

### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Set up the environment:
   ```bash
   source ../.venv/bin/activate
   ```
3. Start the server:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

### Android App
1. Open the project in Android Studio.
2. Ensure the emulator is running.
3. Run the `app` module.
4. Note: The app is configured to connect to `http://10.0.2.2:8000` (Android Emulator default for localhost).

## 📈 Evaluation (v3)
- **Test Accuracy**: 25.89%
- **Macro F1**: 0.1276
- **Key Performance**: Successfully identifies dominant distress emotions (Disapproval, Anger) while maintaining a frozen base model to prevent catastrophic forgetting.
