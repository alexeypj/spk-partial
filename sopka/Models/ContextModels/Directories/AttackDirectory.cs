using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace sopka.Models.ContextModels.Directories
{
	public class AttackDirectory
	{
		public int Id { get; set; }
		
		[MaxLength(250)]
		public string Title { get; set; }

		[MaxLength(450)]
		public string Description { get; set; }

        public int? CriticalityDefault { get; set; }

        public string CriticalityName => IncidentCriticality?.Criticality;

        public IncidentCriticality IncidentCriticality { get; set; }

        public List<Incident> Incidents { get; set; }
	}
}
