
using API.Dto.Chat;
using API.Dto.Qdrant;
using API.Enums;
using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace API.Services;

public class OpenAiChatClient : IOpenAiChatClient
{
    private readonly HttpClient _client;
    private readonly ILogger<OpenAiChatClient> _logger;
    private readonly string _apiKey;
    private const string OpenAiResponsesUri = "https://api.openai.com/v1/responses";
    private readonly string _systemPrompt;
    private readonly IUsageService _usageService;

    public OpenAiChatClient(ILogger<OpenAiChatClient> logger, AppSettings appSettings, IUsageService usageService)
    {
        _client = new HttpClient();
        _logger = logger;
        _apiKey = appSettings.OpenAiKey;
        _systemPrompt = appSettings.SystemPrompt;
        _usageService = usageService;
    }

    public async Task<ChatResponse> GetAnswerAsync(string question, List<SearchResult> chunks, ChatModel model, int maxWords, int userId, CancellationToken cancellationToken)
    {
        var prompt = BuildInputPrompt(question, chunks);
        var requestBody = new OpenAiChatRequest
        {
            Model = model.ToModelString(),
            Input = new List<OpenAiChatInputItem>
            {
                new() { Role = "system", Content = _systemPrompt },
                new() { Role = "user", Content = prompt }
            },
            MaxOutputTokens = (maxWords / 3) * 4   // 1 token -> 3/4 word
        };

        var modelUsage = await _usageService.CheckResourceUsage(model.ToResource(), userId, _usageService.GetExpectedTokensCount(_systemPrompt + prompt));
        if (modelUsage != 0)
        {
            _logger.LogError("Model usage limit reached with code {code}", modelUsage);
            return new ChatResponse
            {
                IsSuccessful = false,
                StatusCode = HttpStatusCode.BadRequest,
                Response = modelUsage == 1 ?
                "You have reached your monthly usage limit for this model." :
                "This requset exceeds beyond your monthly usage limit for this model."
            };
        }

        var requestJson = JsonSerializer.Serialize(requestBody);

        var request = new HttpRequestMessage(HttpMethod.Post, OpenAiResponsesUri)
        {
            Content = new StringContent(requestJson, Encoding.UTF8, "application/json")
        };

        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
        var response = await _client.SendAsync(request, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            var errorText = await response.Content.ReadAsStringAsync(cancellationToken);
            _logger.LogError("OpenAI request failed: {status} - {error}", response.StatusCode, errorText);
            return new ChatResponse
            {
                IsSuccessful = false,
                StatusCode = response.StatusCode,
                Response = $"Failed to get LLM response: {errorText}"
            };
        }

        var responseJson = await response.Content.ReadAsStringAsync(cancellationToken);
        var responseBody = JsonSerializer.Deserialize<OpenAiChatResponse>(responseJson);
        await _usageService.UpdateResourceUsage(model.ToResource(), userId, responseBody?.Usage?.InputTokens ?? 0, responseBody?.Usage?.OutputTokens ?? 0);
        
        var output = responseBody?.OutputText ?? string.Join(" ", responseBody?.Output.SelectMany(o => o.Content.Select(c => c.Text)) ?? new List<string>());

        return new ChatResponse
        {
            IsSuccessful = true,
            StatusCode = HttpStatusCode.OK,
            Response = output
        };
    }

    private static string BuildInputPrompt(string question, List<SearchResult> chunks)
    {
        var sb = new StringBuilder();
        sb.AppendLine("Use the following notes to answer the question that follows.");
        sb.AppendLine();
        sb.AppendLine("Notes:");
        foreach (var chunk in chunks)
        {
            sb.AppendLine($"- {chunk.Content}");
        }
        sb.AppendLine();
        sb.AppendLine($"Question: {question}");
        return sb.ToString();
    }
}
