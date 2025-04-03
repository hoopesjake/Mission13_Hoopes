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

    // GET: /api/books
    [HttpGet]
    public IActionResult GetBooks(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 5,
        [FromQuery] string? sort = null,
        [FromQuery] string? category = null)
    {
        var query = _context.Books.AsQueryable();

        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(b => b.Category == category);
        }

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

    // GET: /api/books/categories
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

    // POST: /api/books
    [HttpPost]
    public IActionResult AddBook([FromBody] Book book)
    {
        _context.Books.Add(book);
        _context.SaveChanges();
        return Ok(book);
    }

    // PUT: /api/books/{id}
    [HttpPut("{id}")]
    public IActionResult UpdateBook(int id, [FromBody] Book updatedBook)
    {
        var existing = _context.Books.Find(id);
        if (existing == null)
        {
            return NotFound();
        }

        existing.Title = updatedBook.Title;
        existing.Author = updatedBook.Author;
        existing.Publisher = updatedBook.Publisher;
        existing.Isbn = updatedBook.Isbn;
        existing.Classification = updatedBook.Classification;
        existing.Category = updatedBook.Category;
        existing.PageCount = updatedBook.PageCount;
        existing.Price = updatedBook.Price;

        _context.SaveChanges();
        return Ok(existing);
    }

    // DELETE: /api/books/{id}
    [HttpDelete("{id}")]
    public IActionResult DeleteBook(int id)
    {
        var book = _context.Books.Find(id);
        if (book == null)
        {
            return NotFound();
        }

        _context.Books.Remove(book);
        _context.SaveChanges();
        return Ok();
    }
}
