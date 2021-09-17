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
        [HttpGet]
        [Route("ping")]
        public IActionResult Ping()
        {
            return Ok("Ping is working");
        }

        [HttpPost]
        [Route("Post")]
        public IActionResult Create(AchievementDto achievement)
        {
            _logger.LogInformation(achievement.ToString());
            try
            {
                var existingLevel = _context.Levels.Find(achievement.Level);
                if (existingLevel == null)
                {
                    throw new Exception();
                }
                var newAchievement = new Achievement
                {
                    Name = achievement.Name,
                    Description = achievement.Description,
                    Picture = achievement.Picture,
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
    }
}
