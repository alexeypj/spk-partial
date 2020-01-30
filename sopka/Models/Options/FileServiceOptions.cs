namespace sopka.Models.Options
{
    public class FileServiceOptions
    {
        public int MaxFilesPerFolder { get; set; }
        public string RootFolder { get; set; }
        public bool OfficeApplicationVisible { get; set; }
        public int MaxUploadFileSize { get; set; }
    }
}
