import requests
from middleware import license_key_var
from config import RECALL_AI_API_BASE_URL
from .response_utils import safe_parse_response

def register_tools(mcp):

    @mcp.tool()
    def get_chat_history(skip: int = 0, top: int = 0) -> dict:
        """
        Gets chat history (skip: int, top: int).
        Returns a list of chat history entries (TimeStamp, ChatModel, Question, Answer).
        Use this to retrieve a user's chat history with optional paging (skip/top).
        """
        license_key = license_key_var.get()

        response = requests.get(
            f"{RECALL_AI_API_BASE_URL}/api/ChatHistory",
            params={"skip": skip, "top": top},
            headers={"X-License-Key": license_key}
        )
        return safe_parse_response(response)

    @mcp.tool()
    def ask_question(question: str, file_guids: list = None, top_k: int = 5, chat_model: str = 0, max_words: int = 500) -> dict:
        """
        Asks a question from the existing files (question: str, file_guids: list|None, top_k: int, chat_model: int, max_words: int). Do not change the chat_model and max_words unless the user specifically agrees to.
        Returns the chat response object from the backend, including the LLM answer and any metadata.
        Use this to submit a user question and retrieve a generated answer.
        """
        license_key = license_key_var.get()

        payload = {
            "Question": question,
            "FileGuids": file_guids or [],
            "TopK": top_k,
            "ChatModel": chat_model,
            "MaxWords": max_words
        }

        response = requests.post(
            f"{RECALL_AI_API_BASE_URL}/api/Chat",
            json=payload,
            headers={"X-License-Key": license_key}
        )
        return safe_parse_response(response)
