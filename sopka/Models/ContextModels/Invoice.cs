using System;
using sopka.Models.Enum;
using sopka.Services;

namespace sopka.Models.ContextModels
{
    public class Invoice
    {
        public int Id { get; set; }

        public int CompanyId { get; set; }

        public decimal Amount { get; set; }

        public string ExternalTransactionId { get; set; }

        public PaymentMethod PaymentMethod { get; set; }

        public InvoiceStatus Status { get; set; }

        public DateTimeOffset CreateDate { get; set; }

        public DateTimeOffset? PaymentDate { get; set; }
    }
}