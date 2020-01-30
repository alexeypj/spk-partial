using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using sopka.Models.ContextModels;

namespace sopka.Models.ViewModels
{
	public class EquipmentViewModel
	{
		public EquipmentViewModel()
		{
			HDD = new List<HDD>();
			Memory = new List<Memory>();
			OperationSystems = new List<OperationSystem>();
			Software = new List<Software>();
		}

		public int Id { get; set; }
		
		public string Name { get; set; }

		public string Type { get; set; }

		public string Platform { get; set; }

		/// <summary>
		/// Размещение
		/// </summary>
		public string Location { get; set; }

		public string Model { get; set; }

		public string SyslogAddresss { get; set; }

		public string EventRegist { get; set; }

		public string AWZ { get; set; }

		public DateTimeOffset AWZDate { get; set; }

		public string AWZDatePeriod { get; set; }

		public string IAF { get; set; }

		#region Сетевые настройки

		/// <summary>
		/// Имя в сети
		/// </summary>
		public string NetworkName { get; set; }

		/// <summary>
		/// IP адрес
		/// </summary>
		public string IP { get; set; }

		/// <summary>
		/// Маска
		/// </summary>
		public string Mask { get; set; }

		/// <summary>
		/// Шлюз
		/// </summary>
		public string Gateway { get; set; }

		/// <summary>
		/// Сегмент
		/// </summary>
		public string Vlan { get; set; }

		#endregion

		public Equipment Equipment { get; set; }

		public List<HDD> HDD { get; set; }

		public List<Memory> Memory { get; set; }

		public List<OperationSystem> OperationSystems { get; set; }

		public List<Software> Software { get; set; }
	}
}
