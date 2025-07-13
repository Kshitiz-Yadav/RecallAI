# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files and restore
COPY Migrator/Migrator.csproj Migrator/
COPY API/API.csproj API/

RUN dotnet restore Migrator/Migrator.csproj

# Copy all code
COPY . .

# Publish to /out
RUN dotnet publish Migrator/Migrator.csproj -c Release -o /out

# Stage 2: Runtime - use ASP.NET Core runtime instead of base runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /out ./

ENTRYPOINT ["dotnet", "Migrator.dll"]
