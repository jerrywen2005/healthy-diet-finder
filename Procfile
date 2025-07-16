proxy: caddy run
backend: PYTHONPATH=. uvicorn backend.app.main:app --reload --port=1561
frontend: cd frontend && npm run start