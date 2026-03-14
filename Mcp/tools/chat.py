import requests
from middleware import license_key_var
from typing import Annotated, Optional
from pydantic import Field
from config import RECALL_AI_API_BASE_URL
from .response_utils import safe_parse_response
from enums.ChatModel import ChatModel
from mcp.types import ToolAnnotations

def register_tools(mcp):

    @mcp.tool(annotations=ToolAnnotations(
        readOnlyHint=True,
        destructiveHint=False,
        idempotentHint=False,
        openWorldHint=True
    ))
    def get_chat_history(
        skip: Annotated[int, Field(description="Number of records to skip for pagination. Defaults to 0.")] = 0,
        top: Annotated[int, Field(description="Maximum number of records to return. Use 0 for all records.")] = 0
    ) -> dict:
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

    @mcp.tool(annotations=ToolAnnotations(
        readOnlyHint=False,
        destructiveHint=False,
        idempotentHint=False,
        openWorldHint=True
    ))
    def ask_question(
        question: Annotated[str, Field(description="The question to ask the AI against the knowledge base.")],
        file_guids: Annotated[Optional[list], Field(description="Optional list of file GUIDs to scope the search to specific documents. Pass null to search all documents.")] = None,
        top_k: Annotated[int, Field(description="Number of the most relevant chunks to retrieve from the knowledge base. Higher values give more context but slower responses. Defaults to 5.")] = 5,
        chat_model: Annotated[ChatModel, Field(description="The AI model to use. Prefer lower models (Gpt4oMini, Gpt41Mini) unless the user requests a specific one.")] = ChatModel.Gpt4oMini,
        max_words: Annotated[int, Field(description="Maximum number of words in the generated answer. Defaults to 500.")] = 500
    ) -> dict:
        """
        Asks a question from the existing files (question: str, file_guids: list|None, top_k: int, chat_model: int, max_words: int). Do not change the chat_model and max_words unless the user specifically agrees to.
        Returns the chat response object from the backend, including the LLM answer and any metadata.
        Use this to submit a user question and retrieve a generated answer.
        IMPORTANT: Always use default values for top_k, chat_model, and max_words unless the user explicitly requests otherwise. Do not change these parameters on your own judgment.
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
