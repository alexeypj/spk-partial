using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using sopka.Models.Abstract;
using sopka.Models.ContextModels.Directories;

namespace sopka.Models.ContextModels
{
	public class ObjectEntry: IOwnedByCompany
	{
		public int Id { get; set; }

		/// <summary>
		/// Название объекта
		/// </summary>
		[StringLength(250)]
		public string ObjectName { get; set; }

		/// <summary>
		/// Адрес объекта
		/// </summary>
		[StringLength(250)]
		public string ObjectAddress { get; set; }

		/// <summary>
		/// Контактное лицо
		/// </summary>
		[StringLength(250)]
		public string ContactPerson { get; set; }

		/// <summary>
		/// Должность
		/// </summary>
		[StringLength(250)]
		public string ContactPosition { get; set; }

		/// <summary>
		/// Телефон
		/// </summary>
		[StringLength(100)]
		public string ContactPhone { get; set; }

		/// <summary>
		/// E-mail
		/// </summary>
		[StringLength(250)]
		public string ContactMail { get; set; }

		/// <summary>
		/// Id типа объекта
		/// </summary>
		public int IdType { get; set; }

		/// <summary>
		/// Id филиал
		/// </summary>
		public int? IdBranch { get; set; }

		public double? Latitude { get; set; }

		public double? Longitude { get; set; }

        public int? CompanyId { get; set; }

        public List<Equipment> Equipment { get; set; }

        public BranchDirectory Branch { get; set; }

        public ObjectDirectory ObjectType { get; set; }
    }
}
