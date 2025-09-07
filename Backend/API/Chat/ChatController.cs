using API.Dto.Chat;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Claims;

namespace API.Chat;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ChatController : Controller
{
    private readonly ILogger<ChatController> _logger;
    private readonly IOpenAiEmbedder _openAiEmbedder;
    private readonly IQdrantClient _qdrantClient;
    private readonly IOpenAiChatClient _openAiChatClient;

    public ChatController(ILogger<ChatController> logger, IOpenAiEmbedder openAiEmbedder, IQdrantClient qdrantClient, IOpenAiChatClient openAiChatClient)
    {
        _logger = logger;
        _openAiEmbedder = openAiEmbedder;
        _qdrantClient = qdrantClient;
        _openAiChatClient = openAiChatClient;
    }

    [HttpPost]
    public async Task<IActionResult> AskQuestion([FromBody] AskQuestionRequest request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Ask question request received");
        var userIdHeader = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdHeader == null || !int.TryParse(userIdHeader, out int userId))
        {
            _logger.LogError("Valid User Id header not found");
            return StatusCode((int)HttpStatusCode.Unauthorized, "Valid User Id header not found");
        }

        var embedding = await _openAiEmbedder.EmbedTextAsync(request.Question);
        _logger.LogInformation("Question Embedded Successfully");

        var chunks = await _qdrantClient.SearchAsync(userId.ToString(), request.FileGuids, embedding, request.TopK);
        _logger.LogInformation("{num} Relevant Chunks Retrieved Successfully", chunks.Count);

        var chatResponse = await _openAiChatClient.GetAnswerAsync(request.Question, chunks, request.ChatModel, request.MaxWords, cancellationToken);
        if (!chatResponse.IsSuccessful)
        {
            _logger.LogError("Failed to get LLM response: {status}", chatResponse.StatusCode);
            return StatusCode((int)chatResponse.StatusCode, chatResponse.Response);
        }

        _logger.LogInformation("LLM response fetched successfully.");
        return Ok(chatResponse);
    }
}