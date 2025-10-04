namespace API.Services;

public interface IEmailService
{
    public Task<string> SendOtpEmail(string receiver);
}
