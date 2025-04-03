using Microsoft.AspNetCore.Mvc;
using Mission11_Hoopes.Data;
using Mission11_Hoopes.Models;

namespace Mission11_Hoopes.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BooksController : ControllerBase
{
    private readonly BookstoreContext _context;

    public BooksController(BookstoreContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetBooks(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 5,
        [FromQuery] string? sort = null,
        [FromQuery] string? category = null) // ✅ NEW PARAM
    {
        var query = _context.Books.AsQueryable();

        // ✅ Apply category filter if provided
        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(b => b.Category == category);
        }

        // ✅ Optional sort by title
        if (!string.IsNullOrEmpty(sort) && sort.ToLower() == "title")
        {
            query = query.OrderBy(b => b.Title);
        }

        var totalItems = query.Count();

        var books = query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return Ok(new { Total = totalItems, Books = books });
    }

    [HttpGet("categories")]
    public IActionResult GetCategories()
    {
        var categories = _context.Books
            .Select(b => b.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToList();

        return Ok(categories);
    }
}