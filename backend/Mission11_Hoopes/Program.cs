using Microsoft.EntityFrameworkCore;
using Mission11_Hoopes.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors();

// Connect to SQLite database
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite("Data Source=Bookstore.sqlite"));

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
app.UseAuthorization();

// Map your controller endpoints (e.g. /api/books)
app.MapControllers();

app.Run();