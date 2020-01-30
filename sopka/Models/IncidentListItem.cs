using System;

namespace sopka.Models
{
    public class IncidentListItem
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public DateTimeOffset FixationTime { get; set; }

        public int AttackType { get; set; }

        public string AttackTypeName { get; set; }

        public string SourceCountry { get; set; }

        public string SourceIP { get; set; }
		
		public string StatusName { get; set; }
    }
}