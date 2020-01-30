namespace sopka.Services
{
    public class SmtpSettings
    {
        public string SmtpServer { get; set; }
        public int SmtpServerPort { get; set; }
        public int SmtpTimeout { get; set; }
        public string FromEmail { get; set; }
        public string FromEmailName { get; set; }
        public bool EnableSsl { get; set; }

        public string SupportEmail { get; set; }

		public string BccMail { get; set; }
    }
}