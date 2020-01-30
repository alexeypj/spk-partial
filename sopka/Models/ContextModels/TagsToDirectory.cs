namespace sopka.Models.ContextModels
{
    public class TagsToDirectory
    {
        public int Id { get; set; }

        public int idArt { get; set; }

        public string DirectoryType { get; set; }

        public int idDirectory { get; set; }
    }

    public static class DirectoryType
    {
        public const string Attack = "Attack";
        public const string Branch = "Branch";
        public const string CPU = "CPU";
        public const string Equipment = "Equipment";
        public const string HDD = "HDD";
        public const string NetworkAdapter = "NetworkAdapter";
        public const string Object = "Object";
        public const string OS = "OS";
        public const string Platform = "Platform";
        public const string RAID = "RAID";
        public const string RAM = "RAM";
        public const string Soft = "Soft";
    }
}