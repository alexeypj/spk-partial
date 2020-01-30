﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace sopka.Models.ContextModels.Directories
{
	public class RAMDirectory
	{
		public int Id { get; set; }

		[MaxLength(250)]
		public string Title { get; set; }

		public double Volume { get;set; }

		[JsonIgnore]
		public List<Memory> Memory { get; set; }
	}
}