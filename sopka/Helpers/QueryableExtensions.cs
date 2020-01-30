using System.Linq;
using sopka.Models.Abstract;

namespace sopka.Helpers
{
    public static class QueryableExtensions
    {
        public static IQueryable<T> WhereCompany<T>(this IQueryable<T> query, int? companyId)
            where T: IOwnedByCompany
        {
            if (!companyId.HasValue)
            {
                return query;
            }
            return query.Where(x => x.CompanyId == companyId);
        }
    }
}