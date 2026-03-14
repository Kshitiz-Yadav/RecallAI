import requests
from middleware import license_key_var
from config import RECALL_AI_API_BASE_URL
from .response_utils import safe_parse_response

def register_tools(mcp):
    
    @mcp.tool()
    def health_check() -> dict:
        """
        Checks if the Recall AI MCP server and its backend are operational.
        Returns a welcome message and status from the system.
        Use this to verify the server is reachable when starting the MCP server.
        """
        license_key = license_key_var.get()

        response = requests.get(
            f"{RECALL_AI_API_BASE_URL}/api/HealthCheck/health",
            headers={"X-License-Key": license_key}
        )
        return safe_parse_response(response)