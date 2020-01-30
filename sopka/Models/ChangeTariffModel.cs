using System.ComponentModel.DataAnnotations;

namespace sopka.Models
{
    public class ChangeTariffModel
    {
        [Required]
        public int TariffId { get; set; }
    }
}