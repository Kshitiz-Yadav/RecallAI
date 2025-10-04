using MailKit.Net.Smtp;
using MimeKit;

namespace API.Services;

public class EmailService : IEmailService
{
    private readonly ILogger<EmailService> _logger;
    private readonly string _smtpEmail;
    private readonly string _smtpPassword;
    private const string SmtpServer = "smtp.gmail.com";
    private const int SmtpPort = 587;

    public EmailService(ILogger<EmailService> logger, AppSettings appSettings)
    {
        _logger = logger;
        _smtpEmail = appSettings.SmtpEmail;
        _smtpPassword = appSettings.SmtpPassword;
    }

    public async Task<string> SendOtpEmail(string receiver)
    {
        _logger.LogInformation("Sending OTP Email to {receiver}", receiver);

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Recall AI", _smtpEmail));
        message.To.Add(new MailboxAddress("", receiver));
        message.Subject = "Verify your email with Recall AI";

        var otp = GenerateOtp();
        message.Body = new TextPart("plain")
        {
            Text = $"Your OTP is {otp}.\nIt will expire in the next 5 minutes.\n\nRecall AI\nYour knowledge, amplified!"
        };

        using var smtpClient = new SmtpClient();
        await smtpClient.ConnectAsync(SmtpServer, SmtpPort, false);
        await smtpClient.AuthenticateAsync(_smtpEmail, _smtpPassword);
        await smtpClient.SendAsync(message);
        await smtpClient.DisconnectAsync(true);

        return otp;
    }


    private static string GenerateOtp()
    {
        const int otpLength = 6;
        var rng = new Random();
        return rng.Next(0, (int)Math.Pow(10, otpLength)).ToString($"D{otpLength}");
    }
}
