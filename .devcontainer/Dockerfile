FROM mcr.microsoft.com/devcontainers/dotnet:8.0

# Install utilities needed by VS Code C# extension
RUN apt-get update && \
    apt-get install -y curl wget unzip git && \
    rm -rf /var/lib/apt/lists/*
