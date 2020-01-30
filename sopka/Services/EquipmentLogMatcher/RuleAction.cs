using sopka.Models.EquipmentLogs.Rules;
using sopka.Services.EquipmentLogMatcher.RuleMatcher;

namespace sopka.Services.EquipmentLogMatcher
{
    /// <summary>
    /// Результат матчинга правила с логами
    /// </summary>
    public class RuleAction
    {
        public Rule.ActionType Action { get; }

        public string Title { get; }

        public string EmailAddress { get; }

        public string Description { get; }

        public RuleMatcherState[] State { get; }

        public RuleAction() { }

        public RuleAction(Rule rule, RuleMatcherState[] state)
        {
            Title = $"Сработало правило обработки журналов оборудования: {rule.Name}";
            Action = rule.Action;
            State = state;
            EmailAddress = rule.EmailAddress;
            Description = rule.Description;
        }
    }
}
