# Problem & Architecture

## Problem Statement

Anonymous student complaints can contain important distress signals expressed through:

- Indirect or emotional language
- Hinglish and code-mixed text
- Regional-language phrases
- Spelling and transliteration variations
- Informal or fragmented writing
- Repeated punctuation and expressive writing styles

Simply removing explicit names or contact information is not sufficient for strong privacy protection. Writing style itself can potentially provide information that helps link multiple anonymous complaints.

OMNITRIX therefore introduces a privacy transformation stage before downstream language normalization and ML inference.

The objective is to extract safety-relevant signals while minimizing unnecessary identifying and stylistic information.

## Core Pipeline

```text
Anonymous Complaint
        |
        v
Privacy Transformation
        |
        v
Multilingual / Code-Mixed Normalization
        |
        v
MuRIL V5-B Emotion Classification
        |
        v
Risk + Distress Mapping
        |
        v
Privacy-Safe Database Persistence
        |
        v
Admin Dashboard
```

The privacy transformation is performed before normalization and inference.

The system does not intentionally persist the original complaint field. The database stores the transformed `privacy_safe_text` representation along with analysis metadata.

## System Architecture

```text
                    +----------------------+
                    |      Android App     |
                    |   Kotlin WebView     |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    |    FastAPI Backend   |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    | Privacy Transformation|
                    |       Layer          |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    | Language Normalizer  |
                    | Hinglish / Regional  |
                    | / Code-Mixed Text    |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    |      MuRIL V5-B      |
                    |   Emotion Classifier |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    | Risk / Distress      |
                    | Mapping              |
                    +----------+-----------+
                               |
                 +-------------+--------------+
                 |                            |
                 v                            v
        +------------------+        +------------------+
        |     Supabase     |        | Admin Dashboard  |
        | Privacy-Safe DB  |        | React + Vite     |
        +------------------+        +------------------+
```

## Design Principle

The system separates privacy transformation from language understanding and operational review. This allows the project to preserve useful safety signals while reducing exposure of direct identifiers and unnecessary writing-style details.
