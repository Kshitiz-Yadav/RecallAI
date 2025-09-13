using System.Security.Claims;

namespace API;

public static class Common
{
    public static int GetUserId(ClaimsPrincipal user)
    {
        var userIdHeader = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdHeader == null || !int.TryParse(userIdHeader, out int userId))
        {
            return -1;
        }

        return userId;
    }
}
