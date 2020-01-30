using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace sopka.Models.ContextModels
{
	[Table("IncidentStatusTransition")]
	public class IncidentStatusTransition
	{
		public int InitialStatusId { get; set; }

		public int FinalStatusId { get; set; }

		public string ButtonContent { get; set; }

		[JsonIgnore]
		public IncidentStatus InitialStatus { get; set; }

		[JsonIgnore]
		public IncidentStatus FinalStatus { get; set; }
	}
}
