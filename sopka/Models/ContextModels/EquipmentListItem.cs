using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace sopka.Models.ContextModels
{
	public class EquipmentListItem
	{
		public int Id { get; set; }

		public int IdObject { get; set; }

		public string TypeName { get; set; }

		[Column("eModel")]
		public string Model { get; set; }

		/// <summary>
		/// Имя в сети
		/// </summary>
		[Column("eNetworkName")]
		public string NetworkName { get; set; }

		public string Platform { get; set; }

		/// <summary>
		/// IP адрес
		/// </summary>
		[Column("eIp")]
		public string IP { get; set; }

		/// <summary>
		/// Сегмент
		/// </summary>
		public string Vlan { get; set; }

		[JsonProperty(NullValueHandling =  NullValueHandling.Ignore)]
		public string Name { get; set; }

		[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
		public string ObjectAddress { get; set; }

		
	}
}
