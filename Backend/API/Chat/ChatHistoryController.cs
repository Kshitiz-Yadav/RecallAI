using API.Data;
using API.Dto.Chat;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static API.Common;

namespace API.Chat;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ChatHistoryController : Controller
{
    private readonly DatabaseContext _dbContext;
    private readonly ILogger<ChatHistoryController> _logger;

    public ChatHistoryController(DatabaseContext dbContext, ILogger<ChatHistoryController> logger)
    {
        _logger = logger;
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetQuestionsHistory([FromQuery] int skip = 0, [FromQuery] int top = 0)
    {
        _logger.LogInformation("Get questions history received.");
        var userId = GetUserId(User);

        var queries = await _dbContext.ChatHistory
                .OrderByDescending(q => q.TimeStamp)
                .Where(q => q.UserId == userId)
                .Skip(skip)
                .Select(h => new ChatHistoryResponse
                {
                    TimeStamp = h.TimeStamp,
                    ChatModel = h.ChatModel,
                    Question = h.Question,
                    Answer = h.Answer
                })
                .ToListAsync();

        if(top > 0)
        {
            queries = queries.Take(top).ToList();
        }

        return Ok(queries);
    }
}
