FROM python:3.11.13-slim-bullseye

# Set working directory
WORKDIR /app

# Copy dependency file & install
COPY ../requirements.txt /workspace/requirements.txt
RUN pip install --upgrade pip && pip install --no-cache-dir -r /workspace/requirements.txt


# Install system packages: Node.js, npm, git, curl, postgresql
RUN apt-get update && \
    apt-get install -y curl git postgresql-client && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Install Caddy web server (for reverse proxy)
RUN apt-get install -y debian-keyring debian-archive-keyring apt-transport-https gnupg && \
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg && \
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list && \
    apt-get update && \
    apt-get install caddy -y

# Cleanup
    RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Angular CLI globally for use in the container
RUN npm install -g @angular/cli

# Install Honcho
RUN pip install honcho

# Copy project code
COPY . .

EXPOSE 1560 1561 1562
