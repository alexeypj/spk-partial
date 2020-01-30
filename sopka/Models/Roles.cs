namespace sopka.Models
{
    public static class Roles
    {
        public const string DutyShift = "Дежурная смена (первая линия, Центр мониторинга, ПАО «МОЭСК»)'";
        public const string CorporateCenterSecondLine = "Корпоративный центр (вторая линия)";
        public const string CorporateCenterThirdLine = "Корпоративный центр (третья линия)";
        public const string Admin = "Администратор системы";
        public const string CompanyAdmin = "Администратор компании";
        public const string Support = "Служба технической поддержки";

        public const string SystemOrCompanyAdmin = Admin + "," + CompanyAdmin;
    }
}