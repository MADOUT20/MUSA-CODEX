# Privacy Architecture

OMNITRIX transforms complaint text before normalization, external language processing, or ML inference.

```text
Raw complaint
      -> Privacy transformation
      -> Language normalization
      -> MuRIL V5-B inference
      -> Privacy-safe persistence
```

## Transformation layer

Implementation: `backend/privacy/transformer.py`

The current layer handles:

- Email addresses, phone numbers, and URLs
- Student IDs, roll numbers, and enrollment numbers
- Social handles and long numeric identifiers
- Titled person references and selected academic context
- Unicode, whitespace, capitalization, punctuation, and word-elongation normalization

Example:

```text
Raw: My roll number is 23AIML12345 and my email is student@example.com.
Safe: my roll number is [STUDENT_ID] and my email is [EMAIL].
```

## Storage model

The database is designed to store `privacy_safe_text` and analysis metadata rather than the original complaint. Tracking tokens are returned to the client while only their SHA-256 hashes are persisted.

## Important limitation

This layer reduces exposure but is not a mathematical guarantee that re-identification is impossible. Indian names, context-dependent identifiers, false positives, cross-complaint linkage, and stylometric privacy remain active evaluation areas.

## Threat model

Privacy-relevant signals include:

- Direct identifiers such as names, emails, phones, IDs, and social handles
- Contextual identifiers such as staff references, rooms, and academic details
- Stylometric signals such as capitalization, repeated punctuation, and word elongation

Run the privacy tests with:

```bash
python -m pytest -q
```
