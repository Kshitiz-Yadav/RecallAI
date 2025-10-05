using API.Dto;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace API;

public static class ApiResponseResolver
{
    public static IActionResult ProcessApiResponse(HttpStatusCode statusCode, string? message = null, object? obj = null)
    {
        var response = new ApiResponse
        {
            StatusCode = statusCode,
            Message = message,
            Object = obj
        };

        switch (statusCode)
        {
            case HttpStatusCode.OK:
            case HttpStatusCode.Created:
            case HttpStatusCode.NoContent:
                return new OkObjectResult(response);
            case HttpStatusCode.BadRequest:
                return new BadRequestObjectResult(response);
            case HttpStatusCode.Unauthorized:
                return new UnauthorizedObjectResult(response);
            case HttpStatusCode.NotFound:
                return new NotFoundObjectResult(response);
            default:
                return new StatusCodeResult((int)HttpStatusCode.InternalServerError);
        }
    }
}
