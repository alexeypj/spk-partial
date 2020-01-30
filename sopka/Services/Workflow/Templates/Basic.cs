using System;
using sopka.Models;
using Stateless;

namespace sopka.Services.Workflow.Templates
{
    public class Basic : IWorkflow
    {
        private readonly StateMachine<IncidentState, IncidentTrigger> _stateMachine;
        private readonly CurrentUser _user;

        public Basic(IncidentState initialState, CurrentUser user)
        {
            _stateMachine = new StateMachine<IncidentState, IncidentTrigger>(initialState);
            _user = user;

            Configure();
        }

        private void Configure()
        {
            #region Новый
            _stateMachine.Configure(IncidentState.New)
                .PermitIf(IncidentTrigger.SubmitСlarification, IncidentState.IncidentAnalysis,
                    () => _user.IsInRole(Roles.CorporateCenterSecondLine));
            #endregion

            #region Анализ инцидента

            _stateMachine.Configure(IncidentState.IncidentAnalysis)
                .PermitIf(IncidentTrigger.GiveRecommendations, IncidentState.BlockingRecommendationsIssued,
                    () => _user.IsInRole(Roles.CorporateCenterThirdLine))
                .PermitIf(IncidentTrigger.Close, IncidentState.Closed,
                    () => _user.IsInRole(Roles.CorporateCenterThirdLine));

            #endregion

            #region Выданы рекомендации по блокировке

            _stateMachine.Configure(IncidentState.BlockingRecommendationsIssued)
                .PermitIf(IncidentTrigger.GiveRecommendations, IncidentState.BlockingMeasures,
                    () => _user.IsInRole(Roles.CorporateCenterSecondLine));

            #endregion

            #region Мероприятия по блокировке инцидента

            _stateMachine.Configure(IncidentState.BlockingMeasures)
                .PermitIf(IncidentTrigger.IncidentBlocked, IncidentState.Blocked,
                    () => _user.IsInRole(Roles.DutyShift))
                .PermitIf(IncidentTrigger.IncidentNotBlocked, IncidentState.NotBlocked,
                    () => _user.IsInRole(Roles.DutyShift));

            #endregion

            #region Инцидент блокирован

            _stateMachine.Configure(IncidentState.Blocked)
                .PermitIf(IncidentTrigger.ReportIncidentBlock, IncidentState.BlockChecking,
                    () => _user.IsInRole(Roles.CorporateCenterSecondLine))
                .PermitIf(IncidentTrigger.RequestInformation, IncidentState.BlockingMeasures,
                    () => _user.IsInRole(Roles.CorporateCenterSecondLine));

            #endregion

            #region Инцидент не блокирован

            _stateMachine.Configure(IncidentState.NotBlocked)
                .PermitIf(IncidentTrigger.SubmitСlarification, IncidentState.IncidentAnalysis,
                    () => _user.IsInRole(Roles.CorporateCenterSecondLine));

            #endregion

            #region Проверка блокировки инцидента

            _stateMachine.Configure(IncidentState.BlockChecking)
                .PermitIf(IncidentTrigger.IssueMitigationRecommendations, IncidentState.MitigationRecommendationsIssued,
                    () => _user.IsInRole(Roles.CorporateCenterThirdLine))
                .PermitIf(IncidentTrigger.IssueBlockRecommendations, IncidentState.BlockingRecommendationsIssued,
                    () => _user.IsInRole(Roles.CorporateCenterThirdLine));

            #endregion

            #region Выданы рекомендации по устранению

            _stateMachine.Configure(IncidentState.MitigationRecommendationsIssued)
                .PermitIf(IncidentTrigger.TransferRecommendations, IncidentState.RemovalConsequences,
                    () => _user.IsInRole(Roles.CorporateCenterSecondLine));

            #endregion

            #region Устранение последствий

            _stateMachine.Configure(IncidentState.RemovalConsequences)
                .PermitIf(IncidentTrigger.ConsequencesResolved, IncidentState.ConsequencesResolved,
                    () => _user.IsInRole(Roles.DutyShift))
                .PermitIf(IncidentTrigger.ConsequencesNotResolved, IncidentState.ConsequencesNotResolved,
                    () => _user.IsInRole(Roles.DutyShift));

            #endregion

            #region Последствия устранены

            _stateMachine.Configure(IncidentState.ConsequencesResolved)
                .PermitIf(IncidentTrigger.ReportConsequencesResolvation, IncidentState.ConsequencesResolved,
                    () => _user.IsInRole(Roles.CorporateCenterSecondLine))
                .PermitIf(IncidentTrigger.RequestInformation, IncidentState.RemovalConsequences,
                    () => _user.IsInRole(Roles.CorporateCenterSecondLine));

            #endregion

            #region Последствия не устранены

            _stateMachine.Configure(IncidentState.ConsequencesNotResolved)
                .PermitIf(IncidentTrigger.SubmitСlarification, IncidentState.BlockChecking,
                    () => _user.IsInRole(Roles.CorporateCenterSecondLine));

            #endregion

            #region Проверка устранения последствий

            _stateMachine.Configure(IncidentState.RemediationCheck)
                .PermitIf(IncidentTrigger.IssueMitigationRecommendations, IncidentState.MitigationRecommendationsIssued,
                    () => _user.IsInRole(Roles.CorporateCenterThirdLine))
                .PermitIf(IncidentTrigger.IssuePreventionRecommendations, IncidentState.PreventionRecommendationsIssued,
                () => _user.IsInRole(Roles.CorporateCenterThirdLine));

            #endregion

            #region Выданы рекомендации по предотвращению

            _stateMachine.Configure(IncidentState.PreventionRecommendationsIssued)
                .PermitIf(IncidentTrigger.TransferRecommendations, IncidentState.ConductingPreventionMeasures,
                    () => _user.IsInRole(Roles.CorporateCenterSecondLine));

            #endregion

            #region Проведение мероприятий по предотвращению

            _stateMachine.Configure(IncidentState.ConductingPreventionMeasures)
                .PermitIf(IncidentTrigger.TransferRecommendations, IncidentState.FinishedPreventionMeasures,
                    () => _user.IsInRole(Roles.DutyShift));

            #endregion

            #region Мероприятия по предотвращению подобных инцидентов проведены

            _stateMachine.Configure(IncidentState.FinishedPreventionMeasures)
                .PermitIf(IncidentTrigger.ReportCompletion, IncidentState.Finished,
                    () => _user.IsInRole(Roles.CorporateCenterSecondLine))
                .PermitIf(IncidentTrigger.СlarifyInformation, IncidentState.ConductingPreventionMeasures,
                () => _user.IsInRole(Roles.CorporateCenterSecondLine));

            #endregion

            #region Работы завершены

            _stateMachine.Configure(IncidentState.Finished)
                .PermitIf(IncidentTrigger.Close, IncidentState.Closed,
                    () => _user.IsInRole(Roles.CorporateCenterThirdLine))
                .PermitIf(IncidentTrigger.IssuePreventionRecommendations, IncidentState.PreventionRecommendationsIssued,
                    () => _user.IsInRole(Roles.CorporateCenterSecondLine));

            #endregion

            #region Закрыть

            _stateMachine.Configure(IncidentState.Closed)
                .PermitIf(IncidentTrigger.ReturnToWork, IncidentState.New,
                    () => _user.IsInRole(Roles.CorporateCenterThirdLine));

            #endregion
        }

        public bool ChangeState(IncidentTrigger trigger)
        {
            return _stateMachine.CanFire(trigger);
        }

        private void GetAvailableTriggers()
        {
            var triggers = _stateMachine.PermittedTriggers;
        }

        
    }
}
