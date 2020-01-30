using System.ComponentModel.DataAnnotations;

namespace sopka.Models
{
    public class ChangeBalanceModel
    {
        [Required]
        public int CompanyId { get; set; }

        [Range(minimum: 0.01, maximum: double.MaxValue, ErrorMessage = "Поле Сумма должно быть 0.01 или больше")]
        public decimal Amount { get; set; }
    }
}