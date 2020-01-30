using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace sopka.Models.ContextModels
{
	[Table("IncidentStatus")]
	public class IncidentStatus
	{
		
		public int Id { get; set; }

		public string Name { get; set; }

		public string Responsible { get; set; }

		public short? StatusType { get; set; }

		[JsonIgnore]
		public List<Incident> Incidents { get; set; }

		public AppRole ResponsibleRole { get; set; }

		public List<IncidentStatusTransition> Transitions { get; set; }

		public static IncidentStatus New =>
			new IncidentStatus()
			{
				Id = 1
			};
	}
}
