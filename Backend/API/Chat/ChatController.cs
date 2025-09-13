using API.Data;
using API.Data.Domain;
using API.Dto.Chat;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static API.Common;

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
    private readonly DatabaseContext _dbContext;
    private const string InsufficientInfoMsg = "Sorry! I could not find relevant information in your notes.";

    public ChatController(ILogger<ChatController> logger, IOpenAiEmbedder openAiEmbedder, IQdrantClient qdrantClient, IOpenAiChatClient openAiChatClient, DatabaseContext dbContext)
    {
        _logger = logger;
        _openAiEmbedder = openAiEmbedder;
        _qdrantClient = qdrantClient;
        _openAiChatClient = openAiChatClient;
        _dbContext = dbContext;
    }

    [HttpPost]
    public async Task<IActionResult> AskQuestion([FromBody] AskQuestionRequest request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Ask question request received");
        var userId = GetUserId(User);

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

        if(chatResponse.Response != InsufficientInfoMsg)
        {
            await _dbContext.AddAsync<ChatHistory>(new ChatHistory
            {
                UserId = userId,
                TimeStamp = DateTime.UtcNow,
                Question = request.Question,
                Answer = chatResponse.Response
            }, cancellationToken);
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("LLM response fetched successfully.");
        return Ok(chatResponse);
    }
}