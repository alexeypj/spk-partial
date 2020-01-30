using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.IIS.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using sopka.Controllers;
using sopka.Models;
using sopka.Models.Abstract;
using sopka.Models.ContextModels;
using sopka.Models.ContextModels.Directories;
using sopka.Models.Filters;

namespace sopka.Services
{
	public class DirectoriesService
	{
		private readonly SopkaDbContext _context;
		private readonly string _connectionString;

		public DirectoriesService(SopkaDbContext context)
		{
			_context = context;
			_connectionString = _context.Database.GetDbConnection().ConnectionString;
		}

		public async Task<EquipmentDirectory> Store(EquipmentDirectory model)
		{
			if(model == null)
				throw new ArgumentException("Param is required", nameof(model));

			if (string.IsNullOrEmpty(model.Title))
				throw new ArgumentException("Название обязательно для заполнения", nameof(model.Title));


            if (model.Id == 0)
            {
                var existingEntry = await _context.EquipmentDirectory
                    .FirstOrDefaultAsync(x => x.Title.ToLower().Equals(model.Title.ToLower()));
                if (existingEntry != null)
                    throw new ConstraintException($"Тип оборудования с названием \"{model.Title}\" уже существует");
                _context.EquipmentDirectory.Add(model);
                await _context.SaveChangesAsync();
            }
            else
            {
                var existingEntry = await _context.EquipmentDirectory
                    .FirstOrDefaultAsync(x => x.Title.ToLower().Equals(model.Title.ToLower()) && x.Id != model.Id);
                if (existingEntry != null)
                    throw new ConstraintException($"Тип оборудования с названием \"{model.Title}\" уже существует");
                _context.EquipmentDirectory.Update(model);
                await _context.SaveChangesAsync();
            }
            return model;
		}

		public async Task<PlatformDirectory> Store(PlatformDirectory model)
		{
			if (model == null)
				throw new ArgumentException("Param is required", nameof(model));

			if (string.IsNullOrEmpty(model.Manufacturer))
				throw new ArgumentException("Manufacturer is required", nameof(model.Manufacturer));

			if (string.IsNullOrEmpty(model.Product))
				throw new ArgumentException("Product is required", nameof(model.Product));

            if (model.Id == 0)
            {
                var existingEntry = await _context.PlatformDirectory
                    .FirstOrDefaultAsync(x => x.Manufacturer.ToLower().Equals(model.Manufacturer.ToLower()) &&
                                              x.Product.ToLower().Equals(model.Product.ToLower()));
                if (existingEntry != null)
                    throw new ConstraintException($"Аппаратная платформа {model.Manufacturer} {model.Product} уже существует");

                _context.PlatformDirectory.Add(model);
                await _context.SaveChangesAsync();
            }
            else
            {
                var existingEntry = await _context.PlatformDirectory
                    .FirstOrDefaultAsync(x => x.Manufacturer.ToLower().Equals(model.Manufacturer.ToLower()) &&
                                              x.Product.ToLower().Equals(model.Product.ToLower()) && x.Id != model.Id);
                if (existingEntry != null)
                    throw new ConstraintException(
                        $"Аппаратная платформа {model.Manufacturer} {model.Product} уже существует");
                _context.PlatformDirectory.Update(model);
                await _context.SaveChangesAsync();

            }
            return model;
		}

		public async Task<CPUDirectory> Store(CPUDirectory model)
		{
			if (model == null)
				throw new ArgumentException("Param is required", nameof(model));

			if (string.IsNullOrEmpty(model.Manufacturer))
				throw new ArgumentException("Manufacturer is required", nameof(model.Manufacturer));

			if (string.IsNullOrEmpty(model.Product))
				throw new ArgumentException("Product is required", nameof(model.Product));


            if (model.Id == 0)
            {
                var existingEntry = await _context.CpuDirectory
                    .FirstOrDefaultAsync(x => x.Manufacturer.ToLower().Equals(model.Manufacturer.ToLower()) &&
                                              x.Product.ToLower().Equals(model.Product.ToLower()));
                if (existingEntry != null)
                    throw new ConstraintException($"Процессор {model.Manufacturer} {model.Product} уже существует");

                _context.CpuDirectory.Add(model);
                await _context.SaveChangesAsync();
            }
            else
            {
                var existingEntry = await _context.CpuDirectory
                    .FirstOrDefaultAsync(x => x.Manufacturer.ToLower().Equals(model.Manufacturer.ToLower()) &&
                                              x.Product.ToLower().Equals(model.Product.ToLower()) && x.Id != model.Id);
                if (existingEntry != null)
                    throw new ConstraintException(
                        $"Процессор {model.Manufacturer} {model.Product} уже существует");
                _context.CpuDirectory.Update(model);
                await _context.SaveChangesAsync();
            }
            return model;
		}

		public async Task<RAMDirectory> Store(RAMDirectory model)
		{
			if (model == null)
				throw new ArgumentException("Param is required", nameof(model));

			if (string.IsNullOrEmpty(model.Title))
				throw new ArgumentException("Title is required", nameof(model.Title));

			if (model.Volume == 0.0)
				throw new ArgumentException("Volume is required and greater then 0", nameof(model.Volume));

            if (model.Id == 0)
            {
                var existingEntry = await _context.RamDirectory
                    .FirstOrDefaultAsync(x => x.Title.ToLower().Equals(model.Title.ToLower()) && x.Volume.Equals(model.Volume));
                if (existingEntry != null)
                    throw new ConstraintException($"Память {model.Title} {model.Volume} уже существует");

                _context.RamDirectory.Add(model);
                await _context.SaveChangesAsync();
            }
            else
            {
                var existingEntry = await _context.RamDirectory
                    .FirstOrDefaultAsync(x => x.Title.ToLower().Equals(model.Title.ToLower()) && 
                                              x.Volume.Equals(model.Volume) &&
                                              x.Id != model.Id);
                if (existingEntry != null)
                    throw new ConstraintException($"Память {model.Title} {model.Volume} уже существует");

                _context.RamDirectory.Update(model);
                await _context.SaveChangesAsync();
            }
            return model;
		}

		public async Task<HDDDirectory> Store(HDDDirectory model)
		{
			if (model == null)
				throw new ArgumentException("Param is required", nameof(model));

			if (string.IsNullOrEmpty(model.Title))
				throw new ArgumentException("Title is required", nameof(model.Title));

			if (model.Volume == 0.0)
				throw new ArgumentException("Volume is required and greater then 0", nameof(model.Volume));

            if (model.Id == 0)
            {
                var existingEntry = await _context.HddDirectory
                    .FirstOrDefaultAsync(x => x.Title.ToLower().Equals(model.Title.ToLower()) && x.Volume.Equals(model.Volume));
                if (existingEntry != null)
                    throw new ConstraintException($"Диск {model.Title} {model.Volume} уже существует");

                _context.HddDirectory.Add(model);
                await _context.SaveChangesAsync();
            }
            else
            {
                var existingEntry = await _context.HddDirectory
                    .FirstOrDefaultAsync(x => x.Title.ToLower().Equals(model.Title.ToLower()) && 
                                              x.Volume.Equals(model.Volume) && 
                                              x.Id != model.Id);
                if (existingEntry != null)
                    throw new ConstraintException($"Диск {model.Title} {model.Volume} уже существует");

                _context.HddDirectory.Update(model);
                await _context.SaveChangesAsync();
            }
            return model;
		}

		public async Task<NetworkAdapterDirectory> Store(NetworkAdapterDirectory model)
		{
			if (model == null)
				throw new ArgumentException("Param is required", nameof(model));

			if (string.IsNullOrEmpty(model.Title))
				throw new ArgumentException("Title is required", nameof(model.Title));

			if (model.Speed.Equals(0))
				throw new ArgumentException("Speed is required and greater then 0", nameof(model.Speed));

            if (model.Id == 0)
            {
                var existingEntry = await _context.NetworkAdapterDirectory
                    .FirstOrDefaultAsync(x => x.Title.ToLower().Equals(model.Title.ToLower()) && x.Speed.Equals(model.Speed));
                if (existingEntry != null)
                    throw new ConstraintException($"Сетевой адаптер {model.Title} {model.Speed} уже существует");

                _context.NetworkAdapterDirectory.Add(model);
                await _context.SaveChangesAsync();
            }
            else
            {
                var existingEntry = await _context.NetworkAdapterDirectory
                    .FirstOrDefaultAsync(x => x.Title.ToLower().Equals(model.Title.ToLower()) 
                                              && x.Speed.Equals(model.Speed) &&
                                              x.Id != model.Id);
                if (existingEntry != null)
                    throw new ConstraintException($"Сетевой адаптер {model.Title} {model.Speed} уже существует");

                _context.NetworkAdapterDirectory.Update(model);
                await _context.SaveChangesAsync();
            }


            return model;
		}

		public async Task<SoftDirectory> Store(SoftDirectory model)
		{
			if (model == null)
				throw new ArgumentException("Param is required", nameof(model));

			if (string.IsNullOrEmpty(model.Manufacturer))
				throw new ArgumentException("Manufacturer is required", nameof(model.Manufacturer));

			if (string.IsNullOrEmpty(model.Product))
				throw new ArgumentException("Product is required", nameof(model.Product));

            if (model.Id == 0)
            {
                var existingEntry = await _context.SoftDirectory
                    .FirstOrDefaultAsync(x => x.Manufacturer.ToLower().Equals(model.Manufacturer.ToLower()) &&
                                              x.Product.ToLower().Equals(model.Product.ToLower()));
                if (existingEntry != null)
                    throw new ConstraintException($"ПО {model.Manufacturer} {model.Product} уже существует");
                _context.SoftDirectory.Add(model);
                await _context.SaveChangesAsync();
            }
            else
            {
                var existingEntry = await _context.SoftDirectory
                    .FirstOrDefaultAsync(x => x.Manufacturer.ToLower().Equals(model.Manufacturer.ToLower()) &&
                                              x.Product.ToLower().Equals(model.Product.ToLower()) && x.Id != model.Id);
                if (existingEntry != null)
                    throw new ConstraintException(
                        $"ПО {model.Manufacturer} {model.Product} уже существует");
                _context.SoftDirectory.Update(model);
                await _context.SaveChangesAsync();

            }
            return model;
		}

		public async Task<OSDirectory> Store(OSDirectory model)
		{
			if (model == null)
				throw new ArgumentException("Param is required", nameof(model));

			if (string.IsNullOrEmpty(model.Manufacturer))
				throw new ArgumentException("Manufacturer is required", nameof(model.Manufacturer));

			if (string.IsNullOrEmpty(model.Product))
				throw new ArgumentException("Product is required", nameof(model.Product));

            if (model.Id == 0)
            {
                var existingEntry = await _context.OsDirectory
                    .FirstOrDefaultAsync(x => x.Manufacturer.ToLower().Equals(model.Manufacturer.ToLower()) &&
                                              x.Product.ToLower().Equals(model.Product.ToLower()));
                if (existingEntry != null)
                    throw new ConstraintException(
                        $"ОС {model.Manufacturer} {model.Product} уже существует");
                _context.OsDirectory.Add(model);
                await _context.SaveChangesAsync();
            }
            else
            {
                var existingEntry = await _context.OsDirectory
                    .FirstOrDefaultAsync(x => x.Manufacturer.ToLower().Equals(model.Manufacturer.ToLower()) &&
                                              x.Product.ToLower().Equals(model.Product.ToLower()) && x.Id != model.Id);
                if (existingEntry != null)
                    throw new ConstraintException(
                        $"ОС {model.Manufacturer} {model.Product} уже существует");
                _context.OsDirectory.Update(model);
                await _context.SaveChangesAsync();

            }

            return model;
		}

        public async Task<ObjectDirectory> Store(ObjectDirectory model)
        {
            if (model == null)
                throw new ArgumentException("Param is required", nameof(model));

            if (string.IsNullOrEmpty(model.Title))
                throw new ArgumentException("Title is required", nameof(model.Title));

            if (model.Id == 0)
            {
                var existingEntry = await _context.ObjectDirectory
                    .FirstOrDefaultAsync(x => x.Title.ToLower().Equals(model.Title.ToLower()));
                if (existingEntry != null)
                    throw new ConstraintException($"Объект с именем \"{model.Title}\" уже существует");
                _context.ObjectDirectory.Add(model);
                await _context.SaveChangesAsync();
            }
            else
            {
                var existingEntry = await _context.ObjectDirectory
                    .FirstOrDefaultAsync(x => x.Title.ToLower().Equals(model.Title.ToLower()) && x.Id != model.Id);
                if (existingEntry != null)
                    throw new ConstraintException($"Объект с именем \"{model.Title}\" уже существует");
                _context.ObjectDirectory.Update(model);
                await _context.SaveChangesAsync();
            }
            return model;
        }




        public async Task<PaginationModel<ObjectDirectory>> GetObjectTypes(ObjectTypesFilter filter)
        {
            var q = filter.Query?.Trim();
            var title = filter.Title?.Trim();
            var description = filter.Description?.Trim();
            var query = _context.ObjectDirectory
                .Where(x => (string.IsNullOrEmpty(q) || x.Title.Contains(q) || x.Description.Contains(q)) &&
                            (string.IsNullOrEmpty(title) || x.Title.Contains(title)) &&
                            (string.IsNullOrEmpty(description) || x.Description.Contains(description)));

            var itemsQuery = query;
            Expression<Func<ObjectDirectory, object>> order;
            switch (filter.SortColumn)
            {
                case nameof(ObjectDirectory.Description):
                    order = x => x.Description;
                    break;
                case nameof(ObjectDirectory.Title):
                    order = x => x.Title;
                    break;
                default:
                    order = x => x.Id;
                    break;
            }

            if (filter.SortDirection == Direction.Asc)
                itemsQuery = itemsQuery.OrderBy(order);
            else
                itemsQuery = itemsQuery.OrderByDescending(order);

            var items = await itemsQuery.Skip(filter.Skip).Take(filter.ItemsPerPage).ToListAsync();
            var count = await query.CountAsync();

            return new PaginationModel<ObjectDirectory>()
            {
                Items = items,
                Total = count
            };
        }

        public async Task<BranchDirectory> Store(BranchDirectory model)
        {
            if (model == null)
                throw new ArgumentException("Param is required", nameof(model));

            if (string.IsNullOrEmpty(model.Title))
                throw new ArgumentException("Title is required", nameof(model.Title));

            if (model.Id == 0)
            {
                var existingEntry = await _context.BranchDirectory
                    .FirstOrDefaultAsync(x => x.Title.ToLower().Equals(model.Title.ToLower()));
                if (existingEntry != null)
                    throw new ConstraintException($"Equipment type with name \"{model.Title}\" already exists");
                _context.BranchDirectory.Add(model);
                await _context.SaveChangesAsync();
            }
            else
            {
                var existingEntry = await _context.BranchDirectory
                    .FirstOrDefaultAsync(x => x.Title.ToLower().Equals(model.Title.ToLower()) && x.Id != model.Id);
                if (existingEntry != null)
                    throw new ConstraintException($"Equipment type with name \"{model.Title}\" already exists");
                _context.BranchDirectory.Update(model);
                await _context.SaveChangesAsync();
            }
            return model;
        }

        public async Task<AttackDirectory> Store(AttackDirectory model)
        {
            if (model == null)
                throw new ArgumentException("Param is required", nameof(model));

            if (string.IsNullOrEmpty(model.Title))
                throw new ArgumentException("Title is required", nameof(model.Title));

            if (model.Id == 0)
            {
                var existingEntry = await _context.AttackDirectory
                    .FirstOrDefaultAsync(x => x.Title.ToLower().Equals(model.Title.ToLower()));
                if (existingEntry != null)
                    throw new ConstraintException($"Equipment type with name \"{model.Title}\" already exists");
                _context.AttackDirectory.Add(model);
                await _context.SaveChangesAsync();
            }
            else
            {
                var existingEntry = await _context.AttackDirectory
                    .FirstOrDefaultAsync(x => x.Title.ToLower().Equals(model.Title.ToLower()) && x.Id != model.Id);
                if (existingEntry != null)
                    throw new ConstraintException($"Equipment type with name \"{model.Title}\" already exists");
                _context.AttackDirectory.Update(model);
                await _context.SaveChangesAsync();
            }
            return model;
        }

        public async Task<RAIDDirectory> Store(RAIDDirectory model)
        {
            if (model == null)
                throw new ArgumentException("Param is required", nameof(model));

            if (string.IsNullOrEmpty(model.Title))
                throw new ArgumentException("Title is required", nameof(model.Title));

            if (model.Id == 0)
            {
                var existingEntry = await _context.RaidDirectory
                    .FirstOrDefaultAsync(x => x.Title.ToLower().Equals(model.Title.ToLower()));
                if (existingEntry != null)
                    throw new ConstraintException($"Equipment type with name \"{model.Title}\" already exists");
                _context.RaidDirectory.Add(model);
                await _context.SaveChangesAsync();
            }
            else
            {
                var existingEntry = await _context.RaidDirectory
                    .FirstOrDefaultAsync(x => x.Title.ToLower().Equals(model.Title.ToLower()) && x.Id != model.Id);
                if (existingEntry != null)
                    throw new ConstraintException($"Equipment type with name \"{model.Title}\" already exists");
                _context.RaidDirectory.Update(model);
                await _context.SaveChangesAsync();
            }
            return model;
        }

        public async Task<IncidentCriticality> Store(IncidentCriticality model)
        {
            if (model == null)
                throw new ArgumentException("Param is required", nameof(model));

            if (string.IsNullOrEmpty(model.Criticality))
                throw new ArgumentException("Title is required", nameof(model.Criticality));

            var existingEntry = await _context.IncidentCriticality
                .FirstOrDefaultAsync(x => x.Criticality.ToLower().Equals(model.Criticality.ToLower()));
            if (existingEntry != null)
                throw new ConstraintException($"Критичность \"{model.Criticality}\" уже существует");
            _context.IncidentCriticality.Add(model);
            await _context.SaveChangesAsync();
            return model;
        }




        public async Task<PaginationModel<BranchDirectory>> GetBranches(BranchesFilter filter)
        {
            var q = filter.Query?.Trim();
            var title = filter.Title?.Trim();
            var description = filter.Description?.Trim();
            var query = _context.BranchDirectory
                .Where(x => (string.IsNullOrEmpty(q) || x.Title.Contains(q) || x.Description.Contains(q)) &&
                            (string.IsNullOrEmpty(title) || x.Title.Contains(title)) &&
                            (string.IsNullOrEmpty(description) || x.Description.Contains(description)));

            var itemsQuery = query;
            Expression<Func<BranchDirectory, object>> order;
            switch (filter.SortColumn)
            {
                case nameof(BranchDirectory.Description):
                    order = x => x.Description;
                    break;
                case nameof(BranchDirectory.Title):
                    order = x => x.Title;
                    break;
                default:
                    order = x => x.Id;
                    break;
            }

            if (filter.SortDirection == Direction.Asc)
                itemsQuery = itemsQuery.OrderBy(order);
            else
                itemsQuery = itemsQuery.OrderByDescending(order);


            var items = await itemsQuery.Skip(filter.Skip).Take(filter.ItemsPerPage).ToListAsync();
            var count = await query.CountAsync();

            return new PaginationModel<BranchDirectory>()
            {
                Items = items,
                Total = count
            };
        }

        public async Task<PaginationModel<EquipmentDirectory>> GetEquipmentTypes(EquipmentTypesFilter filter)
        {
            var q = filter.Query?.Trim();
            var title = filter.Title?.Trim();
            var description = filter.Description?.Trim();
            var query = _context.EquipmentDirectory
                .Where(x => (string.IsNullOrEmpty(q) || x.Title.Contains(q) || x.Description.Contains(q)) &&
                            (string.IsNullOrEmpty(title) || x.Title.Contains(title)) &&
                            (string.IsNullOrEmpty(description) || x.Description.Contains(description)));

            var itemsQuery = query;
            Expression<Func<EquipmentDirectory, object>> order;
            switch (filter.SortColumn)
            {
                case nameof(EquipmentDirectory.Description):
                    order = x => x.Description;
                    break;
                case nameof(EquipmentDirectory.Title):
                    order = x => x.Title;
                    break;
                default:
                    order = x => x.Id;
                    break;
            }

            if (filter.SortDirection == Direction.Asc)
                itemsQuery = itemsQuery.OrderBy(order);
            else
                itemsQuery = itemsQuery.OrderByDescending(order);

            var items = await itemsQuery.Skip(filter.Skip).Take(filter.ItemsPerPage).ToListAsync();
            var count = await query.CountAsync();

            return new PaginationModel<EquipmentDirectory>()
            {
                Items = items,
                Total = count
            };
        }

        public async Task<PaginationModel<AttackDirectory>> GetAttackTypes(AttackTypesFilter filter)
        {
            var q = filter.Query?.Trim();
            var title = filter.Title?.Trim();
            var description = filter.Description?.Trim();
            var query = _context.AttackDirectory
                .Where(x => (string.IsNullOrEmpty(q) || x.Title.Contains(q) || x.Description.Contains(q)) &&
                            (string.IsNullOrEmpty(title) || x.Title.Contains(title)) &&
                            (string.IsNullOrEmpty(description) || x.Description.Contains(description)));

            var itemsQuery = query;
            Expression<Func<AttackDirectory, object>> order;
            switch (filter.SortColumn)
            {
                case nameof(AttackDirectory.Description):
                    order = x => x.Description;
                    break;
                case nameof(AttackDirectory.Title):
                    order = x => x.Title;
                    break;
                case nameof(AttackDirectory.CriticalityDefault):
                    order = x => x.CriticalityDefault;
                    break;
                default:
                    order = x => x.Id;
                    break;
            }

            if (filter.SortDirection == Direction.Asc)
                itemsQuery = itemsQuery.OrderBy(order);
            else
                itemsQuery = itemsQuery.OrderByDescending(order);

            var items = await itemsQuery.Include(x => x.IncidentCriticality)
                .Skip(filter.Skip).Take(filter.ItemsPerPage).ToListAsync();
            var count = await query.CountAsync();

            return new PaginationModel<AttackDirectory>()
            {
                Items = items,
                Total = count
            };
        }

        public async Task<PaginationModel<RAIDDirectory>> GetRaid(RaidFilter filter)
        {
            var q = filter.Query?.Trim();
            var title = filter.Title?.Trim();
            var description = filter.Description?.Trim();
            var query = _context.RaidDirectory
                .Where(x => (string.IsNullOrEmpty(q) || x.Title.Contains(q) || x.Description.Contains(q)) &&
                            (string.IsNullOrEmpty(title) || x.Title.Contains(title)) &&
                            (string.IsNullOrEmpty(description) || x.Description.Contains(description)));

            var itemsQuery = query;
            Expression<Func<RAIDDirectory, object>> order;
            switch (filter.SortColumn)
            {
                case nameof(RAIDDirectory.Description):
                    order = x => x.Description;
                    break;
                case nameof(RAIDDirectory.Title):
                    order = x => x.Title;
                    break;
                default:
                    order = x => x.Id;
                    break;
            }

            if (filter.SortDirection == Direction.Asc)
                itemsQuery = itemsQuery.OrderBy(order);
            else
                itemsQuery = itemsQuery.OrderByDescending(order);


            var items = await itemsQuery.Skip(filter.Skip).Take(filter.ItemsPerPage).ToListAsync();
            var count = await query.CountAsync();

            return new PaginationModel<RAIDDirectory>()
            {
                Items = items,
                Total = count
            };
        }

        public async Task<PaginationModel<OSDirectory>> GetOS(OSFilter filter)
        {
            var q = filter.Query?.Trim();
            var product = filter.Product?.Trim();
            var manufacturer = filter.Manufacturer?.Trim();
            var query = _context.OsDirectory
                .Where(x => (string.IsNullOrEmpty(q) || x.Product.Contains(q) || x.Manufacturer.Contains(q)) &&
                            (string.IsNullOrEmpty(product) || x.Product.Contains(product)) &&
                            (string.IsNullOrEmpty(manufacturer) || x.Manufacturer.Contains(manufacturer)));

            var itemsQuery = query;
            Expression<Func<OSDirectory, object>> order;
            switch (filter.SortColumn)
            {
                case nameof(OSDirectory.Product):
                    order = x => x.Product;
                    break;
                case nameof(OSDirectory.Manufacturer):
                    order = x => x.Manufacturer;
                    break;
                default:
                    order = x => x.Id;
                    break;
            }

            if (filter.SortDirection == Direction.Asc)
                itemsQuery = itemsQuery.OrderBy(order);
            else
                itemsQuery = itemsQuery.OrderByDescending(order);


            var items = await itemsQuery.Skip(filter.Skip).Take(filter.ItemsPerPage).ToListAsync();
            var count = await query.CountAsync();

            return new PaginationModel<OSDirectory>()
            {
                Items = items,
                Total = count
            };
        }

        public async Task<PaginationModel<SoftDirectory>> GetSoftware(SoftwareFilter filter)
        {
            var q = filter.Query?.Trim();
            var product = filter.Product?.Trim();
            var manufacturer = filter.Manufacturer?.Trim();
            var query = _context.SoftDirectory
                .Where(x => (string.IsNullOrEmpty(q) || x.Product.Contains(q) || x.Manufacturer.Contains(q)) &&
                            (string.IsNullOrEmpty(product) || x.Product.Contains(product)) &&
                            (string.IsNullOrEmpty(manufacturer) || x.Manufacturer.Contains(manufacturer)));

            var itemsQuery = query;
            Expression<Func<SoftDirectory, object>> order;
            switch (filter.SortColumn)
            {
                case nameof(SoftDirectory.Product):
                    order = x => x.Product;
                    break;
                case nameof(SoftDirectory.Manufacturer):
                    order = x => x.Manufacturer;
                    break;
                default:
                    order = x => x.Id;
                    break;
            }

            if (filter.SortDirection == Direction.Asc)
                itemsQuery = itemsQuery.OrderBy(order);
            else
                itemsQuery = itemsQuery.OrderByDescending(order);

            var items = await itemsQuery.Skip(filter.Skip).Take(filter.ItemsPerPage).ToListAsync();
            var count = await query.CountAsync();

            return new PaginationModel<SoftDirectory>()
            {
                Items = items,
                Total = count
            };
        }

        public async Task<PaginationModel<PlatformDirectory>> GetPlatforms(PlatformFilter filter)
        {
            var q = filter.Query?.Trim();
            var product = filter.Product?.Trim();
            var manufacturer = filter.Manufacturer?.Trim();
            var query = _context.PlatformDirectory
                .Where(x => (string.IsNullOrEmpty(q) || x.Product.Contains(q) || x.Manufacturer.Contains(q)) &&
                            (string.IsNullOrEmpty(product) || x.Product.Contains(product)) &&
                            (string.IsNullOrEmpty(manufacturer) || x.Manufacturer.Contains(manufacturer)));

            var itemsQuery = query;
            Expression<Func<PlatformDirectory, object>> order;
            switch (filter.SortColumn)
            {
                case nameof(PlatformDirectory.Product):
                    order = x => x.Product;
                    break;
                case nameof(PlatformDirectory.Manufacturer):
                    order = x => x.Manufacturer;
                    break;
                default:
                    order = x => x.Id;
                    break;
            }

            if (filter.SortDirection == Direction.Asc)
                itemsQuery = itemsQuery.OrderBy(order);
            else
                itemsQuery = itemsQuery.OrderByDescending(order);

            var items = await itemsQuery.Skip(filter.Skip).Take(filter.ItemsPerPage).ToListAsync();
            var count = await query.CountAsync();

            return new PaginationModel<PlatformDirectory>()
            {
                Items = items,
                Total = count
            };
        }


        public async Task<ServiceActionResult> RemoveObjectType(int id)
        {
            var entity = await _context.ObjectDirectory.FindAsync(id);
            if (entity != null)
            {
                var used = await _context.Objects.AnyAsync(x => x.IdType == id);
                if (used || await UsedInTags(DirectoryType.Object, id))
                {
                    return new ServiceActionResult()
                    {
                        Success = false,
                        Message = "Данный элемент используется"
                    };
                }
                _context.ObjectDirectory.Remove(entity);
                await _context.SaveChangesAsync();
            }
            return new ServiceActionResult() {Success = true};
        }

        public async Task<ServiceActionResult> RemoveBranch(int id)
        {
            var entity = await _context.BranchDirectory.FindAsync(id);
            if (entity != null)
            {
                var used = await _context.Objects.AnyAsync(x => x.IdBranch == entity.Id);
                if (used || await UsedInTags(DirectoryType.Branch, id))
                {
                    return new ServiceActionResult()
                    {
                        Success = false,
                        Message = "Данный элемент используется"
                    };
                }
                _context.BranchDirectory.Remove(entity);
                await _context.SaveChangesAsync();
            }
            return new ServiceActionResult() { Success = true };
        }

        public async Task<ServiceActionResult> RemoveEquipmentType(int id)
        {
            var entity = await _context.EquipmentDirectory.FindAsync(id);
            if (entity != null)
            {
                var used = await _context.Equipment.AnyAsync(x => x.Type == entity.Id);
                if (used || await UsedInTags(DirectoryType.Equipment, id))
                {
                    return new ServiceActionResult()
                    {
                        Success = false,
                        Message = "Данный элемент используется"
                    };
                }
                _context.EquipmentDirectory.Remove(entity);
                await _context.SaveChangesAsync();
            }
            return new ServiceActionResult() { Success = true };
        }

        public async Task<ServiceActionResult> RemoveAttackType(int id)
        {
            var entity = await _context.AttackDirectory.FindAsync(id);
            if (entity != null)
            {
                var used = await _context.Incidents.AnyAsync(x => x.AttackType == id);
                if (used || await UsedInTags(DirectoryType.Attack, id))
                {
                    return new ServiceActionResult()
                    {
                        Success = false,
                        Message = "Данный элемент используется"
                    };
                }
                _context.AttackDirectory.Remove(entity);
                await _context.SaveChangesAsync();
            }
            return new ServiceActionResult() { Success = true };
        }

        public async Task<ServiceActionResult> RemoveRaid(int id)
        {
            var entity = await _context.RaidDirectory.FindAsync(id);
            if (entity != null)
            {
                var used = await _context.HDD.AnyAsync(x => x.IdRAIDDirectory == id);
                if (used || await UsedInTags(DirectoryType.RAID, id))
                {
                    return new ServiceActionResult()
                    {
                        Success = false,
                        Message = "Данный элемент используется"
                    };
                }
                _context.RaidDirectory.Remove(entity);
                await _context.SaveChangesAsync();
            }
            return new ServiceActionResult() { Success = true };
        }

        public async Task<ServiceActionResult> RemoveOS(int id)
        {
            var entity = await _context.OsDirectory.FindAsync(id);
            if (entity != null)
            {
                var used = await _context.OperationSystems.AnyAsync(x => x.IdOSDirectory == id);
                if (used || await UsedInTags(DirectoryType.OS, id))
                {
                    return new ServiceActionResult()
                    {
                        Success = false,
                        Message = "Данный элемент используется"
                    };
                }
                _context.OsDirectory.Remove(entity);
                await _context.SaveChangesAsync();
            }
            return new ServiceActionResult() { Success = true };
        }

        public async Task<ServiceActionResult> RemoveSoftware(int id)
        {
            var entity = await _context.SoftDirectory.FindAsync(id);
            if (entity != null)
            {
                var used = await _context.Software.AnyAsync(x => x.IdSoftDirectory == id);
                if (used || await UsedInTags(DirectoryType.Soft, id))
                {
                    return new ServiceActionResult()
                    {
                        Success = false,
                        Message = "Данный элемент используется"
                    };
                }
                _context.SoftDirectory.Remove(entity);
                await _context.SaveChangesAsync();
            }
            return new ServiceActionResult() { Success = true };
        }

        public async Task<ServiceActionResult> RemovePlatform(int id)
        {
            var entity = await _context.PlatformDirectory.FindAsync(id);
            if (entity != null)
            {
                var used = await _context.Equipment.AnyAsync(x => x.Platform == id);
                if (used || await UsedInTags(DirectoryType.Platform, id))
                {
                    return new ServiceActionResult()
                    {
                        Success = false,
                        Message = "Данный элемент используется"
                    };
                }
                _context.PlatformDirectory.Remove(entity);
                await _context.SaveChangesAsync();
            }
            return new ServiceActionResult() { Success = true };
        }

        public async Task<PaginationModel<CPUDirectory>> GetProcessors(ProcessorFilter filter)
        {
            var q = filter.Query?.Trim();
            var product = filter.Product?.Trim();
            var manufacturer = filter.Manufacturer?.Trim();
            var query = _context.CpuDirectory
                .Where(x => (string.IsNullOrEmpty(q) || x.Product.Contains(q) || x.Manufacturer.Contains(q)) &&
                            (string.IsNullOrEmpty(product) || x.Product.Contains(product)) &&
                            (string.IsNullOrEmpty(manufacturer) || x.Manufacturer.Contains(manufacturer)) &&
                            (!filter.CoresNumber.HasValue || x.CoresNumber == filter.CoresNumber));

            var itemsQuery = query;
            Expression<Func<CPUDirectory, object>> order;
            switch (filter.SortColumn)
            {
                case nameof(CPUDirectory.Product):
                    order = x => x.Product;
                    break;
                case nameof(CPUDirectory.Manufacturer):
                    order = x => x.Manufacturer;
                    break;
                case nameof(CPUDirectory.CoresNumber):
                    order = x => x.CoresNumber;
                    break;
                default:
                    order = x => x.Id;
                    break;
            }

            if (filter.SortDirection == Direction.Asc)
                itemsQuery = itemsQuery.OrderBy(order);
            else
                itemsQuery = itemsQuery.OrderByDescending(order);

            var items = await itemsQuery.Skip(filter.Skip).Take(filter.ItemsPerPage).ToListAsync();
            var count = await query.CountAsync();

            return new PaginationModel<CPUDirectory>()
            {
                Items = items,
                Total = count
            };
        }

        public async Task<ServiceActionResult> RemoveProcessor(int id)
        {
            var entity = await _context.CpuDirectory.FindAsync(id);
            if (entity != null)
            {
                var used = await _context.Devices.AnyAsync(x => x.IdCPU == id);
                if (used || await UsedInTags(DirectoryType.CPU, id))
                {
                    return new ServiceActionResult()
                    {
                        Success = false,
                        Message = "Данный элемент используется"
                    };
                }
                _context.CpuDirectory.Remove(entity);
                await _context.SaveChangesAsync();
            }
            return new ServiceActionResult() { Success = true };
        }

        public async Task<PaginationModel<HDDDirectory>> GetHDD(HDDFilter filter)
        {
            var q = filter.Query?.Trim();
            if (double.TryParse(q, out double val))
            {
	            filter.Volume = val;
	            q = string.Empty;
            }

            var title = filter.Title?.Trim();
            var query = _context.HddDirectory.AsQueryable();

            if (string.IsNullOrEmpty(q) == false)
            {
	            query = query.Where(x => x.Title.Contains(q.ToLower()));
            }

            if (filter.Volume.HasValue)
            {
	            query = query.Where(x => x.Volume == filter.Volume || x.Volume.ToString().StartsWith(filter.Volume.Value.ToString()));
            }

            if (!string.IsNullOrEmpty(title))
            {
                query = query.Where(x => x.Title.Contains(title));
            }

            var itemsQuery = query;
            Expression<Func<HDDDirectory, object>> order;
            switch (filter.SortColumn)
            {
                case nameof(HDDDirectory.Title):
                    order = x => x.Title;
                    break;
                case nameof(HDDDirectory.Volume):
                    order = x => x.Volume;
                    break;
                default:
                    order = x => x.Id;
                    break;
            }

            if (filter.SortDirection == Direction.Asc)
                itemsQuery = itemsQuery.OrderBy(order);
            else
                itemsQuery = itemsQuery.OrderByDescending(order);

            var items = await itemsQuery.Skip(filter.Skip).Take(filter.ItemsPerPage).ToListAsync();
            var count = await query.CountAsync();

            return new PaginationModel<HDDDirectory>()
            {
                Items = items,
                Total = count
            };
        }

        public async Task<ServiceActionResult> RemoveHDD(int id)
        {
            var entity = await _context.HddDirectory.FindAsync(id);
            if (entity != null)
            {
                var used = await _context.HDD.AnyAsync(x => x.IdHDDDirectory == id);
                if (used || await UsedInTags(DirectoryType.HDD, id))
                {
                    return new ServiceActionResult()
                    {
                        Success = false,
                        Message = "Данный элемент используется"
                    };
                }
                _context.HddDirectory.Remove(entity);
                await _context.SaveChangesAsync();
            }
            return new ServiceActionResult() { Success = true };
        }

        public async Task<PaginationModel<RAMDirectory>> GetRAM(RAMFilter filter)
        {
            var q = filter.Query?.Trim();
            var title = filter.Title?.Trim();

            if (double.TryParse(q, out double val))
            {
	            filter.Volume = val;
	            q = string.Empty;
            }
			
            var query = _context.RamDirectory.AsQueryable();

            if (string.IsNullOrEmpty(q) == false)
            {
	            query = query.Where(x => x.Title.Contains(q.ToLower()));
            }

            if (filter.Volume.HasValue)
            {
	            query = query.Where(x => x.Volume == filter.Volume || x.Volume.ToString().StartsWith(filter.Volume.Value.ToString()));
            }

            if (!string.IsNullOrEmpty(title))
            {
                query = query.Where(x => x.Title.Contains(title));
            }

            var itemsQuery = query;
            Expression<Func<RAMDirectory, object>> order;
            switch (filter.SortColumn)
            {
                case nameof(RAMDirectory.Title):
                    order = x => x.Title;
                    break;
                case nameof(RAMDirectory.Volume):
                    order = x => x.Volume;
                    break;
                default:
                    order = x => x.Id;
                    break;
            }

            if (filter.SortDirection == Direction.Asc)
                itemsQuery = itemsQuery.OrderBy(order);
            else
                itemsQuery = itemsQuery.OrderByDescending(order);

            var items = await itemsQuery.Skip(filter.Skip).Take(filter.ItemsPerPage).ToListAsync();
            var count = await query.CountAsync();

            return new PaginationModel<RAMDirectory>()
            {
                Items = items,
                Total = count
            };
        }
        public async Task<ServiceActionResult> RemoveRAM(int id)
        {
            var entity = await _context.RamDirectory.FindAsync(id);
            if (entity != null)
            {
                var used = await _context.Memory.AnyAsync(x => x.IdRAMDirectory == id);
                if (used || await UsedInTags(DirectoryType.RAM, id))
                {
                    return new ServiceActionResult()
                    {
                        Success = false,
                        Message = "Данный элемент используется"
                    };
                }
                _context.RamDirectory.Remove(entity);
                await _context.SaveChangesAsync();
            }
            return new ServiceActionResult() { Success = true };
        }


        public async Task<PaginationModel<NetworkAdapterDirectory>> GetNetworkAdapters(NetworkAdapterFilter filter)
        {
            var q = filter.Query?.Trim();
            var title = filter.Title?.Trim();
			if (double.TryParse(q, out double val))
			{
				filter.Speed = val;
				q = string.Empty;
			}

			var query = _context.NetworkAdapterDirectory.AsQueryable();

			if (string.IsNullOrEmpty(q) == false)
			{
				query = query.Where(x => x.Title.Contains(q.ToLower()));
			}

			if (filter.Speed.HasValue)
			{
				query = query.Where(x => x.Speed == filter.Speed || x.Speed.ToString().StartsWith(filter.Speed.Value.ToString()));
			}

            if (!string.IsNullOrEmpty(title))
            {
                query = query.Where(x => x.Title.Contains(title));
            }

            var itemsQuery = query;
            Expression<Func<NetworkAdapterDirectory, object>> order;
            switch (filter.SortColumn)
            {
                case nameof(NetworkAdapterDirectory.Title):
                    order = x => x.Title;
                    break;
                case nameof(NetworkAdapterDirectory.Speed):
                    order = x => x.Speed;
                    break;
                default:
                    order = x => x.Id;
                    break;
            }

            if (filter.SortDirection == Direction.Asc)
                itemsQuery = itemsQuery.OrderBy(order);
            else
                itemsQuery = itemsQuery.OrderByDescending(order);


            var items = await itemsQuery.Skip(filter.Skip).Take(filter.ItemsPerPage).ToListAsync();
            var count = await query.CountAsync();

            return new PaginationModel<NetworkAdapterDirectory>()
            {
                Items = items,
                Total = count
            };
        }

        public async Task<ServiceActionResult> RemoveNetworkAdapter(int id)
        {
            var entity = await _context.NetworkAdapterDirectory.FindAsync(id);
            if (entity != null)
            {
                var used = await _context.NetworkAdapters.AnyAsync(x => x.IdNetworkAdapterDirectory == id);
                if (used || await UsedInTags(DirectoryType.NetworkAdapter, id))
                {
                    return new ServiceActionResult()
                    {
                        Success = false,
                        Message = "Данный элемент используется"
                    };
                }
                _context.NetworkAdapterDirectory.Remove(entity);
                await _context.SaveChangesAsync();
            }
            return new ServiceActionResult() { Success = true };
        }

        public async Task<bool> UsedInTags(string directoryType, int directoryId)
        {
            return await _context.TagsToDirectory.AnyAsync(x =>
                x.DirectoryType == directoryType && x.idDirectory == directoryId);
        }

        public async Task<List<DictionaryItem<string>>> GetIncidentCriticalityDictionary()
        {
            return await _context.IncidentCriticality
                .Select(x => new DictionaryItem<string>()
                {
                    Key = x.Id,
                    Value = x.Criticality
                }).ToListAsync();
        }

        public async Task<List<DictionaryDataItem<string, string>>> GetEquipmentLogSeverity()
        {
            return await _context.EquipmentLogSeverity
                .Select(x => new DictionaryDataItem<string, string>()
                {
                    Key = x.Id,
                    Value = x.Title,
                    Data = x.Synonyms
                }).ToListAsync();
        }

        public async Task<PaginationModel<EquipmentLogSeveritySynonym>> FindEquipmentLogSeverities(EquipmentLogSeverityFilter filter)
        {
            var q = filter.Query?.Trim();
            var synonym = filter.Synonym?.Trim();

            var query = _context.EquipmentLogSeverity.AsQueryable()
                .Where(x => x.Synonyms != null);

            if (string.IsNullOrEmpty(q) == false)
            {
                query = query.Where(x => x.Title.Contains(q) || x.Synonyms.Contains(q));
            }

            if (!string.IsNullOrEmpty(synonym))
            {
                query = query.Where(x => x.Synonyms.Contains(synonym));
            }

            if (filter.SeverityId.HasValue)
            {
                query = query.Where(x => x.Id == filter.SeverityId);
            }

            var severitiesQuery = (await query.ToListAsync())
                .SelectMany(x => x.Synonyms.Split(',', StringSplitOptions.RemoveEmptyEntries)
                                    .Select(s => new EquipmentLogSeveritySynonym()
                                    {
                                        Synonym = s,
                                        SeverityTitle = x.Title,
                                        SeverityId = x.Id
                                    }));
            Func<EquipmentLogSeveritySynonym, object> order;
            switch (filter.SortColumn)
            {
                case nameof(EquipmentLogSeveritySynonym.Synonym):
                    order = x => x.Synonym;
                    break;
                case nameof(EquipmentLogSeveritySynonym.SeverityTitle):
                    order = x => x.SeverityTitle;
                    break;
                default:
                    order = x => x.SeverityId;
                    break;
            }

            List<EquipmentLogSeveritySynonym> severities;
            if (filter.SortDirection == Direction.Asc)
                severities = severitiesQuery.OrderBy(order).ToList();
            else
                severities = severitiesQuery.OrderByDescending(order).ToList();

            return new PaginationModel<EquipmentLogSeveritySynonym>()
            {
                Items = severities.Skip(filter.Skip).Take(filter.ItemsPerPage),
                Total = severities.Count
            };
        }

        public async Task<EquipmentLogSeveritySynonym> Store(SeveritySynonymModel model)
        {
            if (model.NewSeverityId <= 0)
				throw new ArgumentException("NewSeverityId is required", nameof(model.NewSeverityId));

            if (string.IsNullOrEmpty(model.NewSynonym))
				throw new ArgumentException("NewSynonym is required", nameof(model.NewSynonym));

            if (model.OldSeverityId.HasValue && string.IsNullOrEmpty(model.OldSynonym))
				throw new ArgumentException("OldSynonym is required", nameof(model.OldSynonym));

            if (model.OldSeverityId.HasValue)
            {
                var equipmentLogSeverity = await _context.EquipmentLogSeverity
                    .AsNoTracking()
                    .Where(x => x.Id == model.OldSeverityId)
                    .FirstAsync();

                if (model.OldSeverityId == model.NewSeverityId && model.NewSynonym == model.OldSynonym)
                {
                    return new EquipmentLogSeveritySynonym()
                    {
                        SeverityId = model.NewSeverityId,
                        Synonym = model.NewSynonym,
                        SeverityTitle = equipmentLogSeverity.Title
                    };
                }
                var synonyms = equipmentLogSeverity
                    .Synonyms.Split(",", StringSplitOptions.RemoveEmptyEntries)
                    .Where(x => !string.Equals(x, model.OldSynonym))
                    .ToList();

                EquipmentLogSeveritySynonym result;
                if (model.OldSeverityId == model.NewSeverityId)
                {
                    if (synonyms.Contains(model.NewSynonym))
                    {
                        throw new ArgumentException($"Значение '{model.NewSynonym}' уже существует");
                    }

                    synonyms.Add(model.NewSynonym);
                    result = new EquipmentLogSeveritySynonym()
                    {
                        SeverityId = equipmentLogSeverity.Id,
                        Synonym = model.NewSynonym,
                        SeverityTitle = equipmentLogSeverity.Title
                    };
                }
                else
                {
                    result = await AddNewSeveritySynonym(model);
                }

                equipmentLogSeverity.Synonyms = string.Join(",", synonyms);
                _context.EquipmentLogSeverity.Update(equipmentLogSeverity);
                await _context.SaveChangesAsync();
                return result;
            }

            return await AddNewSeveritySynonym(model);
        }

        private async Task<EquipmentLogSeveritySynonym> AddNewSeveritySynonym(SeveritySynonymModel model)
        {
            var allSeverities = await _context.EquipmentLogSeverity.ToListAsync();

            var allSynonyms = allSeverities.Where(x => !string.IsNullOrEmpty(x.Synonyms))
                .SelectMany(x => x.Synonyms.Split(",", StringSplitOptions.RemoveEmptyEntries))
                .ToList();
            if (allSynonyms.Contains(model.NewSynonym))
            {
                throw new ArgumentException($"Значение '{model.NewSynonym}' уже существует");
            }

            var severity = await _context.EquipmentLogSeverity.SingleAsync(x => x.Id == model.NewSeverityId);
            List<string> synonyms;
            if (!string.IsNullOrEmpty(severity.Synonyms))
            {
                synonyms = severity.Synonyms.Split(",", StringSplitOptions.RemoveEmptyEntries).ToList();
            }
            else
            {
                synonyms = new List<string>();
            }
            synonyms.Add(model.NewSynonym);
            severity.Synonyms = string.Join(",", synonyms);
            _context.EquipmentLogSeverity.Update(severity);
            await _context.SaveChangesAsync();
            return new EquipmentLogSeveritySynonym()
            {
                SeverityId = severity.Id,
                Synonym = model.NewSynonym,
                SeverityTitle = severity.Title
            };
        }

        public async Task<ServiceActionResult> RemoveSeveritySynonym(EquipmentLogSeveritySynonym model)
        {
            var severity = await _context.EquipmentLogSeverity.FindAsync(model.SeverityId);
            if (severity != null)
            {
                var newSynonyms = severity.Synonyms.Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Where(x => !string.Equals(x, model.Synonym));
                severity.Synonyms = string.Join(",", newSynonyms);

                _context.EquipmentLogSeverity.Update(severity);
                await _context.SaveChangesAsync();
            }
            return new ServiceActionResult() { Success = true };
        }

        public async Task<DictionaryItem<int, string>> Store(EquipmentLogSeverity model)
        {
            if (string.IsNullOrEmpty(model.Title))
            {
				throw new ArgumentException("Title is required", nameof(model.Title));
            }

            var severity = await _context.EquipmentLogSeverity.FirstOrDefaultAsync(x => x.Title == model.Title);
            if (severity != null)
            {
                throw new ConstraintException($"Обозначение {model.Title} уже существует");
            }

            severity = new EquipmentLogSeverity()
            {
                Title = model.Title,
                Synonyms = ""
            };
            _context.EquipmentLogSeverity.Add(severity);
            await _context.SaveChangesAsync();

            return new DictionaryItem<int, string>(severity.Id, severity.Title);


        }

    }
}
