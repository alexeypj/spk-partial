using System;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using sopka.Models.ContextModels.Directories;

namespace sopka.Models.ContextModels
{
	/// <summary>
	/// Память
	/// </summary>
	public class Memory
	{
		public int Id { get; set; }

		[Column("idDevice")]
		public int IdDevice { get; set; }

		[Column("idRAMDirectory")]
		public int IdRAMDirectory { get; set; }

		
		[Column("mCount")]
		public Int16 Count { get; set; }

		[JsonIgnore]
		public Device Device { get; set; }

		[JsonIgnore]
		public RAMDirectory RamDirectory { get; set; }
	}
}
