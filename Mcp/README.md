# Recall AI — MCP Server

This README talks about the **MCP (Model Context Protocol) server** for Recall AI. 

It exposes Recall AI's RAG functionality as tools that any MCP-compatible AI agent can call over HTTP - including Cursor, Claude Desktop, or your own custom AI application.

---

## Architecture

```
    AI Agents (Cursor, Custom AI App)
            │
            │  HTTP  (X-License-Key header)
            ▼
      MCP Server  (Python / FastMCP)
            │
            │  REST API
            ▼
      Recall AI Backend  (C# / .NET)
```

The MCP server acts as a **thin adapter** - it authenticates requests using a per-user license key, then forwards them to the Recall AI backend. It does not hold any state of its own.

---

## Running Locally

### Prerequisites

- Python 3.11+
- A valid Recall AI license key (see [Authentication](#authentication))

### Setup Steps

#### Running in Docker
See [Runing the full stack using Docker Compose](../README.md/#runing-the-full-stack-using-docker-compose).

#### Running as an individual service

1. Clone the repository and navigate to the MCP folder

    ```powershell
    git clone <repo-url>
    cd Mcp
    ```

2. Create and activate a virtual environment

    ```powershell
    # Windows
    python -m venv .venv
    .venv\Scripts\activate

    # Mac / Linux
    python -m venv .venv
    source .venv/bin/activate
    ```

3. Install dependencies

    ```powershell
    pip install -r requirements.txt
    ```

4. Start the server

    ```bash
    python server.py
    ```

The server will start on `http://localhost:8000`. You should see:

```
Recall AI MCP server started successfully
```

### Testing with MCP Inspector

The [MCP Inspector](https://github.com/modelcontextprotocol/inspector) is a browser-based tool for manually calling and inspecting MCP tools.

1. Run the following:
    ```bash
    npx @modelcontextprotocol/inspector
    ```
2. Open the Inspector in your browser
3. Enter your server URL: `http://localhost:8000/mcp`
4. Add your license key header: `X-License-Key: YOUR_KEY`
5. Browse and invoke tools interactively

### Connecting an AI Agent

Add the following to the MCP settings of your AI Agent:

```json
{
  "mcpServers": {
    "recall-ai-mcp-server": {
      "url": "http://localhost:8000/mcp",
      "headers": {
        "X-License-Key": "YOUR_LICENSE_KEY_HERE"
      }
    }
  }
}
```

---

## Available Tools

| Tool | Description |
|---|---|
| `ask_question` | Ask a natural language question against your knowledge base |
| `get_chat_history` | Retrieve past chat history with optional pagination |
| `get_files_summary` | Get a summary list of all uploaded files |
| `get_current_month_usage` | Check remaining usage per AI model and storage |
| `get_resource_limits` | Get resource limits for each model and storage tier |
| `health_check` | Verify the MCP server and backend are operational |
| `get_available_tools` | List all available tools and their purpose |
| `get_server_info` | Return metadata about this MCP server |

---

## Authentication

Each request to the MCP server must include a valid **per-user license key** in the `X-License-Key` HTTP header. The key is validated against the Recall AI backend on every request.

### Generating a License Key

Any authenticated Recall AI user can generate a license key via the backend API:

```bash
POST /api/LicenseKey/create
Authorization: Bearer <your_auth_token>
```
Request Body:
```json
{
  "name": "MyLicenseKey"
}
```
	
Response body
```json
{
  "statusCode": 201,
  "message": "This is the only time you will see this license key. Store it securely.",
  "object": "YOUR_LICENSE_KEY"
}
```

> **Important:** The raw key is returned only once. Store it securely — it cannot be retrieved again. If lost, generate a new one.

Keys can be revoked at any time via the endpoints available in swagger.
