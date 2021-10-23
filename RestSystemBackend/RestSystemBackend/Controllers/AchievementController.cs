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
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace RestSystemBackend.Controllers
{
    [ApiController]
    public class AchievementController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AchievementController> _logger;
        private readonly IConfiguration _configuration;

        public AchievementController(ILogger<AchievementController> logger, ApplicationDbContext context, IConfiguration configuration)
        {
            _logger = logger;
            _context = context;
            _configuration = configuration;
        }

        [HttpGet("api/Games/{id}/Levels/{id1}/Achievements/{id2}")]
        public IActionResult GetAchievement(int id, int id1, int id2)
        {
            _logger.LogInformation(id2.ToString());
            return Ok(_context.Achievements.Where(x => x.Level.Game.Id == id).Where(x => x.Level.Id == id1).FirstOrDefault(x => x.Id == id2));
        }

        [HttpGet("api/Games/{id}/Levels/{id1}/Achievements")]
        public IActionResult GetAchievements(int id, int id1)
        {
            try
            {
                var achievements = _context.Achievements.Where(x => x.Level.Game.Id == id).Where(x => x.Level.Id == id1).ToList();
                if(achievements.Count == 0)
                {
                    return NoContent();
                }
                else
                {
                    return Ok(achievements);
                }
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("api/Games/{id}/Levels/{id1}/Achievements/")]
        public IActionResult Create(int id, int id1, [FromForm] AchievementDto achievement)
        {
            _logger.LogInformation(achievement.ToString());
            try
            {
                var existingLevel = _context.Levels.Where(x => x.Game.Id == id).Where(x => x.Id == id1).FirstOrDefault();
                if (existingLevel == null)
                {
                    return NotFound();
                    //throw new Exception();
                }
                var newAchievement = new Achievement
                {
                    Name = achievement.Name,
                    Description = achievement.Description,
                    Picture = SaveImage(achievement.Picture),
                    Level = existingLevel
                };
                _context.Achievements.Add(newAchievement);
                _context.SaveChanges();
                return Ok(newAchievement);
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("api/Games/{id}/Levels/{id1}/Achievements/{id2}")]
        public IActionResult Put(int id, int id1, int id2, [FromForm] AchievementDto achievement)
        {
            _logger.LogInformation(achievement.ToString());
            try
            {
                var dbAchievement = _context.Achievements.Where(x => x.Level.Game.Id == id).Where(x => x.Level.Id == id1).FirstOrDefault(x => x.Id == id2);
                if (dbAchievement == null)
                {
                    return NotFound();
                }
                dbAchievement.Name = achievement.Name;
                dbAchievement.Description = achievement.Description;
                if (!achievement.KeepImage)
                {
                    dbAchievement.Picture = SaveImage(achievement.Picture);
                }
                //dbAchievement.Picture = achievement.Picture;
                _context.SaveChanges();
                return Ok(dbAchievement);
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("api/Games/{id}/Levels/{id1}/Achievements/{id2}")]
        public IActionResult Delete(int id, int id1, int id2)
        {
            try
            {
                _context.Achievements.Remove(_context.Achievements.Where(x => x.Level.Game.Id == id).Where(x => x.Level.Id == id1).FirstOrDefault(x => x.Id == id2));
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

        [Authorize(Roles = "User")]
        [HttpPost("api/Games/{id1}/Levels/{id2}/Achievements/{id3}/Users/{id}")]
        public IActionResult ConnectAchievementToUser(int id, int id1, int id2, int id3)
        {
            //id is Game id
            //id1 is User id
            try
            {
                //var test = _context.Games.Include(x => x.User).ToList();
                //Game game = _context.Games.Find(id1);
                var tokenHandler = new JwtSecurityTokenHandler();
                Achievement achievement = _context.Achievements.Find(id3);
                User user = _context.Users.Find(id);

                var issuer = tokenHandler.ReadJwtToken(Request.Cookies["jwt"]).Claims.First(x => x.Type == ClaimTypes.Name);
                User jwtHolder = _context.Users.FirstOrDefault(x => x.Email == issuer.Value);

                if (achievement == null || user == null)
                {
                    return NotFound();
                }

                if (user.Id != jwtHolder.Id)
                {
                    return BadRequest(new ErrorMessage
                    {
                        Type = "Invalid user",
                        Information = "You are not the user for this request"
                    });
                }

                achievement.User = new List<User>();
                achievement.User.Add(user);

                _context.SaveChanges();

                return Ok(achievement);
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
