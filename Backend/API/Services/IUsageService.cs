using API.Enums;

namespace API.Services;

public interface IUsageService
{
    public Task<int> CheckResourceUsage(Resource resource, int userId, long expectedInput);

    public Task UpdateResourceUsage(Resource resource, int userId, long inputChange, long outputChange = 0);

    public int GetExpectedTokensCount(string text);
}
