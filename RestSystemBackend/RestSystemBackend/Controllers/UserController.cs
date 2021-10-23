using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using RestSystemBackend.DBContext;
using RestSystemBackend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RestSystemBackend.Controllers
{
    [ApiController]
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<UserController> _logger;
        private readonly IConfiguration _configuration;

        public UserController(ILogger<UserController> logger, ApplicationDbContext context, IConfiguration configuration)
        {
            _logger = logger;
            _context = context;
            _configuration = configuration;
        }

        [HttpGet("api/Users/{id}/Games")]
        public IActionResult UserGames(int id)
        {
            //id is Game id
            //id1 is User id
            try
            {
                //var test = _context.Games.Include(x => x.User).ToList();
                var games = _context.Games.Where(x => x.User.Any(y => y.Id == id));

                if (games == null)
                {
                    return NotFound();
                }

                if (games.Count() == 0)
                {
                    return NoContent();
                }

                return Ok(games);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("api/Users/{id}/Achievements")]
        public IActionResult UserAchievements(int id)
        {
            //id is Game id
            //id1 is User id
            try
            {
                //var test = _context.Games.Include(x => x.User).ToList();
                var games = _context.Achievements.Where(x => x.User.Any(y => y.Id == id));

                if (games == null)
                {
                    return NotFound();
                }

                if (games.Count() == 0)
                {
                    return NoContent();
                }

                return Ok(games);
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
