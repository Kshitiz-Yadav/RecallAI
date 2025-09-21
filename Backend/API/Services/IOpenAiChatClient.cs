using API.Dto.Chat;
using API.Dto.Qdrant;
using API.Enums;

namespace API.Services;

public interface IOpenAiChatClient
{
    Task<ChatResponse> GetAnswerAsync(string question, List<SearchResult> chunks, ChatModel model, int maxWords, int userId, CancellationToken cancellationToken);
}