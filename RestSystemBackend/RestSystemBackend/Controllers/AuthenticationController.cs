using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using RestSystemBackend.DBContext;
using RestSystemBackend.Dtos;
using RestSystemBackend.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace RestSystemBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AuthenticationController> _logger;
        private readonly IConfiguration _configuration;

        public AuthenticationController(ILogger<AuthenticationController> logger, ApplicationDbContext context, IConfiguration configuration)
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
        [Route("register")]
        public IActionResult Register(RegisterDto user)
        {
            try
            {
                _logger.LogDebug(user.ToString());
                if (_context.Users.Any(x => x.Email == user.Email))
                {
                    return BadRequest(new { message = "User already exists" });
                }
                var newUser = new User
                {
                    Email = user.Email,
                    Name = user.Name,
                    Password = BCrypt.Net.BCrypt.HashPassword(user.Password),
                    Roles = Roles.User
                };

                _context.Users.Add(newUser);
                _context.SaveChanges();
                return Ok(newUser);
                //return Created("success", _context.Users.Add(newUser));
            }
            catch
            {
                return StatusCode(500);
            }
        }
        [HttpPost]
        [Route("login")]
        public IActionResult Login(LoginDto user)
        {
            var existingUser = _context.Users.FirstOrDefault(u => u.Email == user.Email);
            if (existingUser == null || !BCrypt.Net.BCrypt.Verify(user.Password, existingUser.Password))
            {
                return BadRequest(new { message = "Incorrect information" });
            }

            var userRoles = existingUser.Roles;
            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, existingUser.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };
            
            foreach (var userRole in Enum.GetValues(typeof(Roles)))
            {
                if (existingUser.Roles.HasFlag((Roles)userRole))
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole.ToString()));
                }
            }
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SecretKey"]));
            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                //expires: DateTime.Now.AddSeconds(5),
                expires: DateTime.Now.AddHours(3),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            Response.Cookies.Append("jwt", new JwtSecurityTokenHandler().WriteToken(token), new CookieOptions
            {
                HttpOnly = true
            });

            return Ok(new
            {
                message = "Success"
            });
        }

        [HttpPost]
        [Route("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");

            return Ok(new
            {
                message = "Success"
            });
        }

        [HttpGet]
        [Route("information")]
        public IActionResult CookieInformation()
        {
            if (Request.Cookies["jwt"] != null)
            {
                var jsonToken = new JwtSecurityTokenHandler().ReadJwtToken(Request.Cookies["jwt"]);

                return Ok(new
                {
                    User = jsonToken.Claims.First(x => x.Type == ClaimTypes.Name),
                    Token = jsonToken,
                    jwt = Request.Cookies["jwt"]
                });
            }
            else
            {
                return StatusCode(500);
            }
        }

        [HttpGet]
        [Route("Validate")]
        public IActionResult ValidateAndReturnUser()
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_configuration["JWT:SecretKey"]);
                tokenHandler.ValidateToken(Request.Cookies["jwt"], new TokenValidationParameters
                {
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true
                }, out SecurityToken validatedToken);

                if(validatedToken.ValidTo < DateTime.UtcNow)
                {
                    Logout();
                    return Unauthorized();
                }

                var issuer = tokenHandler.ReadJwtToken(Request.Cookies["jwt"]).Claims.First(x => x.Type == ClaimTypes.Name);

                return Ok(_context.Users.FirstOrDefault(x => x.Email == issuer.Value));
            } 
            catch
            {
                Logout();
                return Unauthorized();
            }
        }
        /*
        private readonly UserManager<User> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IConfiguration _configuration;
        
        public AuthenticationController(UserManager<User> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
            _configuration = configuration;
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            var userExists = await userManager.FindByNameAsync(model.Username);
            if (userExists != null)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User already exists!" });
            User user = new User()
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.Username
            };
            var result = await userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User creation failed! Please check user details and try again." });
            return Ok(new Response { Status = "Success", Message = "User created successfully!" });
        }

        [Authorize(Roles = UserRoles.Admin)]
        [HttpPost]
        [Route("register-admin")]
        public async Task<IActionResult> RegisterAdmin([FromBody] RegisterModel model)
        {
            var userExists = await userManager.FindByNameAsync(model.Username);
            if (userExists != null)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User already exists!" });
            User user = new User()
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.Username
            };
            var result = await userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User creation failed! Please check user details and try again." });
            if (!await roleManager.RoleExistsAsync(UserRoles.Admin))
                await roleManager.CreateAsync(new IdentityRole(UserRoles.Admin));
            if (!await roleManager.RoleExistsAsync(UserRoles.User))
                await roleManager.CreateAsync(new IdentityRole(UserRoles.User));
            if (await roleManager.RoleExistsAsync(UserRoles.Admin))
            {
                await userManager.AddToRoleAsync(user, UserRoles.Admin);
            }
            return Ok(new Response { Status = "Success", Message = "User created successfully!" });
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await userManager.FindByNameAsync(model.Username);
            if (user != null && await userManager.CheckPasswordAsync(user, model.Password))
            {
                var userRoles = await userManager.GetRolesAsync(user);
                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };
                foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                }
                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SecretKey"]));
                var token = new JwtSecurityToken(
                    issuer: _configuration["JWT:ValidIssuer"],
                    audience: _configuration["JWT:ValidAudience"],
                    expires: DateTime.Now.AddHours(3),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

                Response.Cookies.Append("jwt", new JwtSecurityTokenHandler().WriteToken(token), new CookieOptions
                {
                    HttpOnly = true
                });

                return Ok(new
                {
                    message = "Success"
                });
            }
            return Unauthorized();
        }

        [HttpPost]
        [Route("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");

            return Ok(new
            {
                message = "Success"
            });
        }

        [HttpGet]
        [Route("information")]
        public IActionResult CookieInformation()
        {
            if (Request.Cookies["jwt"] != null)
            {
                var jsonToken = new JwtSecurityTokenHandler().ReadJwtToken(Request.Cookies["jwt"]);

                return Ok(new
                {
                    User = jsonToken.Claims.First(x => x.Type == ClaimTypes.Name),
                    Token = jsonToken,
                    jwt = Request.Cookies["jwt"]
                });
            }
            else
            {
                return StatusCode(500);
            }
        }
        */
    }
}
