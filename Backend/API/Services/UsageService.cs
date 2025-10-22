using API.Data;
using API.Data.Domain;
using API.Enums;
using Microsoft.EntityFrameworkCore;
using Tiktoken;

namespace API.Services;

public class UsageService : IUsageService
{
    private readonly AppSettings _appSettings;
    private readonly DatabaseContext _dbContext;
    private readonly string CurrentMonth = $"{DateTime.UtcNow:MM}{DateTime.UtcNow:yyyy}";
    private const int FileStorageResource = 0;

    public UsageService(AppSettings appSettings, DatabaseContext dbContext)
    {
        _appSettings = appSettings;
        _dbContext = dbContext;
    }

    public async Task<int> CheckResourceUsage(Resource resource, int userId, long expectedInput)
    {
        if (resource == FileStorageResource)
        {
            return await CheckFileStorageUsage(expectedInput, userId);
        }

        var resourceUsage = await _dbContext.UserLimits.FirstOrDefaultAsync(ul => ul.UserId == userId && ul.Resource == resource && ul.Month == CurrentMonth);
        if (resourceUsage == null)
        {
            return 0; // 0 = Limit not reached
        }

        var inputLimit = _appSettings.ResourceLimits[resource].Input;
        var outputLimit = _appSettings.ResourceLimits[resource].Output;

        if (resourceUsage.InputUsed >= inputLimit || resourceUsage.OutputUsed >= outputLimit)
        {
            return 1; // 1 = Limit exhausted
        }
        
        if (resourceUsage.InputUsed + expectedInput >= inputLimit)
        {
            return 1; // 1 = Limit will be exhausted
        }

        return 0;
    }

    public async Task UpdateResourceUsage(Resource resource, int userId, long inputChange, long outputChange = 0)
    {
        if (resource == FileStorageResource)
        {
            await UpdateFileStorageUsage(inputChange, userId);
            return;
        }

        var resourceUsage = await _dbContext.UserLimits.FirstOrDefaultAsync(ul => ul.UserId == userId && ul.Resource == resource && ul.Month == CurrentMonth);
        if (resourceUsage == null)
        {
            await _dbContext.AddAsync<Usage>(new Usage
            {
                UserId = userId,
                Resource = resource,
                Month = CurrentMonth,
                InputUsed = long.Max(inputChange, 0),
                OutputUsed = resource == Resource.TextEmbedding3Small ? -1 : long.Max(outputChange, 0)
            });

            await _dbContext.SaveChangesAsync();
            return;
        }

        resourceUsage.InputUsed += inputChange;
        resourceUsage.OutputUsed += outputChange;
        await _dbContext.SaveChangesAsync();
    }

    public int GetExpectedTokensCount(string text)
    {
        var encoder = new Encoder(new Tiktoken.Encodings.Cl100KBase());
        return encoder.CountTokens(text);
    }

    private async Task<int> CheckFileStorageUsage(long requestedValue, int userId)
    {
        var resourceUsage = await _dbContext.UserLimits.FirstOrDefaultAsync(ul => ul.UserId == userId && ul.Resource == FileStorageResource);
        if (resourceUsage == null)
        {
            return 0; // 0 = Limit not reached
        }

        var usageLimit = _appSettings.ResourceLimits[FileStorageResource].Input;
        if (resourceUsage.InputUsed > usageLimit)
        {
            return 1; // 1 = Limit exhausted
        }

        if (resourceUsage.InputUsed + requestedValue > usageLimit)
        {
            return 2; // 2 = Limit will be exhausted
        }

        return 0;
    }

    private async Task UpdateFileStorageUsage(long change, int userId)
    {
        var resourceUsage = await _dbContext.UserLimits.FirstOrDefaultAsync(ul => ul.UserId == userId && ul.Resource == FileStorageResource);
        if (resourceUsage == null)
        {
            await _dbContext.AddAsync<Usage>(new Usage
            {
                UserId = userId,
                Resource = FileStorageResource,
                Month = "000000",
                InputUsed = long.Max(change, 0),
                OutputUsed = 0
            });

            await _dbContext.SaveChangesAsync();
            return;
        }

        resourceUsage.InputUsed += change;
        await _dbContext.SaveChangesAsync();
    }
}
