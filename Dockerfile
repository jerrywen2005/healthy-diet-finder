# --- Stage 1: Build Angular frontend ---
FROM node:18-alpine as frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install -g @angular/cli && npm install
COPY frontend/ .
RUN ng build --prod

# --- Stage 2: Build FastAPI backend ---
FROM python:3.11-slim as backend-build
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt
COPY backend/ .

# --- Stage 3: Final runtime image ---
FROM python:3.11-slim
WORKDIR /app
COPY --from=backend-build /app /app
COPY --from=frontend-build /frontend/dist/frontend /app/static
EXPOSE 8000

CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
