# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files and restore
COPY API/API.csproj API/
COPY Migrator/Migrator.csproj Migrator/

# Restore all dependencies
RUN dotnet restore API/API.csproj

# Copy entire backend
COPY . .

# Publish app to /out
RUN dotnet publish API/API.csproj -c Release -o /out

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /out ./

# Default port exposed (adjust if needed)
EXPOSE 7070
ENTRYPOINT ["dotnet", "API.dll"]
