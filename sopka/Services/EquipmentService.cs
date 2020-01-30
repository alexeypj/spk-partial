using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Microsoft.EntityFrameworkCore;
using sopka.Controllers;
using sopka.Helpers;
using sopka.Helpers.Authorization;
using sopka.Models;
using sopka.Models.Abstract;
using sopka.Models.ContextModels;
using sopka.Models.Filters;
using sopka.Models.ViewModels;

namespace sopka.Services
{
    public class EquipmentService
    {
        private readonly SopkaDbContext _dbContext;
		private readonly string _connectionString;
        private readonly CurrentUser _currentUser;
        private readonly AccessControlService _accessControlService;

        public EquipmentService(SopkaDbContext dbContext, CurrentUser currentUser, AccessControlService accessControlService)
        {
            _dbContext = dbContext;
            _currentUser = currentUser;
            _accessControlService = accessControlService;
            _connectionString = dbContext.Database.GetDbConnection().ConnectionString;
        }

        public async Task<PaginationModel<EquipmentListItem>> Find(EquipmentFilter filter)
        {
            //var query = _dbContext.Equipment.WhereCompany(_currentUser.User.CompanyId).AsQueryable();
            //if (filter.Id.HasValue)
            //{
            //    query = query.Where(x => x.Id == filter.Id);
            //}
            //if (filter.ObjectId.HasValue)
            //{
            //    query = query.Where(x => x.IdObject == filter.ObjectId);
            //}
            ////var q = filter.Query.Trim().ToLower();
            //if (filter.CPUId.HasValue)
            //{
            //    query = query.Where(x => x.Devices.Any(d => d.IdCPU == filter.CPUId));
            //    //query = query.Join(_dbContext.Devices.Where(x => x.IdCPU == filter.CPUId), equipment => equipment.Id, device => device.IdEquipment, (equipment, device) => equipment);
            //}

            //if (filter.HDDId.HasValue)
            //{
            //    query = query.Where(x => x.Devices.Any(d => d.HDD.Any(h => h.Id == filter.HDDId)));
            //}

            //var result = await query.Select(x => new EquipmentListItem()
            //{
            //    Id = x.Id,
            //    IP = x.Devices.First().IP,
            //    Name = x.Name,
            //    Model = x.Model,
            //    IdObject = x.IdObject,
            //    NetworkName = x.Devices.First().NetworkName
            //    }).ToListAsync();

            using (var conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                var items = await conn.QueryAsync<EquipmentListItem>("[dbo].[EquipmentFind]",
                    commandType: CommandType.StoredProcedure,
                    param: new
                    {
						@id = filter.Id,
                        @objectId = filter.ObjectId,
                        @query = filter.Query,
                        @cpuId = filter.CPUId,
                        @memoryId = filter.MemoryId,
                        @hddId = filter.HDDId,
                        @networkAdapterId = filter.NetworkAdapterId,
                        @operationSystemId = filter.OperationSystemId,
                        @softwareId = filter.SoftwareId,
						@ip = filter.IP,
						@vlan = filter.Vlan,
						@typeId = filter.TypeId,
						@platformId = filter.PlatformId,
						@networkName = filter.NetworkName,
						@name = filter.Name,
						@skip = filter.Skip,
                        @take = filter.ItemsPerPage,
                        @companyId = _currentUser.User.CompanyId,
                        @sortColumn = filter.SortColumn,
                        @sortDirection = filter.SortDirection.ToString()
                    });

                var totalCount = await conn.QuerySingleAsync<int>("[dbo].[EquipmentFindCount]",
                    commandType: CommandType.StoredProcedure,
                    param: new
                    {
	                    @id = filter.Id,
						@objectId = filter.ObjectId,
                        @query = filter.Query,
                        @cpuId = filter.CPUId,
                        @memoryId = filter.MemoryId,
                        @hddId = filter.HDDId,
                        @networkAdapterId = filter.NetworkAdapterId,
                        @operationSystemId = filter.OperationSystemId,
                        @softwareId = filter.SoftwareId,
                        @ip = filter.IP,
                        @vlan = filter.Vlan,
                        @typeId = filter.TypeId,
                        @platformId = filter.PlatformId,
                        @networkName = filter.NetworkName,
                        @name = filter.Name,
                        @companyId = _currentUser.User.CompanyId
					});

                return new PaginationModel<EquipmentListItem>()
                {
                    Items = items,
                    Total = totalCount
                };
            }
        }

        public async Task<PaginationModel<EquipmentListItem>> Find(EquipmentFilterByColumn filter)
        {
			throw new NotImplementedException();
        }

	}
}