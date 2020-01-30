using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace sopka.Models.Enum
{
    public enum ActionEntityType
    {
        [Display(Description = "Справочник объектов")]
        DictionaryObjects = 1,
        [Display(Description = "Справочник филиалов")]
        DictionaryBranches = 2,
        [Display(Description = "Справочник типов атак")]
        DictionaryAttackTypes = 3,
        [Display(Description = "Справочник процессовро")]
        DictionaryCPU = 4,
        [Display(Description = "Справочник типов оборудования")]
        DictionaryEquipmentTypes = 5,
        [Display(Description = "Справочник дисков")]
        DictionaryHDD = 6,
        [Display(Description = "Справочник сетевых адаптеров")]
        DictionaryNetworkAdapters = 7,
        [Display(Description = "Справочник ОС")]
        DictionaryOS = 8,
        [Display(Description = "Справочник аппаратных платформ")]
        DictionaryPlatforms = 9,
        [Display(Description = "Справочник RAID")]
        DictionaryRaid = 10,
        [Display(Description = "Справочник памяти")]
        DictionaryRAM = 11,
        [Display(Description = "Справочник ПО")]
        DictionarySoftware = 12,
        [Display(Description = "Критичность")]
        IncidentCriticality = 13,

        [Display(Description = "Инцидент")]
        Incident = 14,
        [Display(Description = "Объект")]
        Inventory = 15,
        [Display(Description = "Оборудование")]
        Equipment = 16,
        [Display(Description = "Пользователь")]
        User = 17,
        [Display(Description = "Папка в базе знаний")]
        ArticleFolder = 18,
        [Display(Description = "Статья в базе знаний")]
        Article = 19,
        [Display(Description = "Правило обработки журналов оборудования")]
        EquipmentLog = 20,

        [Display(Description = "Чат")]
        Conversation = 21,
        [Display(Description = "Сообщения чата")]
        ConversationMessage = 22,
        [Display(Description = "Пользователь чата")]
        ConversationUser = 23,
        [Display(Description = "Статус сообщения чата")]
        ConversationMessageStatus = 24,

        [Display(Description = "Правило обработки журналов оборудования")]
        EquipmentJournal = 25,

        [Display(Description = "Справочник уровней критичности")]
        EquipmentLogSeverity =26
    }
}