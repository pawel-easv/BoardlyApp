using api.Etc;
using api.Services;
using DataAccess;
using Microsoft.EntityFrameworkCore;

public class Program
{
    public static void ConfigureServices(IServiceCollection services)
    {
        services.AddControllers();
        services.AddScoped<IBoardService, BoardService>();
        services.AddOpenApiDocument();
        services.AddDbContext<MyDbContext>((services, options) =>
        {
            options.UseNpgsql(services.GetRequiredService<IConfiguration>()
                .GetValue<string>("Db"));
        });
    }

    public static void Main()
    {
        var builder = WebApplication.CreateBuilder();
        ConfigureServices(builder.Services);

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend",
                policy => policy
                    .AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod());
        });

        var app = builder.Build();

        app.UseCors("AllowFrontend");

        app.UseOpenApi();
        app.UseSwaggerUi();
        app.MapControllers();
        app.GenerateApiClientsFromOpenApi("/../../client/src/models/generated-client.ts").GetAwaiter().GetResult();
        app.Run();
    }
}