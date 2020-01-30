using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using sopka.Models.Abstract;

namespace sopka.Models.ContextModels
{
	/// <summary>
	/// Папка базы знаний
	/// </summary>
	public class ArticleFolder: IOwnedByCompany
	{
		public int Id { get; set; }

		public int? IdParent { get; set; }

		public string Title { get; set; }

        public int? CompanyId { get; set; }

        public List<Article> Articles { get; set; }
    }
}
