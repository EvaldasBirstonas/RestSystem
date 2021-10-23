using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using RestSystemBackend.DBContext;
using RestSystemBackend.Dtos;
using RestSystemBackend.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace RestSystemBackend.Controllers
{
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
        [HttpGet("api/Games/{id}/Levels/{id1}")]
        public IActionResult GetLevel(int id, int id1)
        {
            _logger.LogInformation(id1.ToString());
            try
            {
                if (_context.Games.Find(id) == null)
                {
                    return NotFound();
                }
                //var level = _context.Levels.Where(x => x.Game.Id == game_id).Where(y => y.Id == level_id).ToList();
                //var existingLevel = _context.Levels.Include(x => x.Game).Where(x => x.Id == id).FirstOrDefault();
                return Ok(_context.Levels.Include(x => x.Game).Include(x => x.Achievement).Where(x => x.Id == id1).FirstOrDefault());
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("api/Games/{id}/Levels/")]
        public IActionResult GetAllLevels(int id)
        {
            try
            {
                if (_context.Games.Find(id) == null)
                {
                    return NotFound();
                }
                //var levels = _context.Levels.Where(y => y.Game.Id == game_id).ToList();
                return Ok(_context.Levels.Include(x => x.Achievement).Where(y => y.Game.Id == id).ToList());
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("api/Games/{id}/Levels/")]
        public IActionResult Create(int id, [FromForm] LevelCreateDto level)
        {
            _logger.LogInformation(level.ToString());
            try
            {
                var existingGame = _context.Games.Find(id);
                if(existingGame == null)
                {
                    return NotFound();
                }
                var newLevel = new Level
                {
                    Name = level.Name,
                    Description = level.Description,
                    Picture = SaveImage(level.Picture),
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

        [Authorize(Roles = "Admin")]
        [HttpPut("api/Games/{id}/Levels/{id1}")]
        public IActionResult Put(int id, int id1, [FromForm] LevelEditDto level)
        {
            _logger.LogInformation(level.ToString());
            try
            {
                var dbLevel = _context.Levels.Include(x => x.Game).FirstOrDefault(x => x.Id == id1);
                if(dbLevel == null)
                {
                    return NotFound();
                }
                dbLevel.Name = level.Name;
                dbLevel.Description = level.Description;
                if (!level.KeepImage)
                {
                    dbLevel.Picture = SaveImage(level.Picture);
                }
                _context.SaveChanges();
                return Ok(dbLevel);
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("api/Games/{id}/Levels/{id1}")]
        public IActionResult Delete(int id, int id1)
        {
            try
            {
                _context.Levels.Remove(_context.Levels.Find(id1));
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

        private string SaveImage(IFormFile imageFile)
        {
            if (imageFile == null)
            {
                return null;
            }

            string newFileName = DateTime.Now.ToString("yymmssfff") + Path.GetExtension(imageFile.FileName);
            string path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\images", newFileName);

            using (Stream stream = new FileStream(path, FileMode.Create))
            {
                imageFile.CopyTo(stream);
            }

            return newFileName;
        }
    }
}
