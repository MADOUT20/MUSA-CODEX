# Admin Setup

The admin dashboard is a React/Vite application backed by the FastAPI service.

## 1. Configure the backend

From the repository root:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```

The backend runs at `http://127.0.0.1:8000`.

Create a local `.env` file for server-side configuration:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SECRET_KEY=your_server_side_secret
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=qwen/qwen3-8b
```

Never commit API keys, Supabase secret keys, passwords, or authentication tokens.

## 2. Start the dashboard

In a second terminal:

```bash
cd admin-frontend
npm install
npm run dev
```

The frontend can use:

```env
VITE_API_MODE=api
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## Dashboard features

- Complaint listing and summary statistics
- Category filtering and complaint details
- Privacy-safe text, risk, and emotion display
- Status updates and status history
- API-backed data retrieval

## Admin API

The API is available under `/api/admin`:

```text
GET   /api/admin/summary
GET   /api/admin/complaints
GET   /api/admin/complaints/{complaint_id}
PATCH /api/admin/complaints/{complaint_id}/status
GET   /api/admin/complaints/{complaint_id}/history
```

The current frontend authentication flow is for local/demo use. Production deployment still needs backend authorization and hardened database policies.

## Tests

```bash
python -m pytest -q
```
