using Newtonsoft.Json;

namespace sopka.Models.ContextModels
{
	public class ArticleTag
	{
		public ArticleTag() { }

		public ArticleTag(int idArticle, int idDirectory, string directoryType)
		{
			IdArticle = idArticle;
			IdDirectory = idDirectory;
			DirectoryType = directoryType;
		}

		public int IdArticle { get; set; }

		public int IdDirectory { get; set; }

		public string DirectoryType { get; set; }

		[JsonIgnore]
		public Article Article { get; set; }
	}
}
