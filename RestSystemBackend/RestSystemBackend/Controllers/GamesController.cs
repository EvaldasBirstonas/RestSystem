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
        [HttpGet("api/Games/{id}")]
        public IActionResult GetGame(int id)
        {
            _logger.LogInformation(id.ToString());
            return Ok(_context.Games.Include(x => x.Level).FirstOrDefault(x => x.Id == id));
        }

        [HttpGet("api/Games/")]
        public IActionResult GetAllGames()
        {
            //var games = _context.Games.Include(x => x.Level).ThenInclude(y => y.Achievement).ToList();
            return Ok(_context.Games);
        }

        [HttpGet("api/GamesExpanded/")]
        public IActionResult GetAllGamesExpanded()
        {
            //var games = _context.Games.Include(x => x.Level).ThenInclude(y => y.Achievement).ToList();
            return Ok(_context.Games.Include(x => x.Level).ThenInclude(y => y.Achievement).ToList());
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("api/Games/{id}")]
        public IActionResult Put(int id, [FromForm] EditGameDto game)
        {
            _logger.LogInformation(game.ToString());
            try
            {
                var dbGame = _context.Games.FirstOrDefault(x => x.Id == id);
                if(dbGame == null)
                {
                    return NotFound();
                }
                dbGame.Name = game.Name;
                dbGame.Description = game.Description;
                if (!game.KeepImage)
                {
                    dbGame.Picture = SaveImage(game.Picture);
                }
                _context.SaveChanges();
                return Ok(dbGame);
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("api/Games/")]
        public IActionResult Create([FromForm] GameDto game)
        {
            _logger.LogInformation(game.ToString());
            //SaveImage(game.Picture);
            try
            {
                var newGame = new Game
                {
                    Name = game.Name,
                    Description = game.Description,
                    Picture = SaveImage(game.Picture)
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

        [Authorize(Roles = "Admin")]
        [HttpDelete("api/Games/{id}")]
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

        [Authorize(Roles = "User")]
        [HttpPost("api/Games/{id1}/Users/{id}")]
        public IActionResult ConnectGameToUser(int id, int id1)
        {
            //id is Game id
            //id1 is User id
            try
            {
                //var test = _context.Games.Include(x => x.User).ToList();
                var tokenHandler = new JwtSecurityTokenHandler();
                Game game = _context.Games.Find(id1);
                User user = _context.Users.Find(id);

                var issuer = tokenHandler.ReadJwtToken(Request.Cookies["jwt"]).Claims.First(x => x.Type == ClaimTypes.Name);
                User jwtHolder = _context.Users.FirstOrDefault(x => x.Email == issuer.Value);

                if (game == null || user == null)
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

                game.User = new List<User>();
                game.User.Add(user);

                _context.SaveChanges();

                return Ok(game);
            }
            catch
            {
                return BadRequest();
            }
        }

        private string SaveImage(IFormFile imageFile)
        {
            if(imageFile == null)
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
        /*
        private string SaveImage(IFormFile imageFile)
        {
            string imageName = DateTime.Now.ToString("yymmssfff") + ".png";
            var imagePath = "F:\\aaaaa\\RestSystem\\RestSystemBackend\\RestSystemBackend\\wwwroot\\images";
            using (var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                imageFile.CopyTo(fileStream);
            }
            return imageName;
        }
        */
    }
}
