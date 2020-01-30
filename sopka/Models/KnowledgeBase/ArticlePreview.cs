using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sopka.Models.KnowledgeBase
{
    public class ArticlePreview
    {
        public int Id { get; set; }
        
        public string Title { get; set; }

        public string Solution { get; set; }

        public string Description { get; set; }
    }
}
