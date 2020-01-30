using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using sopka.Models;
using sopka.Models.ContextModels;
using sopka.Models.Options;
using sopka.Models.ViewModels;

namespace sopka.Services
{
	public class FileService
	{
		private readonly SopkaDbContext _context;
		private readonly ILogger<FileService> _logger;
        private readonly FileServiceOptions _options;
		

		public FileService(SopkaDbContext context, IOptions<FileServiceOptions> options, ILogger<FileService> logger)
		{
			_context = context;
			_logger = logger;
            _options = options.Value;
        }

		public async Task<List<FilePart>> Store(int entityId, string entityType, List<IFormFile> files)
        {
            if (files == null || files.Any() == false) return null;

			var (path, folderNum) = await GetFolderPath(files.Count);
			var tasks = new List<Task<FilePart>>();
			var normalizedFileNames = new List<string>();
			foreach (var file in files)
			{
                if (file != null)
                {
                    var (normalizedName, previewName) = GetFileName(path, file.FileName, normalizedFileNames);
                    tasks.Add(
                        StoreFile(file, Path.Combine(path, normalizedName), Path.Combine(path, previewName),
                        folderNum, entityId, entityType));
                }
            }
			await Task.WhenAll(tasks);
			await _context.SaveChangesAsync();
            return tasks.Select(x => x.Result).ToList();
        }

		public async Task<List<FileViewModel>> GetFiles(int entityId, string entityType)
        {
            return await GetFiles(new[] {entityId}, entityType);
		}

        public async Task<List<FileViewModel>> GetFiles(int entityId, Type entityType)
        {
            return await GetFiles(new[] { entityId }, entityType.Name.ToLower());
        }


        public async Task<List<FileViewModel>> GetFiles(IEnumerable<int> entityIds, string entityType)
		{
			var type = GetType(entityType);
			var files = await _context
				.Files
				.AsNoTracking()
				.Where(x => entityIds.Contains(x.ParentId) && x.Type == type)
				.Select(x => new {x.Id, x.PreviewId, x.ContentType, x.FileName, x.FileSize, x.ParentId})
				.ToListAsync();

			return files
				.Select(x => new FileViewModel()
				{
					Id = x.Id,
					ContentType = x.ContentType,
					Name = x.FileName,
					PreviewId = x.PreviewId,
					Size = x.FileSize,
                    ParentId = x.ParentId
				})
				.ToList();
		}


		private async Task<(string, int)> GetFolderPath(int filesNumber)
		{
			var folderNumber = (await _context.Files.CountAsync() > 0) ? _context.Files.Max(x => x.FolderNum) : 0;
			var filesCount = await _context.Files.Where(x => x.FolderNum == folderNumber).CountAsync();

			if ((filesCount + filesNumber) >= _options.MaxFilesPerFolder) folderNumber++;
			return (Path.Combine(_options.RootFolder, $"Folder{folderNumber:D3}"), folderNumber);
		}

		private (string, string) GetFileName(string folder, string fileName, List<string> normalizedFileNames)
		{
			var normalizedName = NormalizeFilename(fileName, folder, normalizedFileNames);
			var previewFileName = string.Empty;
			normalizedFileNames.Add(normalizedName);
			if (Path.GetExtension(fileName).Equals(".pdf", StringComparison.CurrentCultureIgnoreCase) == false)
			{
				previewFileName = NormalizeFilename(Path.ChangeExtension(fileName, "pdf"), folder, normalizedFileNames);
				normalizedFileNames.Add(previewFileName);
			}
			return (normalizedName, previewFileName);
		}

		private async Task<FilePart> StoreFile(IFormFile file, string targetFileName, string targetPreviewName, int folderNum, int entityId, string entityType)
		{
			byte[] preview = null;
			var directory = Path.GetDirectoryName(targetFileName);
			if (Directory.Exists(directory) == false)
			{
				Directory.CreateDirectory(directory);
			}

			if (Path.GetExtension(targetFileName).Equals(".pdf", StringComparison.CurrentCultureIgnoreCase) == false)
			{
				preview = await AddPdfCopyFromNew(file);
			}

			var fileEntity = new FilePart()
			{
				FolderNum = folderNum,
				FileName = Path.GetFileName(targetFileName),
				FullPath = targetFileName,
				ParentId = entityId,
				Type = GetType(entityType),
				ContentType = file.ContentType
			};
			
			if (preview != null)
			{
				using (var writer = File.Create(targetPreviewName))
				{
					await writer.WriteAsync(preview);
					await writer.FlushAsync();
				}

				var previewEntity = new FilePart()
				{
					FileName = Path.GetFileName(targetPreviewName),
					ContentType = MediaTypeNames.Application.Pdf,
					FileSize = preview.Length,
					FolderNum = folderNum,
					FullPath = targetPreviewName,
					Type = FilePart.EntityType.Preview
				};

				_context.Files.Add(previewEntity);
				await _context.SaveChangesAsync();
				fileEntity.PreviewId = previewEntity.Id;
			}

			using (var writer = File.Create(targetFileName))
			{
				using (var reader = file.OpenReadStream())
				{
					await reader.CopyToAsync(writer);
					fileEntity.FileSize = reader.Length;
					await writer.FlushAsync();
				}
			}
			_context.Files.Add(fileEntity);
            return fileEntity;
        }

		private FilePart.EntityType GetType(string entityType)
		{
			switch (entityType)
			{
				case "article":
				{
					return FilePart.EntityType.Article;
				}
                case "incident":
                {
                    return FilePart.EntityType.Incident;
                }

                case "vulnerability":
                {
                    return FilePart.EntityType.Vulnerability;
                }
                default:
				{
					throw new ArgumentException($"Unknown type {entityType}", nameof(entityType));
				}
			}
		}

		private async Task<byte[]> AddPdfCopyFromNew(IFormFile file)
		{
			var ext = Path.GetExtension(file.FileName)?.Replace(".", string.Empty) ?? string.Empty;

			if (!string.IsNullOrEmpty(ext) &&
				(PDFConverter.PDFConverter.GetWordExtensions().Contains(ext, StringComparer.InvariantCultureIgnoreCase) ||
				 PDFConverter.PDFConverter.GetExcelExtensions().Contains(ext, StringComparer.InvariantCultureIgnoreCase) ||
				 PDFConverter.PDFConverter.GetPowerPointExtensions().Contains(ext, StringComparer.InvariantCultureIgnoreCase)))
			{
				var fileName = string.Empty;
				try
				{
					using (var stream = file.OpenReadStream())
					{
						fileName = PDFConverter.PDFConverter.GetTempFileName() + Path.GetExtension(file.FileName);
						using (var writer = File.Create(fileName))
						{
							await stream.CopyToAsync(writer);
							await writer.FlushAsync();
						}
					}
					return PDFConverter.PDFConverter.ConvertToPDF(fileName, _options.OfficeApplicationVisible);
				}
				catch (Exception ex)
				{
					_logger.LogError(ex.Message);
					return null;
				}
				finally
				{
					if (File.Exists(fileName))
					{
						File.Delete(fileName);
					}
				}
			}
			return null;
		}

		/// <summary>
		/// Выдает не повторящееся имя для файла 
		/// </summary>
		private string NormalizeFilename(string fileName, string folder, List<string> normalizedFileNames)
		{
			if (string.IsNullOrEmpty(fileName))
			{
				return fileName;
			}

			if (File.Exists(Path.Combine(folder, fileName.ToLower())) == false && normalizedFileNames.Contains(fileName.ToLower()) == false)
			{
				return fileName;
			}

			int i = 1, maxTries = 100;
			var tryName = $"{Path.GetFileNameWithoutExtension(fileName).ToLower()}({i}){Path.GetExtension(fileName).ToLower()}";
			while (File.Exists(Path.Combine(folder, tryName.ToLower())) || normalizedFileNames.Contains(tryName.ToLower()) && i < maxTries)
			{
				i++;
				tryName = $"{Path.GetFileNameWithoutExtension(fileName).ToLower()}({i}){Path.GetExtension(fileName).ToLower()}";
			}

			if (i == maxTries)
			{
				throw new Exception("Unable to rename file");
			}
			return $"{Path.GetFileNameWithoutExtension(fileName)}({i}){ Path.GetExtension(fileName).ToLower()}";
		}

		public async Task<FilePart> GetPreview(int id)
		{
			var entity = await _context.Files
				.AsNoTracking()
				.Where(x => x.Id == id)
				.FirstOrDefaultAsync();

			if (entity == null) throw new ArgumentException("Entity not found", nameof(id));
			if (entity.ContentType == MediaTypeNames.Application.Pdf && entity.Type != FilePart.EntityType.Preview)
			{
				if (File.Exists(entity.FullPath))
				{
					return entity;
				}
				throw new FileNotFoundException("Requested file not found", entity.FullPath);
			}

			if (entity.Type != FilePart.EntityType.Preview )
			{
				if(entity.PreviewId == null) throw new FileNotFoundException("Preview file not found");
				var preview = await _context.Files.AsNoTracking().Where(x => x.Id == entity.PreviewId).FirstOrDefaultAsync();
				if(preview == null) throw new FileNotFoundException("Preview entity not found");
				if (File.Exists(preview.FullPath))
				{
					return preview;
				}
				throw new FileNotFoundException("Requested preview file not found", preview.FullPath);
			}
			throw new FileNotFoundException("Wrong file format", entity.FullPath);
		}

		public async Task<FilePart> GetFile(int id)
		{
			var entity = await _context.Files
				.AsNoTracking()
				.Where(x => x.Id == id)
				.FirstOrDefaultAsync();

			if (entity == null) throw new ArgumentException("File not found", nameof(id));
			if (entity.Type != FilePart.EntityType.Preview)
			{
				if (File.Exists(entity.FullPath))
				{
					return entity;
				}
				throw new FileNotFoundException("Requested file not found", entity.FullPath);
			}
			throw new FileNotFoundException("Wrong file format", entity.FullPath);
		}

		public async Task Remove(int[] fileIds)
		{
			if (fileIds != null)
			{
				var files = await _context.Files.Where(x => fileIds.Contains(x.Id)).ToListAsync();
				if (files.Any())
				{
					var previewIds = files.Where(x => x.PreviewId != null).Select(x => x.PreviewId.Value).ToList();
					if (previewIds.Any())
					{
						var previews = await _context.Files.Where(x => previewIds.Contains(x.Id)).ToListAsync();
						files.AddRange(previews);
					}

					_context.Files.RemoveRange(files);
					files.AsParallel().ForAll(file =>
					{
						if (File.Exists(file.FullPath))
						{
							File.Delete(file.FullPath);
						}
					});
					await _context.SaveChangesAsync();
				}
			}
		}

        public async Task<List<FilePart>> ImportFiles(int entityId, string entityType, int[] fileIds)
        {
            if (fileIds != null && fileIds.Length > 0)
            {
                var files = await _context.Files.AsNoTracking().Where(x => fileIds.Contains(x.Id)).ToListAsync();
                var previewIds = files.Where(x => x.PreviewId != null).Select(x => x.PreviewId).ToList();
                var previews = await _context.Files.AsNoTracking().Where(x => previewIds.Contains(x.Id)).ToListAsync();
                files.AddRange(previews);

                var (folder, folderNum) = await GetFolderPath(files.Count);

                var normalizedNames = new List<string>();
                var result = new List<FilePart>();

                foreach (var file in files)
                {
                    var previousId = file.Id;
                    file.Id = 0;
                    var realFile = file.FullPath;
                    var normalizedName = NormalizeFilename(file.FileName, folder, normalizedNames);
                    normalizedNames.Add(normalizedName);
                    file.FolderNum = folderNum;
                    file.FullPath = Path.Combine(folder, normalizedName);
                    try
                    {
                        var directory = Path.GetDirectoryName(file.FullPath);
                        if (Directory.Exists(directory) == false)
                        {
                            Directory.CreateDirectory(directory);
                        }

                        using (var readStream =
                            new FileStream(realFile, FileMode.Open, FileAccess.Read, FileShare.Read))
                        {
                            using (var writeStream =
                                new FileStream(file.FullPath, FileMode.CreateNew, FileAccess.Write))
                            {
                                await readStream.CopyToAsync(writeStream);
                                await writeStream.FlushAsync();
                            }
                        }
                        
                        if (file.Type == FilePart.EntityType.Preview)
                        {
                            var parent = files.FirstOrDefault(x => x.PreviewId == previousId);
                            if (parent == null) throw new Exception($"Unbound preview ID = {file.Id}");
                            _context.Add(file);
                            await _context.SaveChangesAsync();
                            parent.PreviewId = file.Id;
                        }
                        else
                        {
                            file.ParentId = entityId;
                            file.Type = GetType(entityType);
                            result.Add(file);
                        }
                    }
                    catch (FileNotFoundException ex)
                    {
                        _logger.LogError($"File does not exist {ex.FileName}");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex.Message);
                    }
                }

                _context.AddRange(result);
                await _context.SaveChangesAsync();
                return result;
            }

            return null;
        }
	}
}
