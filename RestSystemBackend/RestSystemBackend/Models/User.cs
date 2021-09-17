using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace RestSystemBackend.Models
{
    public class User
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        [JsonIgnore] public string Password { get; set; }
        public ICollection<Achievement> Achievement { get; set; }
        public ICollection<Game> Game  { get; set; }
        public Roles Roles { get; set; }
    }
    [Flags]
    public enum Roles
    {
        User = 1,
        Admin = 2
    }
}
