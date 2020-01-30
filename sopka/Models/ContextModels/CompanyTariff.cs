using System.Reflection.Metadata.Ecma335;
using Newtonsoft.Json;

namespace sopka.Models.ContextModels
{
    public class CompanyTariff
    {
        public int Id { get; set; }

        public int CompanyId { get; set; }

        public int TariffId { get; set; }

        public int UsersCount { get; set; }

        public int ObjectsCount { get; set; }

        public int EquipmentsCount { get; set; }

        public bool Support { get; set; }

        public decimal Price { get; set; }

        [JsonIgnore]
        public Tariff Tariff { get; set; }

        [JsonIgnore]
        public Company Company { get; set; }
    }
}