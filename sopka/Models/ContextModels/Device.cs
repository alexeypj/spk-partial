using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using sopka.Models.ContextModels.Directories;

namespace sopka.Models.ContextModels
{
	[Table("Device")]
	public class Device
	{
		public Device()
		{
			HDD = new List<HDD>();
			Memory = new List<Memory>();
			OperationSystems = new List<OperationSystem>();
			Software = new List<Software>();
		}

		public int Id { get; set; }

		[Column("idEquipments")]
		public int IdEquipment { get; set; }
		
		[Column("dSyslogAddress")]
		public string SyslogAddress { get; set; }

		[Column("dEventRegist")]
		public string EventRegist { get; set; }

		[Column("dAWZ")]
		public string AWZ { get; set; }

		[Column("dAWZdate")]
		public DateTimeOffset? AWZDate { get; set; }

		[Column("dAWZdatePeriode")]
		public string AWZDatePeriod { get; set; }

		[Column("dIAF")]
		public string IAF { get; set; }

		[Column("dAdditional")]
		public string Additional { get; set; }

		#region Сетевые настройки

		/// <summary>
		/// Имя в сети
		/// </summary>
		[Column("dNetworkName")]
		public string NetworkName { get; set; }

		/// <summary>
		/// IP адрес
		/// </summary>
		[Column("dIp")]
		public string IP { get; set; }

		/// <summary>
		/// Маска
		/// </summary>
		[Column("dMask")]
		public string Mask { get; set; }

		/// <summary>
		/// Шлюз
		/// </summary>
		[Column("dGateway")]
		public string Gateway { get; set; }

		/// <summary>
		/// Сегмент
		/// </summary>
		[Column("dVlan")]
		public string Vlan { get; set; }

		public int? IdCPU { get; set; }

		/// <summary>
		/// Количество процесоров
		/// </summary>
		[Column("dCPUCount")]
		public short? CPUCount { get; set; }

		#endregion
		[JsonIgnore]
		public Equipment Equipment { get; set; }

		public List<HDD> HDD { get; set; }

		public List<Memory> Memory { get; set; }

		public List<OperationSystem> OperationSystems { get; set; }

		public List<Software> Software { get; set; }

		public CPUDirectory CPU { get; set; }

		public List<NetworkAdapter> NetworkAdapters { get; set; }
	}
}
