using API;
using API.Data;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<AppSettings>(builder.Configuration);
var appSettings = builder.Configuration.Get<AppSettings>() ?? throw new InvalidOperationException("AppSettings section is missing or invalid.");
builder.Services.AddSingleton(appSettings);

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var key = Encoding.ASCII.GetBytes(appSettings.JwtSecret);
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.Zero
        }; 
    });

// Controllers
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Your API", Version = "v1" });

    // Add JWT Bearer auth to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = @"JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// NServiceBus
builder.Host.UseNServiceBus(context =>
{
    var endpointConfiguration = new EndpointConfiguration("FileEmbeddingService");

    endpointConfiguration.UseSerialization<NewtonsoftJsonSerializer>();

    var transport = endpointConfiguration.UseTransport<RabbitMQTransport>();
    transport.ConnectionString(appSettings.NServiceBusConnectionString);
    transport.UseConventionalRoutingTopology(QueueType.Classic);
    transport.DisableBrokerRequirementChecks(BrokerRequirementChecks.None);

    endpointConfiguration.UsePersistence<LearningPersistence>();

    endpointConfiguration.SendFailedMessagesTo("error");
    endpointConfiguration.AuditProcessedMessagesTo("audit");

    endpointConfiguration.EnableInstallers();

    return endpointConfiguration;
});

// Defined URL host for Docker mapping
builder.WebHost.UseUrls("http://0.0.0.0:7070");

// Database
builder.Services.AddDbContext<DatabaseContext>(options => options.UseNpgsql(appSettings?.DatabaseConnectionString));

// Services
builder.Services.AddScoped<IQdrantClient, QdrantClient>();
builder.Services.AddScoped<IOpenAiEmbedder, OpenAiEmbedder>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
}

// Swagger
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.UseHttpsRedirection();

app.Run();