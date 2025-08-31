using API.Dto.Chat;
using API.FileEmbedding.Services;
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

    public ChatController(ILogger<ChatController> logger, IOpenAiEmbedder openAiEmbedder, IQdrantClient qdrantClient)
    {
        _logger = logger;
        _openAiEmbedder = openAiEmbedder;
        _qdrantClient = qdrantClient;
    }

    [HttpPost]
    public async Task<IActionResult> AskQuestion([FromBody] AskQuestionRequest request, CancellationToken _)
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

        var results = await _qdrantClient.SearchAsync(userId.ToString(), request.FileGuids, embedding, request.TopK);
        _logger.LogInformation("{num} Relevant Chunks Retrieved Successfully", results.Count);

        // LLM Intergation Pending

        return Ok(results);
    }
}