# Backend API

The FastAPI service receives anonymous complaints, runs the privacy and ML pipeline, and returns high-level safety indicators.

## Complaint submission

```text
POST /api/complaint
```

Example request:

```json
{
  "text": "student complaint text",
  "category": "optional category",
  "location": "optional location",
  "timeframe": "optional timeframe",
  "desired_action": "optional requested action",
  "urgency": "optional urgency"
}
```

Example response:

```json
{
  "risk_level": "HIGH",
  "distress_category": "DISTRESS",
  "emotion": "fear",
  "confidence": 0.82,
  "tracking_token": "..."
}
```

## Track a complaint

```text
GET /api/complaint/{token}
```

The client uses the anonymous tracking token to retrieve the current status and risk metrics.

## Health check

```text
GET /
```

Example response:

```json
{
  "service": "OMNITRIX",
  "status": "online"
}
```

## Risk mapping

The application maps model emotions to broad indicators:

```text
Anger, disapproval, disgust, fear -> HIGH / DISTRESS
Sadness                         -> MEDIUM / DISTRESS
Joy, admiration, surprise       -> LOW / POSITIVE
Other or neutral                -> LOW / NEUTRAL
```

This mapping is an application rule, not ground truth for an incident.
