using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace sopka.Models.ContextModels
{
    public class IncidentArticle
    {
        public enum RelationType { Based, Resolved, BasedResolved }

        public int IncidentId { get; set; }

        public int ArticleId { get;set; }
        
        [Column("RelationType")]
        public RelationType Type { get;set; }

        public Incident Incident { get;set; }

        [JsonIgnore]
        public Article Article { get;set; }
    }
}
