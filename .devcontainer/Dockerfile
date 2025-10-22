FROM mcr.microsoft.com/devcontainers/base:ubuntu

# Install curl and wget (needed for .NET installation)
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/*