using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace RestSystemBackend.Dtos
{
    public class EditGameDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        public bool KeepImage { get; set; }
        public IFormFile Picture { get; set; }
    }
}
