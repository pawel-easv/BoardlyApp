namespace App;
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

        var app = builder.Build();

        app.UseRouting();
        
        app.UseOpenApi();
        
        app.UseSwaggerUi();

        app.MapControllers();

        app.Run();

    }
}