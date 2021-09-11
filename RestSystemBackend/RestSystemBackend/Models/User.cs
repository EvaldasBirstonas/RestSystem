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
        [Required, Display(Name = "Id")]
        public int Id { get; set; }
        [Required, Display(Name = "Name")]
        public string Email { get; set; }
        [Required, Display(Name = "Email")]
        public string Name { get; set; }
        [Required, Display(Name = "Password")]
        [JsonIgnore] public string Password { get; set; }
        [Display(Name = "Role")]
        public Roles Roles { get; set; }
    }
    [Flags]
    public enum Roles
    {
        User = 1,
        Admin = 2
    }
}
