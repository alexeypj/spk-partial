using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sopka.Helpers;
using sopka.Helpers.Authorization;
using sopka.Models;
using sopka.Models.ContextModels;
using sopka.Models.ContextModels.Directories;
using sopka.Models.DTO;
using sopka.Models.Filters;
using sopka.Models.ViewModels;

namespace sopka.Services
{
	public class InventoryService
	{
		private readonly SopkaDbContext _context;
		private readonly string _connectionString;
        private readonly CurrentUser _currentUser;
        private readonly AccessControlService _accessControlService;

		public InventoryService(SopkaDbContext context, CurrentUser currentUser, AccessControlService accessControlService)
		{
			_context = context;
            _currentUser = currentUser;
            _accessControlService = accessControlService;
            _connectionString = _context.Database.GetDbConnection().ConnectionString;
		}

		public Task<List<ObjectEntry>> GetObjectsList(InventoryFilter filter)
		{
			if (string.IsNullOrEmpty(filter.SearchString))
			{
				return _context.Objects
					.AsNoTracking()
                    .WhereCompany(_currentUser.User.CompanyId)
					.Where(filter.WhereExpression)
					.Skip(filter.Skip)
					.Take(filter.ItemsPerPage)
					.ToListAsync();
			}
			
			return _context
				.Objects
				.AsNoTracking()
				.FromSql($"execute [dbo].[SearchForObject] @SearchString", new SqlParameter("@SearchString", filter.SearchString))
                .WhereCompany(_currentUser.User.CompanyId)
				.ToListAsync();
		}

		public async Task<(ObjectEntry, Dictionary<string, string>)> Store(ObjectEntry model)
        {
			if (model != null)
			{
				// Update
				if (model.Id != 0)
                {
                    var obj = _context.Objects.AsNoTracking().Single(x => x.Id == model.Id);
                    if (_accessControlService.HasAccess(obj))
                    {
                        model.CompanyId = obj.CompanyId;
                        _context.Objects.Update(model);
                        await _context.SaveChangesAsync();
                        var changes = GetChanges(obj, model);
                        return (model, changes);
                    }
                }
				// New
                model.CompanyId = _currentUser.User.CompanyId;
				_context.Objects.Add(model);               
                await _context.SaveChangesAsync();
				return (model, null);
			}
			return (null, null);
		}

        private Dictionary<string, string> GetChanges(ObjectEntry source, ObjectEntry target)
        {
            var result = new Dictionary<string, string>();
            if (source.ObjectName != target.ObjectName)
            {
                result.Add(nameof(ObjectEntry.ObjectName), target.ObjectName);
            }

            if (source.ObjectAddress != target.ObjectAddress)
            {
                result.Add(nameof(ObjectEntry.ObjectAddress), target.ObjectAddress);
            }

            if (source.Latitude != target.Latitude)
            {
                result.Add(nameof(ObjectEntry.Latitude), target.Latitude?.ToString());
            }

            if (source.Longitude != target.Longitude)
            {
                result.Add(nameof(ObjectEntry.Longitude), target.Longitude?.ToString());
            }

            if (source.IdType != target.IdType)
            {
                result.Add(nameof(ObjectEntry.IdType), target.IdType.ToString());
            }

            if (source.IdBranch != target.IdBranch)
            {
                result.Add(nameof(ObjectEntry.IdBranch), target.IdBranch?.ToString());
            }

            if (source.ContactPerson != target.ContactPerson)
            {
                result.Add(nameof(ObjectEntry.ContactPerson), target.ContactPerson);
            }

            if (source.ContactPhone != target.ContactPhone)
            {
                result.Add(nameof(ObjectEntry.ContactPhone), target.ContactPhone);
            }

            if (source.ContactMail != target.ContactMail)
            {
                result.Add(nameof(ObjectEntry.ContactMail), target.ContactMail);
            }

            if (source.ContactPosition != target.ContactPosition)
            {
                result.Add(nameof(ObjectEntry.ContactPosition), target.ContactPosition);
            }

            return result;
        }


        public async Task<Equipment> Store(Equipment model)
		{
			if (model != null)
			{
				if (model.Id != 0)
				{
					var previousObject = await GetEquipment(model.Id);
                    if (_accessControlService.HasAccess(previousObject))
                    {
                        UpdateMemory(previousObject, model);
                        RemoveOSFromEquipment(previousObject, model);
                        RemoveSoftwareFromEquipment(previousObject, model);
                        RemoveHDDFromEquipment(previousObject, model);
                        RemoveNetworkAdaptersFromEquipment(previousObject, model);

                        model.CompanyId = previousObject.CompanyId;
                        _context.Equipment.Update(model);
                        await _context.SaveChangesAsync();
                        return model;
                    }
                }

                model.CompanyId = _currentUser.User.CompanyId;
				_context.Equipment.Add(model);
				await _context.SaveChangesAsync();
				return model;
			}
			return null;
		}

		private void UpdateMemory(Equipment previousObject, Equipment currentObject)
		{
			var existingMemoryIds = previousObject.Devices.First().Memory.Select(x => x.Id).ToList();
			var memoryToRemove = existingMemoryIds.Except(currentObject.Devices.First().Memory.Select(x => x.Id));
			
			foreach (var memoryId in memoryToRemove)
			{
				var memory = new Memory() { Id = memoryId };
				_context.Memory.Attach(memory);
				_context.Memory.Remove(memory);
			}
		}

		private void RemoveOSFromEquipment(Equipment previousObject, Equipment currentObject)
		{
			var existingIds = previousObject.Devices.First().OperationSystems.Select(x => x.Id).ToList();
			var entitiesToRemove = existingIds.Except(currentObject.Devices.First().OperationSystems.Select(x => x.Id));
			foreach (var id in entitiesToRemove)
			{
				var entity = new OperationSystem() { Id = id };
				_context.OperationSystems.Attach(entity);
				_context.OperationSystems.Remove(entity);
			}
		}

		private void RemoveSoftwareFromEquipment(Equipment previousObject, Equipment currentObject)
		{
			var existingIds = previousObject.Devices.First().Software.Select(x => x.Id).ToList();
			var entitiesToRemove = existingIds.Except(currentObject.Devices.First().Software.Select(x => x.Id));
			foreach (var id in entitiesToRemove)
			{
				var entity = new Software(){ Id = id };
				_context.Software.Attach(entity);
				_context.Software.Remove(entity);
			}
		}

		private void RemoveHDDFromEquipment(Equipment previousObject, Equipment currentObject)
		{
			var existingIds = previousObject.Devices.First().HDD.Select(x => x.Id).ToList();
			var entitiesToRemove = existingIds.Except(currentObject.Devices.First().HDD.Select(x => x.Id));
			foreach (var id in entitiesToRemove)
			{
				var entity = new HDD() { Id = id };
				_context.HDD.Attach(entity);
				_context.HDD.Remove(entity);
			}
		}

		private void RemoveNetworkAdaptersFromEquipment(Equipment previousObject, Equipment currentObject)
		{
			var existingIds = previousObject.Devices.First().NetworkAdapters.Select(x => x.Id).ToList();
			var entitiesToRemove = existingIds.Except(currentObject.Devices.First().NetworkAdapters.Select(x => x.Id));
			foreach (var id in entitiesToRemove)
			{
				var entity = new NetworkAdapter() { Id = id };
				_context.NetworkAdapters.Attach(entity);
				_context.NetworkAdapters.Remove(entity);
			}
		}

		public async Task<IEnumerable<EquipmentListItem>> GetEquipmentList(EquipmentListFilter filter)
		{
			using (var conn = new SqlConnection(_connectionString))
			{
				conn.Open();
				return await conn.QueryAsync<EquipmentListItem>($"execute [dbo].[EquipmentList] @objectId, @skip, @take, @companyId", new
				{
					@objectId = filter.ObjectId,
					@skip =filter.Skip,
					@take =  filter.ItemsPerPage,
                    @companyId = _currentUser.User.CompanyId
				});
			}
		}

		public Task<int> Count(EquipmentListFilter filter)
		{
			return _context.Equipment
                .WhereCompany(_currentUser.User.CompanyId)
				.Where(filter.WhereExpression)
				.CountAsync();
		}

		public async Task<EquipmentDictionaryViewModel> LoadEquipmentDictionaries()
		{
			using (var conn = new SqlConnection(_connectionString))
			{
				conn.Open();
				var items = (await conn.QueryAsync<EquipmentDictionaryItem>($"execute [dbo].[EquipmentDictionaries] @companyId", 
                    new {companyId = _currentUser.User.CompanyId})).ToList();
				var result = new EquipmentDictionaryViewModel
				{
					DeviceTypes = items.Where(x => x.Type.Equals("DeviceType")).Select(x => new DictionaryItem<string>(x.Id, x.Value)),
					Platforms = items.Where(x => x.Type.Equals("Platform")).Select(x => new DictionaryItem<string>(x.Id, x.Value)),
					RaidTypes = items.Where(x => x.Type.Equals("RaidType")).Select(x => new DictionaryItem<string>(x.Id, x.Value)),
					CPU = items.Where(x => x.Type.Equals("CPU")).Select(x => new DictionaryItem<string>(x.Id, x.Value)),
					Memory = items.Where(x => x.Type.Equals("Memory")).Select(x => new DictionaryDataItem<string, float?>(x.Id, x.Value, x.Data)),
					Objects = items.Where(x => x.Type.Equals("Object")).Select(x => new DictionaryItem<string>(x.Id, x.Value)),
					OS = items.Where(x => x.Type.Equals("OS")).Select(x => new DictionaryItem<string>(x.Id, x.Value)),
					Software = items.Where(x => x.Type.Equals("Software")).Select(x => new DictionaryItem<string>(x.Id, x.Value)),
					HDD = items.Where(x => x.Type.Equals("HDD")).Select(x => new DictionaryDataItem<string, float?>(x.Id, x.Value, x.Data)),
					NetworkAdapters = items.Where(x => x.Type.Equals("NetworkAdapter")).Select(x => new DictionaryDataItem<string, float?>(x.Id, x.Value, x.Data))
				};
				return result;
			}
		}

		public async Task<ObjectDictionaryViewModel> LoadObjectDictionaries()
		{
			using (var conn = new SqlConnection(_connectionString))
			{
				conn.Open();
				var items = (await conn.QueryAsync<EquipmentDictionaryItem>($"execute [dbo].[ObjectDictionaries]")).ToList();
				var result = new ObjectDictionaryViewModel()
				{
					Branches = items.Where(x => x.Type.Equals("Branch")).Select(x => new DictionaryItem<string>(x.Id, x.Value)),
					Types = items.Where(x => x.Type.Equals("ObjectType")).Select(x => new DictionaryItem<string>(x.Id, x.Value))
				};
				return result;
			}
		}

		public Task<Equipment> GetEquipment(int id)
		{
			return _context
				.Equipment
                .WhereCompany(_currentUser.User.CompanyId)
                .Where(x => x.IsDeleted == false)
				.Include(x => x.Devices)
				.Include(x => x.Devices).ThenInclude(x => x.Memory)
				.Include(x => x.Devices).ThenInclude(x => x.HDD)
				.Include(x => x.Devices).ThenInclude(x => x.Software)
				.Include(x => x.Devices).ThenInclude(x => x.OperationSystems)
				.Include(x => x.Devices).ThenInclude(x => x.NetworkAdapters)
				.AsNoTracking()
				.FirstOrDefaultAsync(x => x.Id == id);
		}

		public async Task RemoveEquipment(int id)
        {
            var equipment = await _context.Equipment
                .Include(x => x.EquipmentLogRuleConditions)
                .Include(x => x.Incidents)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (!_accessControlService.HasAccess(equipment))
            {
                return;
            }
			if (equipment != null)
			{
                if (equipment.Incidents.Any() || equipment.EquipmentLogRuleConditions.Any())
                {
                    equipment.IsDeleted = true;
                }
                else
                {
                    _context.Equipment.Remove(equipment);
                }
                await _context.SaveChangesAsync();
            }
		}

		public async Task RemoveObject(int id)
		{
			var equipment = await _context.Objects.FindAsync(id);
            if (!_accessControlService.HasAccess(equipment))
            {
                return;
            }
			if (equipment != null)
			{
				_context.Objects.Remove(equipment);
				await _context.SaveChangesAsync();
			}
		}

		public async Task<ObjectEntry> GetObject(int id)
		{
			var objectEntry = await _context
					.Objects
					.AsNoTracking()
					.FirstOrDefaultAsync(x => x.Id == id);
            if (!_accessControlService.HasAccess(objectEntry))
            {
                return null;
            }
            return objectEntry;
        }

		public async Task<List<ObjectSummary>> GetSummary()
		{
			using (var conn = new SqlConnection(_connectionString))
			{
				conn.Open();
				return (await conn.QueryAsync<ObjectSummary>($"execute [dbo].[ObjectsMainPage] @companyId", new
                {
                    @companyId = _currentUser.User.CompanyId
                })).ToList();
			}
		}


		public async Task<List<Counter>> GetCounters()
		{

			using (var conn = new SqlConnection(_connectionString))
			{
				conn.Open();
				return (await conn.QueryAsync<Counter>($"execute [dbo].[CountersMainPage] @companyId", 
                    new {companyId = _currentUser.User.CompanyId}))
                    .ToList();
			}
		}
	}
}
