FROM python:3.11.13-slim-bullseye

# Set working directory
WORKDIR /app

# Copy dependency file & install
COPY ../requirements.txt /workspace/requirements.txt
RUN pip install --upgrade pip && pip install --no-cache-dir -r /workspace/requirements.txt


# Install system packages: Node.js, npm, git, curl
RUN apt-get update && \
    apt-get install -y curl git && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs


# Install Angular CLI globally for use in the container
RUN npm install -g @angular/cli

# Copy project code
COPY . .


# Run FastAPI app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
