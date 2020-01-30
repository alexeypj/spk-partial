using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace sopka.Models.Filters
{
    [BindProperties(SupportsGet = true)]
    public class VulnerabilitiesFilter
    {
        public bool UseCreateDate { get; set; }
        public string CreateDateFrom { get; set; }
        public string CreateDateTo { get; set; }
        public int? StatusId { get; set; }
        public List<string> Countries { get; set; }
        public List<string> Regulations { get; set; }
        public List<string> Manufacturers { get; set; }
        public List<string> Research { get; set; }
        public List<string> Incidents { get; set; }
        public List<string> Resources { get; set; }
    }
}
