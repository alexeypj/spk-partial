using System.ComponentModel.DataAnnotations;

namespace sopka.Services.Chat
{
    /// <summary>
    /// Состояние события
    /// </summary>
    public enum ChatTypeEnum : byte
    {
        /// <summary>
        /// Не указано
        /// </summary>
        [Display(Description = "Не указано")]
        Undefined = 0,

        /// <summary>
        /// Все
        /// </summary>
        [Display(Description = "Все")]
        Any = 1,

        /// <summary>
        /// Создатель
        /// </summary>
        [Display(Description = "Создатели")]
        Creators = 2,
        /// <summary>
        /// Изменившие
        /// </summary>
        [Display(Description = "Изменившие")]
        Editors = 3,
    }
}