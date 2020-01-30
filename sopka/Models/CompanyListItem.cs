using System;

namespace sopka.Models
{
    public class CompanyListItem
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public DateTimeOffset CreateDate { get; set; }

        public bool Paid { get; set; }

        public int TariffId { get; set; }

        public string TariffName { get; set; }

        public decimal Balance { get; set; }

        public int UsersCount { get; set; }

        public int ObjectsCount { get; set; }

        public int EquipmentsCount { get; set; }

        public DateTimeOffset? PaidTo { get; set; }

        public bool Support { get; set; }

        public string ResponsiblePersonEmail { get; set; }

        public string Comment { get; set; }
    }
}