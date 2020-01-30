using System.ComponentModel.DataAnnotations;

namespace sopka.Services.Workflow
{
    /// <summary>
    /// Полный набор состояний инцидентов
    /// </summary>
    public enum IncidentState
    {
        /// <summary>
        /// Новый
        /// </summary>
        [Display(Name = "Новый")]
        New = 0,

        /// <summary>
        /// Анализ инцидента
        /// </summary>
        [Display(Name = "Анализ инцидента")]
        IncidentAnalysis,

        /// <summary>
        /// Выданы рекомендации по блокировке
        /// </summary>
        [Display(Name = "Выданы рекомендации по блокировке")]
        BlockingRecommendationsIssued,

        /// <summary>
        /// Мероприятия по блокировке инцидента
        /// </summary>
        [Display(Name = "Мероприятия по блокировке инцидента")]
        BlockingMeasures,

        /// <summary>
        /// Инцидент блокирован
        /// </summary>
        [Display(Name= "Инцидент блокирован")]
        Blocked,

        /// <summary>
        /// Инцидент не блокирован
        /// </summary>
        [Display(Name= "Инцидент не блокирован")]
        NotBlocked,

        /// <summary>
        /// Проверка блокировки инцидента
        /// </summary>
        [Display(Name= "Проверка блокировки инцидента")]
        BlockChecking,

        /// <summary>
        /// Выданы рекомендации по устранению последствий
        /// </summary>
        [Display(Name = "Выданы рекомендации по устранению последствий")]
        MitigationRecommendationsIssued,

        /// <summary>
        /// Устранение последствий
        /// </summary>
        [Display(Name = "Устранение последствий")]
        RemovalConsequences,

        /// <summary>
        /// Последствия устранены
        /// </summary>
        [Display(Name = "Последствия устранены")]
        ConsequencesResolved,

        /// <summary>
        /// Последствия не устранены
        /// </summary>
        [Display(Name = "Последствия не устранены")]
        ConsequencesNotResolved,

        /// <summary>
        /// Проверка устранения последствий
        /// </summary>
        [Display(Name = "Проверка устранения последствий")]
        RemediationCheck,

        /// <summary>
        /// Выданы рекомендации по предотвращению подобных инцидентов
        /// </summary>
        [Display(Name = "Выданы рекомендации по предотвращению подобных инцидентов")]
        PreventionRecommendationsIssued,

        /// <summary>
        /// Проведение мероприятий по предотвращению подобных инцидентов
        /// </summary>
        [Display(Name= "Проведение мероприятий по предотвращению подобных инцидентов")]
        ConductingPreventionMeasures,

        /// <summary>
        /// Мероприятия по предотвращению подобных инцидентов проведены
        /// </summary>
        [Display(Name= "Мероприятия по предотвращению подобных инцидентов проведены")]
        FinishedPreventionMeasures,

        /// <summary>
        /// Работы завершены
        /// </summary>
        [Display(Name= "Работы завершены")]
        Finished,

        /// <summary>
        /// Закрыт
        /// </summary>
        [Display(Name = "Закрыт")]
        Closed
    }

    public enum IncidentTrigger
    {
        /// <summary>
        /// Передать уточнения
        /// </summary>
        [Display(Name= "Передать уточнения")]
        SubmitСlarification = 0,

        /// <summary>
        /// Выдать рекомендации
        /// </summary>
        [Display(Name= "Выдать рекомендации")]
        GiveRecommendations,

        /// <summary>
        /// Закрыть
        /// </summary>
        [Display(Name = "Закрыть")]
        Close,

        /// <summary>
        /// Передать рекомендации
        /// </summary>
        [Display(Name = "Передать рекомендации")]
        TransferRecommendations,

        /// <summary>
        /// Инцидент блокирован
        /// </summary>
        [Display(Name = "Инцидент блокирован")]
        IncidentBlocked,

        /// <summary>
        /// Инцидент не блокирован
        /// </summary>
        [Display(Name= "Инцидент не блокирован")]
        IncidentNotBlocked,

        /// <summary>
        /// Сообщить о блокировке инцидента
        /// </summary>
        [Display(Name= "Сообщить о блокировке инцидента")]
        ReportIncidentBlock,

        /// <summary>
        /// Запросить информацию у дежурного
        /// </summary>
        [Display(Name= "Запросить информацию у дежурного")]
        RequestInformation,

        /// <summary>
        /// Выдать рекомендации по устранению последствий
        /// </summary>
        [Display(Name= "Выдать рекомендации по устранению последствий")]
        IssueMitigationRecommendations,

        /// <summary>
        /// Выдать рекомендации по блокировке
        /// </summary>
        [Display(Name= "Выдать рекомендации по блокировке")]
        IssueBlockRecommendations,

        /// <summary>
        /// Последствия устранены
        /// </summary>
        [Display(Name= "Последствия устранены")]
        ConsequencesResolved,

        /// <summary>
        /// Последствия не устранены
        /// </summary>
        [Display(Name= "Последствия не устранены")]
        ConsequencesNotResolved,

        /// <summary>
        /// Сообщить об устранении последствий
        /// </summary>
        [Display(Name= "Сообщить об устранении последствий")]
        ReportConsequencesResolvation,

        /// <summary>
        /// Выдать рекомендации по предотвращению
        /// </summary>
        [Display(Name= "Выдать рекомендации по предотвращению")]
        IssuePreventionRecommendations,

        /// <summary>
        /// Мероприятия проведены
        /// </summary>
        [Display(Name= "Мероприятия проведены")]
        ActivitiesHeld,

        /// <summary>
        /// Сообщить о завершении
        /// </summary>
        [Display(Name= "Сообщить о завершении")]
        ReportCompletion,

        /// <summary>
        /// Уточнить информацию у дежурного
        /// </summary>
        [Display(Name= "Уточнить информацию у дежурного")]
        СlarifyInformation,

        /// <summary>
        /// Вернуть в работу
        /// </summary>
        [Display(Name= "Вернуть в работу")]
        ReturnToWork
        
    }
}
