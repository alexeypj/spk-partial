using System;
using System.ComponentModel.DataAnnotations;

namespace sopka.Models
{
    public class CompanyEditModel
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public DateTimeOffset? PaidTo { get; set; }
        [Required]
        public int ObjectsCount { get; set; }
        [Required]
        public int UsersCount { get; set; }
        [Required]
        public int EquipmentsCount { get; set; }
        public bool Support { get; set; }
        public string Comment { get; set; }
        public string ResponsiblePersonEmail { get; set; }
    }
}