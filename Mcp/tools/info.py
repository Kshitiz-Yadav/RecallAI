import os
from mcp.types import ToolAnnotations

def register_tools(mcp):

    @mcp.tool(annotations=ToolAnnotations(
        readOnlyHint=True, destructiveHint=False,
        idempotentHint=True, openWorldHint=False
    ))
    def get_available_tools() -> dict:
        """
        Returns a list of all available tools and their purpose.
        Call this first if you are unsure what tools are available.
        """
        return {
            "tools": [
                {"name": "ask_question", "purpose": "Ask a question against the knowledge base"},
                {"name": "get_chat_history", "purpose": "Retrieve past chat history"},
                {"name": "get_files_summary", "purpose": "Gets a summary list of all files"},
                {"name": "get_current_month_usage", "purpose": "Check remaining usage per AI model and storage"},
                {"name": "get_resource_limits", "purpose": "Gets resource limits for each model and storage"},
                {"name": "health_check", "purpose": "Verify server is operational"},
                {"name": "get_available_tools", "purpose": "List all available tools and their purpose"},
                {"name": "get_server_info", "purpose": "Returns metadata about this MCP server"},
            ]
        }

    @mcp.tool(annotations=ToolAnnotations(
        readOnlyHint=True, destructiveHint=False,
        idempotentHint=True, openWorldHint=False
    ))
    def get_server_info() -> dict:
        """
        Returns metadata about this MCP server including version and capabilities.
        Call this at the start of a session to understand what this server does.
        """
        return {
            "name": "Recall AI MCP Server",
            "version": os.getenv("APP_VERSION", "1.0.0"),
            "description": "Provides access to Recall AI knowledge base and chat functionality. Shares only user specific data based on License Key.",
        }