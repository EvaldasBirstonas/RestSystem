using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace RestSystemBackend.Models
{
    public class Achievement
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        public string Picture { get; set; }
        public Level Level { get; set; }
        [Display(Name = "User")]
        [JsonIgnore]
        public ICollection<User> User { get; set; }
    }
}
