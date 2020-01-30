using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace sopka.Models.ContextModels.Directories
{
	public class CPUDirectory
	{
		public int Id { get; set; }

		[Required]
		[MaxLength(250)]
		public string Manufacturer { get; set; }

		[Required]
		[MaxLength(250)]
		public string Product { get; set; }

		[Range(1, Int32.MaxValue)]
		public int? CoresNumber { get; set; }

		[JsonIgnore]
		public List<Device> Devices { get; set; }
	}
}
