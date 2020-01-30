using System.Collections.Concurrent;
using System.Collections.Generic;
using sopka.Models.EquipmentLogs;
using sopka.Models.EquipmentLogs.Rules;

namespace sopka.Services.EquipmentLogMatcher
{
    /// <summary>
    /// Шина обмена сообщениями с фоновыми задачами
    /// </summary>
    public class EquipmentLogDataBus
    {

        public EquipmentLogDataBus()
        {
            LogQueue = new BlockingCollection<List<EquipmentLog>>();
            Rules = new BlockingCollection<Rule>();
        }

        /// <summary>
        /// Данные обновления правил
        /// </summary>
        public BlockingCollection<Rule> Rules { get; }
        
        /// <summary>
        /// Данные логов
        /// </summary>
        public BlockingCollection<List<EquipmentLog>> LogQueue { get; }
    }
}
