using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace sopka.Models.ContextModels
{
	public class IncidentStatusHistory
	{
		public int Id { get; set; }

		public int IdIncident { get; set; }
	
		public string IdUser { get; set; }

		public DateTimeOffset ChangeTime { get; set; }

		public int? OldStatusId { get; set; }

		public int NewStatusId { get; set; }

		public string NewComment { get; set; }

		[JsonIgnore]
		public Incident Incident { get; set; }

		public List<IncidentFieldHistory> FieldHistory { get; set; }
	}
}
