export enum LogActions {
    DirectoryObjectTypesIndex = "Action.DirectoryObjectTypesIndex",
    DirectoryBranchesIndex = "Action.DirectoryBranchesIndex",
    DirectoryAttackTypesIndex = "Action.DirectoryAttackTypesIndex",
    DirectoryCPUIndex = "Action.DirectoryCPUIndex",
    DirectoryEquipmentTypesIndex = "Action.DirectoryEquipmentTypesIndex",
    DirectoryHDDIndex = "Action.DirectoryHDDIndex",
    DirectoryNetworkAdaptersIndex = "Action.DirectoryNetworkAdaptersIndex",
    DirectoryOSIndex = "Action.DirectoryOSIndex",
    DirectoryPlatformsIndex = "Action.DirectoryPlatformsIndex",
    DirectoryRaidIndex = "Action.DirectoryRaidIndex",
    DirectoryRAMIndex = "Action.DirectoryRAMIndex",
    DirectorySoftwareIndex = "Action.DirectorySoftwareIndex",
    DirectorySeveritySynonymsIndex = "Action.DirectorySeveritySynonymsIndex",

    IncidentIndex = "Action.IncidentIndex",
    IncidentItem = "Action.IncidentItem",
    IncidentCreateForm = "Action.IncidentCreateForm",
    IncidentCreated = "Action.IncidentCreated",
    IncidentEdited = "Action.IncidentEdited",

    InventoryIndex = "Action.InventoryIndex",
    InventoryItem = "Action.InventoryItem",
    InventoryCreateForm = "Action.InventoryCreateForm",
    InventoryCreated = "Action.InventoryCreated",
    InventoryEdited = "Action.InventoryEdited",

    EquipmentIndex = "Action.EquipmentIndex",
    EquipmentItem = "Action.EquipmentItem",
    EquipmentCreateForm = "Action.EquipmentCreateForm",
    EquipmentCreated = "Action.EquipmentCreated",
    EquipmentEdited = "Action.EquipmentEdited",

    UserIndex = "Action.UserIndex",

    KnowledgeBaseIndex = "Action.KnowledgeBaseIndex",
    KnowledgeBaseArticle = "Action.KnowledgeBaseArticle",
    KnowledgeBaseArticleCreateForm = "Action.KnowledgeBaseArticleCreateForm",
    KnowledgeBaseArticleCreated = "Action.KnowledgeBaseArticleCreated",
    KnowledgeBaseArticleEdited = "Action.KnowledgeBaseArticleEdited",
    KnowledgeBaseArticleFolderCreated = "Action.KnowledgeBaseArticleFolderCreated",

    EquipmentLogsRuleIndex = "Action.EquipmentLogsRuleIndex",
    EquipmentLogsRuleItem = "Action.EquipmentLogsRuleItem",

    
    EquipmentJournalIndex = "Action.EquipmentJournalIndex",

}

export enum EntityType {
    DictionaryObjectTypes = 1,
    DictionaryBranches,
    DictionaryAttackTypes,
    DictionaryCPU,
    DictionaryEquipmentTypes,
    DictionaryHDD,
    DictionaryNetworkAdapters,
    DictionaryOS,
    DictionaryPlatforms,
    DictionaryRaid,
    DictionaryRAM,
    DictionarySoftware,
    IncidentCriticality,

    Incident = 14,
    Inventory = 15,
    Equipment = 16,
    User = 17,
    ArticleFolder = 18,
    Article = 19,
    EquipmentLog = 20,

    EquipmentJournal = 25
}