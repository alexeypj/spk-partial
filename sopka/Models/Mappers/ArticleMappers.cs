using System;
using System.Collections.Generic;
using System.Linq;
using sopka.Models.ContextModels;
using sopka.Models.ViewModels;

namespace sopka.Models.Mappers
{
	public static class ArticleMappers
	{
		public static Func<ArticleModel, Article, Article> FromModel = (source, target) =>
		{
			target.Title = source.Title;
			target.Description = source.Description;
			target.Solution = source.Solution;
			target.IdFolder = source.IdFolder;

			#region Тэги

			if (target.Tags == null) target.Tags = new List<ArticleTag>();
			if (source.AttackTypeTags != null && source.AttackTypeTags.Any())
			{
				target.Tags.AddRange(
					source.AttackTypeTags.Select(x => new ArticleTag(target.Id, x, Article.AttackTypeTags)));
			}

			if (source.EquipmentTypeTags != null && source.EquipmentTypeTags.Any())
			{
				target.Tags.AddRange(source.EquipmentTypeTags.Select(x =>
					new ArticleTag(target.Id, x, Article.EquipmentTypeTags)));
			}

			if (source.PlatformTags != null && source.PlatformTags.Any())
			{
				target.Tags.AddRange(
					source.PlatformTags.Select(x => new ArticleTag(target.Id, x, Article.PlatformTags)));
			}

			if (source.MemoryTags != null && source.MemoryTags.Any())
			{
				target.Tags.AddRange(source.MemoryTags.Select(x => new ArticleTag(target.Id, x, Article.MemoryTags)));
			}

			if (source.CPUTags != null && source.CPUTags.Any())
			{
				target.Tags.AddRange(source.CPUTags.Select(x => new ArticleTag(target.Id, x, Article.CPUTags)));
			}

			if (source.RaidTags != null && source.RaidTags.Any())
			{
				target.Tags.AddRange(source.RaidTags.Select(x => new ArticleTag(target.Id, x, Article.RaidTags)));
			}

			if (source.HddTags != null && source.HddTags.Any())
			{
				target.Tags.AddRange(source.HddTags.Select(x => new ArticleTag(target.Id, x, Article.HddTags)));
			}

			if (source.NetworkAdapterTags != null && source.NetworkAdapterTags.Any())
			{
				target.Tags.AddRange(source.NetworkAdapterTags.Select(x =>
					new ArticleTag(target.Id, x, Article.NetworkAdapterTags)));
			}

			if (source.SoftwareTags != null && source.SoftwareTags.Any())
			{
				target.Tags.AddRange(
					source.SoftwareTags.Select(x => new ArticleTag(target.Id, x, Article.SoftwareTags)));
			}

			if (source.OSTags != null && source.SoftwareTags.Any())
			{
				target.Tags.AddRange(source.OSTags.Select(x => new ArticleTag(target.Id, x, Article.OSTags)));
			}

			target.Tags = target.Tags.Distinct().ToList();

			#endregion

			return target;
		};

		public static Func<Article, ArticleModel> FromEntity = source =>
		{
			var result = new ArticleModel()
			{
				Id = source.Id,
				IdFolder = source.IdFolder,
				Title = source.Title,
				Solution = source.Solution,
				Description = source.Description
			};

			if (source.Tags != null && source.Tags.Any())
			{
				result.AttackTypeTags = source.Tags.Where(x => x.DirectoryType == Article.AttackTypeTags)
					.Select(x => x.IdDirectory).ToArray();
				result.EquipmentTypeTags = source.Tags.Where(x => x.DirectoryType == Article.EquipmentTypeTags)
					.Select(x => x.IdDirectory).ToArray();
				result.PlatformTags = source.Tags.Where(x => x.DirectoryType == Article.PlatformTags)
					.Select(x => x.IdDirectory).ToArray();
				result.MemoryTags = source.Tags.Where(x => x.DirectoryType == Article.MemoryTags)
					.Select(x => x.IdDirectory)
					.ToArray();
				result.CPUTags = source.Tags.Where(x => x.DirectoryType == Article.CPUTags).Select(x => x.IdDirectory)
					.ToArray();
				result.RaidTags = source.Tags.Where(x => x.DirectoryType == Article.RaidTags).Select(x => x.IdDirectory)
					.ToArray();
				result.HddTags = source.Tags.Where(x => x.DirectoryType == Article.HddTags).Select(x => x.IdDirectory)
					.ToArray();
				result.NetworkAdapterTags = source.Tags.Where(x => x.DirectoryType == Article.NetworkAdapterTags)
					.Select(x => x.IdDirectory).ToArray();
				result.SoftwareTags = source.Tags.Where(x => x.DirectoryType == Article.SoftwareTags)
					.Select(x => x.IdDirectory).ToArray();
				result.OSTags = source.Tags.Where(x => x.DirectoryType == Article.OSTags).Select(x => x.IdDirectory)
					.ToArray();
			};
			return result;
		};
	}
}
