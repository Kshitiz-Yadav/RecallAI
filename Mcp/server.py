import os
import uvicorn
from mcp.server.fastmcp import FastMCP
from middleware import LicenseKeyMiddleware
from tools import register_all_tools

mcp = FastMCP("recall-ai-mcp-server")
register_all_tools(mcp)

app = mcp.streamable_http_app()
app.add_middleware(LicenseKeyMiddleware)

if __name__ == "__main__":
    print("Recall AI MCP server started successfully")
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=int(os.getenv("MCP_PORT", "8000")),
    )