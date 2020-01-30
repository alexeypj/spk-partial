using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sopka.Models.ViewModels
{
	public class FileViewModel
	{
		public int Id { get; set; }

		public int? PreviewId { get; set; }

		public string ContentType { get; set; }

		public string Name { get; set; }

		public long? Size { get; set; }
        public int ParentId { get; set; }
    }
}
