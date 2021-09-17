using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
    public class LevelsController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<LevelsController> _logger;
        private readonly IConfiguration _configuration;

        public LevelsController(ILogger<LevelsController> logger, ApplicationDbContext context, IConfiguration configuration)
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
        public IActionResult GetLevel(int id)
        {
            _logger.LogInformation(id.ToString());

            //var existingLevel = _context.Levels.Include(x => x.Game).Where(x => x.Id == id).FirstOrDefault();
            return Ok(_context.Levels.Include(x => x.Game).Where(x => x.Id == id).FirstOrDefault());
        }

        [HttpGet]
        public IActionResult GetAllLevels()
        {
            return Ok(_context.Levels.Include(x => x.Game).ToList());
        }

        [HttpPost]
        public IActionResult Create(LevelCreateDto level)
        {
            _logger.LogInformation(level.ToString());
            try
            {
                var existingGame = _context.Games.Find(level.Game);
                if(existingGame == null)
                {
                    throw new Exception();
                }
                var newLevel = new Level
                {
                    Name = level.Name,
                    Description = level.Description,
                    Picture = level.Picture,
                    Game = existingGame
                };
                _context.Levels.Add(newLevel);
                _context.SaveChanges();
                return Ok(newLevel);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, LevelEditDto level)
        {
            _logger.LogInformation(level.ToString());
            try
            {
                var dbLevel = _context.Levels.Include(x => x.Game).FirstOrDefault(x => x.Id == id);
                dbLevel.Name = level.Name;
                dbLevel.Description = level.Description;
                dbLevel.Picture = level.Picture;
                _context.SaveChanges();
                return Ok(dbLevel);
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
                _context.Levels.Remove(_context.Levels.Find(id));
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
