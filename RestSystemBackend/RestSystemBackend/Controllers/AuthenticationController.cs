﻿using Microsoft.AspNetCore.Authorization;
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
                    Roles = Roles.User | Roles.Admin
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
                new Claim(ClaimTypes.Name, existingUser.Name),
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
    }
}
