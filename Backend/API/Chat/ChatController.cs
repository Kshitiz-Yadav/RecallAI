using API.Data;
using API.Data.Domain;
using API.Dto.Chat;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static API.Common;
using static API.ApiResponseResolver;
using System.Net;
using System.Text.Json;

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
    private const double MinConfidenceThreshold = 0.3;

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

        var embedding = await _openAiEmbedder.EmbedTextAsync(request.Question, userId);
        _logger.LogInformation("Question Embedded Successfully");

        var chunks = await _qdrantClient.SearchAsync(userId.ToString(), request.FileGuids, embedding, request.TopK);
        _logger.LogInformation("{num} Relevant Chunks Retrieved Successfully", chunks.Count);

        var chatResponse = await _openAiChatClient.GetAnswerAsync(request.Question, chunks, request.ChatModel, request.MaxWords, userId, cancellationToken);
        if (!chatResponse.IsSuccessful)
        {
            _logger.LogError("Failed to get LLM response: {status}", chatResponse.StatusCode);
            return ProcessApiResponse(chatResponse.StatusCode, chatResponse.Response);
        }

        try
        {
            var llmResponse = JsonSerializer.Deserialize<LlmResponse>(chatResponse.Response);
            
            if (llmResponse != null && llmResponse.HasContext && llmResponse.Confidence >= MinConfidenceThreshold)
            {
                await _dbContext.AddAsync<ChatHistory>(new ChatHistory
                {
                    UserId = userId,
                    TimeStamp = DateTime.UtcNow,
                    ChatModel = request.ChatModel,
                    Question = request.Question,
                    Answer = llmResponse.Response
                }, cancellationToken);
                
                await _dbContext.SaveChangesAsync(cancellationToken);
                chatResponse.Response = llmResponse.Response;
            }
            else
            {
                chatResponse.Response = "No relevant information could be found in your notes to answer this question. Please try rephrasing or providing more context.";
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to parse LLM response as JSON");
            chatResponse.Response = "An error occured while fetching the response. Please try again!";
        }

        _logger.LogInformation("LLM response fetched successfully.");
        return ProcessApiResponse(HttpStatusCode.OK, null, chatResponse);
    }
}