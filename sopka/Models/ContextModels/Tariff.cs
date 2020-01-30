namespace sopka.Models.ContextModels
{
    public class Tariff
    {
        public int Id { get; set; }

        /// <summary>
        /// Название тарифа
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Доступное количество зарегистрированных пользователей
        /// </summary>
        public int UsersCount { get; set; }

        /// <summary>
        /// Доступное количество количество объектов
        /// </summary>
        public int ObjectsCount { get; set; }

        /// <summary>
        /// Доступное количество количество оборудования
        /// </summary>
        public int EquipmentsCount { get; set; }

        /// <summary>
        /// Период действия в днях
        /// </summary>
        public int Period { get; set; }

        /// <summary>
        /// Цена за период
        /// </summary>
        public decimal Price { get; set; }

        /// <summary>
        /// Включена ли поддержка
        /// </summary>
        public bool Support { get; set; }

        /// <summary>
        /// Облачный тариф
        /// </summary>
        public bool IsCloud { get; set; }

        public bool IsActive { get; set; }
    }
}