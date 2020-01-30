using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace sopka.Helpers
{
	public static class ModelStateHelper
	{
		public static List<string> GetErrors(this ModelStateDictionary modelState)
		{
			var errorResult = new List<string>();
			using (var errorEnumerator = modelState.GetEnumerator())
			{
				while (errorEnumerator.MoveNext()) errorResult.AddRange(errorEnumerator.Current.Value.Errors.Select(x => x.ErrorMessage));
			}
			return errorResult;
		}
	}
}
