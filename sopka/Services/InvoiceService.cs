using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using sopka.Models;
using sopka.Models.ContextModels;
using sopka.Models.Enum;

namespace sopka.Services
{
    public class InvoiceService
    {
        private readonly SopkaDbContext _dbContext;
        private readonly BalanceService _balanceService;

        public InvoiceService(SopkaDbContext dbContext, BalanceService balanceService)
        {
            _dbContext = dbContext;
            _balanceService = balanceService;
        }

        public async Task<Invoice> CreateInvoice(int companyId, decimal amount, PaymentMethod paymentMethod)
        {
            var invoice = new Invoice()
            {
                Amount = amount,
                CreateDate = DateTimeOffset.Now,
                CompanyId = companyId,
                PaymentMethod = paymentMethod,
                Status = InvoiceStatus.Pending
            };
            _dbContext.Invoices.Add(invoice);
            await _dbContext.SaveChangesAsync();
            return invoice;
        }

        public async Task<Invoice> PayInvoice(int invoiceId, string externalTransactionId = null)
        {
            var invoice = await _dbContext.Invoices.SingleAsync(x => x.Id == invoiceId);
            invoice.Status = InvoiceStatus.Paid;
            invoice.PaymentDate = DateTimeOffset.Now;
            invoice.ExternalTransactionId = externalTransactionId;
            _dbContext.Invoices.Update(invoice);
            await _dbContext.SaveChangesAsync();
            await _balanceService.ChangeBalance(invoice.Amount, invoice.CompanyId);
            return invoice;
        }
    }
}