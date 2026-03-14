import requests
from middleware import license_key_var
from config import RECALL_AI_API_BASE_URL
from .response_utils import safe_parse_response

def register_tools(mcp):

    @mcp.tool()
    def get_file(file_id: str) -> dict:
        """
        Gets a single file by its ID. Use the get_files_summary tool to get the file ID.
        Returns the file details including name, size, upload date, status, and content.
        Use this when you need to retrieve a specific file the user has uploaded.
        """
        license_key = license_key_var.get()

        response = requests.get(
            f"{RECALL_AI_API_BASE_URL}/api/FilesManagement/file",
            params={"fileId": file_id},
            headers={"X-License-Key": license_key}
        )
        return safe_parse_response(response)

    @mcp.tool()
    def get_files_summary() -> dict:
        """
        Gets a summary list of all files for the current user.
        Returns file GUIDs, names, sizes, upload dates, and statuses.
        Use this to list available files before retrieving a specific one with get_file.
        """
        license_key = license_key_var.get()

        response = requests.get(
            f"{RECALL_AI_API_BASE_URL}/api/FilesManagement/filesSummary",
            headers={"X-License-Key": license_key}
        )
        return safe_parse_response(response)
