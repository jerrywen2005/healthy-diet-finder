FROM python:3.11.13-slim-bullseye

# Set working directory
WORKDIR /app

# Copy dependency file & install
COPY ../requirements.txt /workspace/requirements.txt
RUN pip install --upgrade pip && pip install --no-cache-dir -r /workspace/requirements.txt


# Install Git and other dependencies
RUN apt-get update && apt-get install -y git

# Copy project code
COPY . .

# Run FastAPI app
CMD alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000
