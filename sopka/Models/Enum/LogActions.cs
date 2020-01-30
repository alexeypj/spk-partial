using System;
using System.ComponentModel.DataAnnotations;
using sopka.Helpers;

namespace sopka.Models.Enum
{
    /// <summary>
    /// Данным атирибутом необходимо помечать действия успешного или неудачного редактирования свойств или удаления сущности 
    /// </summary>
    [AttributeUsage(AttributeTargets.Field)]
    public class IsMainAction : Attribute
    {
    }


    /// <summary>
    /// Типы действий пользователя
    /// </summary>
    [EnumDescription(NamePrefix = "Action.")]
    public enum LogActions
    {
        [Display(Description = "Успешная попытка авторизации пользователя"), IsMainAction]
        UserAuthorized,

        [Display(Description = "Открытие справочника \"Типы объектов\"")]
        DirectoryObjectTypesIndex,
        [Display(Description = "Усппешное добавление элемента справочника \"Типы объектов\""), IsMainAction]
        DirectoryObjectTypesCreated,
        [Display(Description = "Усппешное редактирование элемента справочника \"Типы объектов\""), IsMainAction]
        DirectoryObjectTypesEdited,
        [Display(Description = "Неусппешная попытка добавления элемента справочника \"Типы объектов\""), IsMainAction]
        DirectoryObjectTypesUnsuccessfulCreate,
        [Display(Description = "Неусппешная попытка редактирования элемента справочника \"Типы объектов\""), IsMainAction]
        DirectoryObjectTypesUnsuccessfulEdit,


        [Display(Description = "Открытие справочника \"Филиалы\"")]
        DirectoryBranchesIndex,
        [Display(Description = "Усппешное добавление элемента справочника \"Филиалы\""), IsMainAction]
        DirectoryBranchesCreated,
        [Display(Description = "Усппешное редактирование элемента справочника \"Филиалы\""), IsMainAction]
        DirectoryBranchesEdited,
        [Display(Description = "Неусппешная попытка добавления элемента справочника \"Филиалы\""), IsMainAction]
        DirectoryBranchesUnsuccessfulCreate,
        [Display(Description = "Неусппешная попытка редактирования элемента справочника \"Филиалы\""), IsMainAction]
        DirectoryBranchesUnsuccessfulEdit,

        [Display(Description = "Открытие справочника \"Типы атак\"")]
        DirectoryAttackTypesIndex,
        [Display(Description = "Усппешное добавление элемента справочника \"Типы атак\""), IsMainAction]
        DirectoryAttackTypesCreated,
        [Display(Description = "Усппешное редактирование элемента справочника \"Типы атак\""), IsMainAction]
        DirectoryAttackTypesEdited,
        [Display(Description = "Неусппешная попытка добавления элемента справочника \"Типы атак\""), IsMainAction]
        DirectoryAttackTypesUnsuccessfulCreate,
        [Display(Description = "Неусппешная попытка редактирования элемента справочника \"Типы атак\""), IsMainAction]
        DirectoryAttackTypesUnsuccessfulEdit,

        [Display(Description = "Открытие справочника \"Процессор\"")]
        DirectoryCPUIndex,
        [Display(Description = "Усппешное добавление элемента справочника \"Процессор\""), IsMainAction]
        DirectoryCPUCreated,
        [Display(Description = "Усппешное редактирование элемента справочника \"Процессор\""), IsMainAction]
        DirectoryCPUEdited,
        [Display(Description = "Неусппешная попытка добавления элемента справочника \"Процессор\""), IsMainAction]
        DirectoryCPUUnsuccessfulCreate,
        [Display(Description = "Неусппешная попытка редактирования элемента справочника \"Процессор\""), IsMainAction]
        DirectoryCPUUnsuccessfulEdit,

        [Display(Description = "Открытие справочника \"Типы оборудования\"")]
        DirectoryEquipmentTypesIndex,
        [Display(Description = "Усппешное добавление элемента справочника \"Типы оборудования\""), IsMainAction]
        DirectoryEquipmentTypesCreated,
        [Display(Description = "Усппешное редактирование элемента справочника \"Типы оборудования\""), IsMainAction]
        DirectoryEquipmentTypesEdited,
        [Display(Description = "Неусппешная попытка добавления элемента справочника \"Типы оборудования\""), IsMainAction]
        DirectoryEquipmentTypesUnsuccessfulCreate,
        [Display(Description = "Неусппешная попытка редактирования элемента справочника \"Типы оборудования\""), IsMainAction]
        DirectoryEquipmentTypesUnsuccessfulEdit,

        [Display(Description = "Открытие справочника \"Диски\"")]
        DirectoryHDDIndex,
        [Display(Description = "Усппешное добавление элемента справочника \"Диски\""), IsMainAction]
        DirectoryHDDCreated,
        [Display(Description = "Усппешное редактирование элемента справочника \"Диски\""), IsMainAction]
        DirectoryHDDEdited,
        [Display(Description = "Неусппешная попытка добавления элемента справочника \"Диски\""), IsMainAction]
        DirectoryHDDUnsuccessfulCreate,
        [Display(Description = "Неусппешная попытка редактирования элемента справочника \"Диски\""), IsMainAction]
        DirectoryHDDUnsuccessfulEdit,

        [Display(Description = "Открытие справочника \"Сетевые адаптеры\"")]
        DirectoryNetworkAdaptersIndex,
        [Display(Description = "Усппешное добавление элемента справочника \"Сетевые адаптеры\""), IsMainAction]
        DirectoryNetworkAdaptersCreated,
        [Display(Description = "Усппешное редактирование элемента справочника \"Сетевые адаптеры\""), IsMainAction]
        DirectoryNetworkAdaptersEdited,
        [Display(Description = "Неусппешная попытка добавления элемента справочника \"Сетевые адаптеры\""), IsMainAction]
        DirectoryNetworkAdaptersUnsuccessfulCreate,
        [Display(Description = "Неусппешная попытка редактирования элемента справочника \"Сетевые адаптеры\""), IsMainAction]
        DirectoryNetworkAdaptersUnsuccessfulEdit,

        [Display(Description = "Открытие справочника \"ОС\"")]
        DirectoryOSIndex,
        [Display(Description = "Усппешное добавление элемента справочника \"ОС\""), IsMainAction]
        DirectoryOSCreated,
        [Display(Description = "Усппешное редактирование элемента справочника \"ОС\""), IsMainAction]
        DirectoryOSEdited,
        [Display(Description = "Неусппешная попытка добавления элемента справочника \"ОС\""), IsMainAction]
        DirectoryOSUnsuccessfulCreate,
        [Display(Description = "Неусппешная попытка редактирования элемента справочника \"ОС\""), IsMainAction]
        DirectoryOSUnsuccessfulEdit,

        [Display(Description = "Открытие справочника \"Аппаратная платформа (модель устройства)\"")]
        DirectoryPlatformsIndex,
        [Display(Description = "Усппешное добавление элемента справочника \"Аппаратная платформа (модель устройства)\""), IsMainAction]
        DirectoryPlatformsCreated,
        [Display(Description = "Усппешное редактирование элемента справочника \"Аппаратная платформа (модель устройства)\""), IsMainAction]
        DirectoryPlatformsEdited,
        [Display(Description = "Неусппешная попытка добавления элемента справочника \"Аппаратная платформа (модель устройства)\""), IsMainAction]
        DirectoryPlatformsUnsuccessfulCreate,
        [Display(Description = "Неусппешная попытка редактирования элемента справочника \"Аппаратная платформа (модель устройства)\""), IsMainAction]
        DirectoryPlatformsUnsuccessfulEdit,

        [Display(Description = "Открытие справочника \"RAID\"")]
        DirectoryRaidIndex,
        [Display(Description = "Усппешное добавление элемента справочника \"RAID\""), IsMainAction]
        DirectoryRaidCreated,
        [Display(Description = "Усппешное редактирование элемента справочника \"RAID\""), IsMainAction]
        DirectoryRaidEdited,
        [Display(Description = "Неусппешная попытка добавления элемента справочника \"RAID\""), IsMainAction]
        DirectoryRaidUnsuccessfulCreate,
        [Display(Description = "Неусппешная попытка редактирования элемента справочника \"RAID\""), IsMainAction]
        DirectoryRaidUnsuccessfulEdit,

        [Display(Description = "Открытие справочника \"Память\"")]
        DirectoryRAMIndex,
        [Display(Description = "Усппешное добавление элемента справочника \"Память\""), IsMainAction]
        DirectoryRAMCreated,
        [Display(Description = "Усппешное редактирование элемента справочника \"Память\""), IsMainAction]
        DirectoryRAMEdited,
        [Display(Description = "Неусппешная попытка добавления элемента справочника \"Память\""), IsMainAction]
        DirectoryRAMUnsuccessfulCreate,
        [Display(Description = "Неусппешная попытка редактирования элемента справочника \"Память\""), IsMainAction]
        DirectoryRAMUnsuccessfulEdit,

        [Display(Description = "Открытие справочника \"ПО\"")]
        DirectorySoftwareIndex,
        [Display(Description = "Усппешное добавление элемента справочника \"ПО\""), IsMainAction]
        DirectorySoftwareCreated,
        [Display(Description = "Усппешное редактирование элемента справочника \"ПО\""), IsMainAction]
        DirectorySoftwareEdited,
        [Display(Description = "Неусппешная попытка добавления элемента справочника \"ПО\""), IsMainAction]
        DirectorySoftwareUnsuccessfulCreate,
        [Display(Description = "Неусппешная попытка редактирования элемента справочника \"ПО\""), IsMainAction]
        DirectorySoftwareUnsuccessfulEdit,

        [Display(Description = "Открытие справочника \"Уровень критичности\"")]
        EquipmentLogSeverityIndex,
        [Display(Description = "Усппешное добавление элемента справочника \"Уровень критичности\""), IsMainAction]
        EquipmentLogSeverityCreated,
        [Display(Description = "Усппешное редактирование элемента справочника \"Уровень критичности\""), IsMainAction]
        EquipmentLogSeverityEdited,
        [Display(Description = "Неусппешная попытка добавления элемента справочника \"Уровень критичности\""), IsMainAction]
        EquipmentLogSeverityUnsuccessfulCreate,
        [Display(Description = "Неусппешная попытка редактирования элемента справочника \"Уровень критичности\""), IsMainAction]
        EquipmentLogSeverityUnsuccessfulEdit,

        [Display(Description = "Открытие страницы с инцидентами")]
        IncidentIndex,
        [Display(Description = "Открытие карточки инцидента")]
        IncidentItem,
        [Display(Description = "Открытие формы создания инцидента")]
        IncidentCreateForm,
        [Display(Description = "Успешное создание инцидента"), IsMainAction]
        IncidentCreated,
        [Display(Description = "Неуспешная попытка создания инцидента"), IsMainAction]
        IncidentUnsuccessfulCreate,
        [Display(Description = "Успешное редакирование инцидента"), IsMainAction]
        IncidentEdited,
        [Display(Description = "Неуспешная попытка редактирования инцидента"), IsMainAction]
        IncidentUnsuccessfulEdit,
        [Display(Description = "Успешное удаление инцидента"), IsMainAction]
        IncidentDeleted,

        [Display(Description = "Открытие страницы с объектами")]
        InventoryIndex,
        [Display(Description = "Открытие карточки объекта")]
        InventoryItem,
        [Display(Description = "Открытие формы создания объекта")]
        InventoryCreateForm,
        [Display(Description = "Успешное создание объекта"), IsMainAction]
        InventoryCreated,
        [Display(Description = "Неуспешная попытка создания объекта"), IsMainAction]
        InventoryUnsuccessfulCreate,
        [Display(Description = "Успешное редакирование объекта"), IsMainAction]
        InventoryEdited,
        [Display(Description = "Неуспешная попытка редактирования объекта"), IsMainAction]
        InventoryUnsuccessfulEdit,
        [Display(Description = "Успешное удаление объекта"), IsMainAction]
        InventoryDeleted,

        [Display(Description = "Открытие страницы с оборудованием")]
        EquipmentIndex,
        [Display(Description = "Открытие карточки оборудования")]
        EquipmentItem,
        [Display(Description = "Открытие формы добавления оборудования")]
        EquipmentCreateForm,
        [Display(Description = "Успешное добавление оборудования"), IsMainAction]
        EquipmentCreated,
        [Display(Description = "Неуспешная попытка добавления оборудования"), IsMainAction]
        EquipmentUnsuccessfulCreate,
        [Display(Description = "Успешное редакирование оборудования"), IsMainAction]
        EquipmentEdited,
        [Display(Description = "Неуспешная попытка редактирования оборудования"), IsMainAction]
        EquipmentUnsuccessfulEdit,
        [Display(Description = "Успешное удаление оборудования "), IsMainAction]
        EquipmentDeleted,

        [Display(Description = "Открытие страницы с пользователями")]
        UserIndex,
        [Display(Description = "Успешное создание пользователя"), IsMainAction]
        UserCreated,
        [Display(Description = "Неуспешная попытка создания пользователя"), IsMainAction]
        UserUnsuccessfulCreate,
        [Display(Description = "Успешное редактирование пользователя"), IsMainAction]
        UserEdited,
        [Display(Description = "Неуспешная попытка редактирования пользователя"), IsMainAction]
        UserUnsuccessfulEdit,
        [Display(Description = "Успешная блокировка пользователя"), IsMainAction]
        UserBlocked,
        [Display(Description = "Неуспешная попытка блокировки пользователя"), IsMainAction]
        UserUnsuccessfulBlock,
        [Display(Description = "Успешная разблокировка пользователя"), IsMainAction]
        UserUnBlocked,
        [Display(Description = "Неуспешная попытка разблокировки пользователя"), IsMainAction]
        UserUnsuccessfulUnBlock,
        [Display(Description = "Успешный сброс пароля пользователя"), IsMainAction]
        UserPasswordReset,
        [Display(Description = "Неуспешная попытка сброса пароля пользователя"), IsMainAction]
        UserUnsuccessfulPasswordReset,

        [Display(Description = "Открытие страницы с базой знаний")]
        KnowledgeBaseIndex,
        [Display(Description = "Открытие статьи")]
        KnowledgeBaseArticle,
        [Display(Description = "Открытие формы создания статьи")]
        KnowledgeBaseArticleCreateForm,
        [Display(Description = "Успешное добавление статьи"), IsMainAction]
        KnowledgeBaseArticleCreated,
        [Display(Description = "Успешное редактирование статьи"), IsMainAction]
        KnowledgeBaseArticleEdited,
        [Display(Description = "Неуспешная попытка добаления статьи"), IsMainAction]
        KnowledgeBaseArticleUnsuccessfulCreate,
        [Display(Description = "Неуспешная попытка редактирования статьи"), IsMainAction]
        KnowledgeBaseArticleUnsuccessfulEdit,
        [Display(Description = "Успешное добаление папки"), IsMainAction]
        KnowledgeBaseArticleFolderCreated,
        [Display(Description = "Успешное редактирование папки"), IsMainAction]
        KnowledgeBaseArticleFolderEdited,
        [Display(Description = "Неуспешная попытка добаления папки"), IsMainAction]
        KnowledgeBaseArticleFolderUnsuccessfulCreate,
        [Display(Description = "Неуспешная попытка редактирования папки"), IsMainAction]
        KnowledgeBaseArticleFolderUnsuccessfulEdit,

        [Display(Description = "Успешное добаление критичности"), IsMainAction]
        IncidentCriticalityFolderCreated,
        [Display(Description = "Неуспешная попытка добаления критичности"), IsMainAction]
        IncidentCriticalityUnsuccessfulCreate,

        [Display(Description = "Открытие страницы с правилами обработки журналов оборудования")]
        EquipmentLogsRuleIndex,
        [Display(Description = "Открытие правила обработки журналов оборудования")]
        EquipmentLogsRuleItem,
        [Display(Description = "Успешное добавление правила обработки журналов оборудования"), IsMainAction]
        EquipmentLogsRuleCreated,
        [Display(Description = "Успешное редактирование правила обработки журналов оборудования"), IsMainAction]
        EquipmentLogsRuleEdited,
        [Display(Description = "Неуспешная попытка добавления правила обработки журналов оборудования"), IsMainAction]
        EquipmentLogsRuleUnsuccessfulCreate,
        [Display(Description = "Неуспешная попытка редактирования правила обработки журналов оборудования"), IsMainAction]
        EquipmentLogsRuleUnsuccessfulUpdate,

        [Display(Description = "Открытие страницы с журналом оборудования")]
        EquipmentJournalIndex,

        [Display(Description = "Получение списка сообщений определенного чата")]
        ConversationGetMessages,
        [Display(Description = "Успешное создание чата"), IsMainAction]
        ConversationCreated,
        [Display(Description = "Неуспешная попытка создания чата"), IsMainAction]
        ConversationUnsuccessCreate,
        [Display(Description = "Успешное создание нового сообщения"), IsMainAction]
        MessageCreated,
        [Display(Description = "Неуспешная попытка создания нового сообщения"), IsMainAction]
        MessageUnsuccessCreate,
        [Display(Description = "Успешное добавление нового участника в чат"), IsMainAction]
        ConversationUserAdded,
        [Display(Description = "Неуспешная попытка добавления нового участника в чат"), IsMainAction]
        ConversationUserUnsuccessAdd,
        [Display(Description = "Успешное изменение полей участника чата"), IsMainAction]
        ConversationUserUpdated,
        [Display(Description = "Неуспешная попытка изменения полей участника чата"), IsMainAction]
        ConversationUserUnsuccessUpdate,
        [Display(Description = "Успешное выставление статусов сообщениям чата"), IsMainAction]
        ConversationMessageStatusUpdated,
        [Display(Description = "Неуспешная попытка выставления статусов сообщениям чата"), IsMainAction]
        ConversationMessageStatusUnsuccessUpdate,

        [Display(Description = "Успешное изменение названия чата"), IsMainAction]
        ConversationNameChanged,
        [Display(Description = "Неуспешная попытка изменения названия чата"), IsMainAction]
        ConversationNameUnsuccessChanged,


    }
}