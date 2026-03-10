from mcp.server.fastmcp import FastMCP

mcp = FastMCP("recall-ai-mcp-server")

@mcp.tool()
def health_check():
    return "Recall AI MCP ready to serve!"

if __name__ == "__main__":
    print("Recall AI MCP server started successfully")
    mcp.run()