import os
import uvicorn
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("recall-ai-mcp-server")

@mcp.tool()
def health_check() -> str:
    return "Recall AI MCP ready to serve!"

app = mcp.streamable_http_app()
if __name__ == "__main__":
    print("Recall AI MCP server started successfully")
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=int(os.getenv("MCP_PORT", "8000")),
    )