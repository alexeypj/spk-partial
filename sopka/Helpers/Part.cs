using System;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Http;

namespace sopka.Helpers
{
    public class Part
    {
        public Guid? Id { get; set; }

        public long SeqId { get; set; }
        public string ContentType { get; set; }

        public string FileName { get; set; }

        public string Name { get; set; }

        public byte[] FileContents { get; set; }
        public byte[] CheckSum { get; set; }
        public int? FileSize { get; set; }

        public byte EventDataType { get; set; }

        public short? FolderNumber { get; set; }

        public static Part CreateFrom(IFormFile formFile, string newFileName = null)
        {
            var result = new Part
            {
                ContentType = formFile.ContentType,
                FileName = formFile.FileName?.Split('\\').Last(),
                Name = formFile.FileName?.Split('\\').Last()
            };
            if (!string.IsNullOrEmpty(newFileName))
            {
                var fileExtension = Path.GetExtension(formFile.FileName);
                result.FileName = result.Name = $"{newFileName}{fileExtension}";
            }
            using (var ms = new MemoryStream())
            {
                formFile.CopyTo(ms);
                result.FileContents = ms.ToArray();
            }
            return result;
        }
    }
}