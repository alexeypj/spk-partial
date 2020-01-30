using Newtonsoft.Json;
using System.Collections.Generic;
using sopka.Models.ContextModels.Directories;

namespace sopka.Models.ContextModels
{
    public class IncidentCriticality
    {
        public int Id { get; set; }

        public string Criticality { get; set; }

        [JsonIgnore]
        public List<AttackDirectory> AttackDirectories { get; set; }
    }
}