using System.Collections.Generic;

namespace sopka.Models
{
    public class KnowledgeBaseIncidentMatch
    {
	    public KnowledgeBaseIncidentMatch()
	    {
			MatchTags = new List<string>();
	    }

		public int ArticleId { get; set; }

		public string ArticleName { get; set; }

		public List<string> MatchTags { get; set; }
    }
}