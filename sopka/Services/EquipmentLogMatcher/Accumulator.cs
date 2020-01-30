using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using sopka.Models.EquipmentLogs.Rules;
using Newtonsoft.Json;

namespace sopka.Services.EquipmentLogMatcher
{
    /// <summary>
    /// Состояние выполнения правила
    /// </summary>
    public class Accumulator
    {
        /// <summary>
        /// Словарь совпадений - Id лога : дата совпадения
        /// </summary>
        private ConcurrentDictionary<int, long> _events;
        private readonly int _maxErrorNumber;
        private readonly int _secondsInPeriod;

        public Accumulator(Condition condition)
        {
            _maxErrorNumber = condition.ErrorsNumber;
            _secondsInPeriod = SecondsInPeriod(condition.PeriodLength, condition.Period);
            _events = new ConcurrentDictionary<int, long>();
        }

        /// <summary>
        /// Добавлене сработавшего события
        /// </summary>
        /// <param name="logId">Идентификатор лога</param>
        /// <param name="eventTimestamp">Дата события, если нужны. Без агрумента будет считаться по серверному времени</param>
        public void Increment(int logId, long? eventTimestamp = null)
        {
            if (eventTimestamp == null)
            {
                eventTimestamp = DateTimeOffset.Now.ToUnixTimeMilliseconds();
            }

            if (_events.ContainsKey(logId) == false)
            {
                var result = _events.TryAdd(logId, eventTimestamp.Value);
                var attempts = 50;
                while (!result && attempts > 0 )
                {
                    result = _events.TryAdd(logId, eventTimestamp.Value);
                    attempts--;
                }
            }
        }

        public bool IsTriggered => _maxErrorNumber <= _events.Count;
        

        /// <summary>
        /// Убирает совпадения, которые уже не помещаются в заданный период
        /// </summary>
        public void ClearOutdated()
        {
            if (_events.Count > 0)
            {
                var outdated = DateTimeOffset.Now.ToUnixTimeSeconds() - _secondsInPeriod;
                foreach (var keyValue in _events.Where(x => x.Value < outdated))
                {
                    _events.TryRemove(keyValue.Key, out _);
                }
            }
        }

        internal static int SecondsInPeriod(int? length, Rule.PeriodType? type)
        {
            if (length.HasValue == false) return 0;

            switch (type)
            {
                case Rule.PeriodType.Second: return length.Value;
                case Rule.PeriodType.Minute: return length.Value * 60;
                case Rule.PeriodType.Hour: return length.Value * 3600;
                default: return length.Value;
            }
        }

        /// <summary>
        /// Сброс в начальное состояние
        /// </summary>
        public void Reset()
        {
            _events.Clear();
        }

        public void Restore(string source)
        {
            try
            {
                _events = JsonConvert.DeserializeObject<ConcurrentDictionary<int, long>>(source);
            }
            catch (Exception)
            {
                _events = new ConcurrentDictionary<int, long>();
            }
        }

        public List<int> GetLogIds()
        {
            return _events.Select(x => x.Key).ToList();
        }

        public override string ToString()
        {
            if (_events != null && _events.Count > 0)
            {
                return JsonConvert.SerializeObject(_events);
            }
            return string.Empty;
        }
    }
}
