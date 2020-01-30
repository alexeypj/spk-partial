using System.Data;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using sopka.Models;

namespace sopka.Services
{
    public class BalanceService
    {
        private readonly SopkaDbContext _dbContext;
        private readonly ILogger<BalanceService> _logger;

        public BalanceService(SopkaDbContext dbContext, ILogger<BalanceService> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<ServiceActionResult> ChangeBalance(decimal amount, int companyId)
        {
            using (var transaction = _dbContext.Database.BeginTransaction(IsolationLevel.RepeatableRead))
            {
                var balance = await _dbContext.Balances.SingleOrDefaultAsync(x => x.CompanyId == companyId);
                var resultBalance = balance.Value + amount;

                if (resultBalance < 0)
                {
                    _logger.LogError($"Недостаточно средств для изменения баланса {balance.Value} на сумму {amount}");
                    return ServiceActionResult.GetFailed("Недосточно средств");
                }

                balance.Value = resultBalance;
                _dbContext.Balances.Update(balance);
                await _dbContext.SaveChangesAsync();
                transaction.Commit();

                return ServiceActionResult.GetSuccess();
            }
        }
    }
}