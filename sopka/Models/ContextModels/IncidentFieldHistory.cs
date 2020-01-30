using System;
using Newtonsoft.Json;

namespace sopka.Models.ContextModels
{
	public class IncidentFieldHistory
	{
		public IncidentFieldHistory() { }

		public IncidentFieldHistory(string fieldName, string newVal, string oldVal)
		{
			FieldName = fieldName;
			NewVal = newVal;
			OldVal = oldVal;
			ChangeDate = DateTimeOffset.Now;;
		}

		public int Id { get; set; }

		public int IdIncidentStatusHistory { get; set; }

		public string NewVal { get; set; }
	
		public string OldVal { get; set; }
		
		public string FieldName { get; set; }

		public string IdUser { get; set; }

		public DateTimeOffset ChangeDate { get; set; }

		[JsonIgnore]
		public IncidentStatusHistory StatusHistory { get; set; }
	}
}
