using System;
using Newtonsoft.Json;
using sopka.Services;

namespace sopka.Models.ContextModels
{
    public class Company
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public DateTimeOffset CreateDate { get; set; }

        public bool Paid { get; set; }

        public DateTimeOffset? PaidTo { get; set; }

        public int TariffId { get; set; }

        public Tariff Tariff { get; set; }

        public Balance Balance { get; set; }

        public string ResponsiblePersonFIO { get; set; }

        public string ResponsiblePersonEmail { get; set; }

        public string ResponsiblePersonPhone { get; set; }

        public string Comment { get; set; }

        public int? NewTariffId { get; set; }

        public Tariff NewTariff { get; set; }

        public CompanyTariff CompanyTariff { get; set; }
    }

    public class Balance
    {
        public int Id { get; set; }

        public decimal Value { get; set; }

        public int CompanyId { get; set; }

        [JsonIgnore]
        public Company Company { get; set; }
    }
}