using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using RestSystemBackend.DBContext;
using RestSystemBackend.Dtos;
using RestSystemBackend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RestSystemBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GamesController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<GamesController> _logger;
        private readonly IConfiguration _configuration;

        public GamesController(ILogger<GamesController> logger, ApplicationDbContext context, IConfiguration configuration)
        {
            _logger = logger;
            _context = context;
            _configuration = configuration;
        }
        [HttpGet]
        [Route("ping")]
        public IActionResult Ping()
        {
            return Ok("Ping is working");
        }

        [HttpGet("{id}")]
        public IActionResult GetGame(int id)
        {
            _logger.LogInformation(id.ToString());
            return Ok(_context.Games.Find(id));
        }

        [HttpGet]
        public IActionResult GetAllGames()
        {
            return Ok(_context.Games.ToList());
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, GameDto game)
        {
            _logger.LogInformation(game.ToString());
            try
            {
                var dbGame = _context.Games.FirstOrDefault(x => x.Id == id);
                dbGame.Name = game.Name;
                dbGame.Description = game.Description;
                dbGame.Picture = game.Picture;
                _context.SaveChanges();
                return Ok(dbGame);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost]
        public IActionResult Create(GameDto game)
        {
            _logger.LogInformation(game.ToString());
            try
            {
                var newGame = new Game
                {
                    Name = game.Name,
                    Description = game.Description,
                    Picture = game.Picture
                };
                _context.Games.Add(newGame);
                _context.SaveChanges();
                return Ok(newGame);
            }
            catch
            {
                return BadRequest();
            }
        }
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                _context.Games.Remove(_context.Games.Find(id));
                _context.SaveChanges();
                return Ok(new
                {
                    message = "Success"
                });
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
