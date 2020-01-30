namespace sopka.Models.ContextModels
{
	public class FilePart
	{
		public int Id { get; set; }

		public int? PreviewId { get; set; }

		public string ContentType { get; set; }

		public string FileName { get; set; }

		public string FullPath { get; set; }

		public int FolderNum { get; set; }

		public string CheckSum { get; set; }

		public long? FileSize { get; set; }

		public EntityType Type { get; set; }

		public int ParentId { get; set; }

		public enum EntityType
		{
			Article,
			Preview,
            Incident,
            Vulnerability
        }
	}
}
