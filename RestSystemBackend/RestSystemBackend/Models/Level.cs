using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace RestSystemBackend.Models
{
    public class Level
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        public string Picture { get; set; }
        [Required]
        [JsonIgnore]
        public virtual Game Game { get; set; }

        public ICollection<Achievement> Achievement { get; set; }
    }
}
