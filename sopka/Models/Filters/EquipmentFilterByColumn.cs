namespace sopka.Models.Filters
{
	/// <summary>
	/// Фильтр по столбцам таблицы
	/// </summary>
	public class EquipmentFilterByColumn
	{
		/// <summary>
		/// Id
		/// </summary>
		public int Id { get; set; }

		/// <summary>
		/// Название оборудования
		/// </summary>
		public string Name { get; set; }

		/// <summary>
		/// Тип
		/// </summary>
		public string TypeName { get; set; }

		/// <summary>
		/// Имя в сети
		/// </summary>
		public string NetworkName { get; set; }

		/// <summary>
		/// Аппаратная платформа
		/// </summary>
		public string Platform { get; set; }

		/// <summary>
		/// IP адрес
		/// </summary>
		public string IP { get; set; }

		/// <summary>
		/// Сегмент (Vlan)
		/// </summary>
		public string Vlan { get; set; }
	}
}
