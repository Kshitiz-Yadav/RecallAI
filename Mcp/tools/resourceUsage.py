import requests
from middleware import license_key_var
from config import RECALL_AI_API_BASE_URL
from .response_utils import safe_parse_response
from mcp.types import ToolAnnotations

def register_tools(mcp):

    @mcp.tool(annotations=ToolAnnotations(
        readOnlyHint=True,
        destructiveHint=False,
        idempotentHint=True,
        openWorldHint=True
    ))
    def get_resource_limits() -> dict:
        """
        Gets resource limits, no input needed.
        Returns the resource limits object from the backend, including configured quotas and limits.
        Use this when you need to display the limits or check current usage for exhaustion.
        """
        license_key = license_key_var.get()

        response = requests.get(
            f"{RECALL_AI_API_BASE_URL}/api/Usage/limits",
            headers={"X-License-Key": license_key}
        )
        return safe_parse_response(response)

    @mcp.tool(annotations=ToolAnnotations(
        readOnlyHint=True,
        destructiveHint=False,
        idempotentHint=False,
        openWorldHint=True
    ))
    def get_current_month_usage() -> dict:
        """
        Gets the current month's usage for the authenticated user, no input needed.
        Returns a mapping of resources to usage values (e.g. Input/Output used and FileStorage totals).
        Use this when you need to show or check the current month's consumption for the user.
        """
        license_key = license_key_var.get()

        response = requests.get(
            f"{RECALL_AI_API_BASE_URL}/api/Usage",
            headers={"X-License-Key": license_key}
        )
        return safe_parse_response(response)
