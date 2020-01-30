using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using sopka.Models.ContextModels;
using sopka.Models.ContextModels.Chat;
using sopka.Models.ContextModels.Directories;
using sopka.Models.EquipmentLogs;
using sopka.Models.EquipmentLogs.Rules;

namespace sopka.Models
{
	public class SopkaDbContext : IdentityDbContext<AppUser, AppRole, string, IdentityUserClaim<string>,
		AppUserRole, IdentityUserLogin<string>,
		IdentityRoleClaim<string>, IdentityUserToken<string>>
    {
		/// <summary>
		/// Объекты
		/// </summary>
		public DbSet<ObjectEntry> Objects { get; set; }

		/// <summary>
		/// Оборудование
		/// </summary>
		public DbSet<Equipment> Equipment { get; set; }

		/// <summary>
		/// Устройства
		/// </summary>
		public DbSet<Device> Devices { get; set; }

		/// <summary>
		/// Жесткие диски
		/// </summary>
		public DbSet<HDD> HDD { get; set; }

		/// <summary>
		/// Память
		/// </summary>
		public DbSet<Memory> Memory { get; set; }

		/// <summary>
		/// Операционные системы
		/// </summary>
		public DbSet<OperationSystem> OperationSystems { get; set; }

		/// <summary>
		/// Прикладное ПО
		/// </summary>
		public DbSet<Software> Software { get; set; }

		public DbSet<NetworkAdapter> NetworkAdapters { get; set; }

		public DbSet<FilePart> Files { get; set; }

		#region Инциденты

		/// <summary>
		/// Инциденты
		/// </summary>
		public DbSet<Incident> Incidents { get; set; }
		
		/// <summary>
		/// Статусы инцидентов
		/// </summary>
		public DbSet<IncidentStatus> IncidentStatuses { get; set; }

		/// <summary>
		/// Переходы между статусами инцидентов
		/// </summary>
		public DbSet<IncidentStatusTransition> IncidentStatusTransitions { get; set; }

		/// <summary>
		/// Связи между инцидентами
		/// </summary>
		public DbSet<IncidentRelation> IncidentRelations { get; set; }

		public DbSet<IncidentStatusHistory> IncidentStatusHistory { get; set; }

		public DbSet<IncidentFieldHistory> IncidentFieldHistory { get; set; }

        public DbSet<IncidentArticle> IncidentArticles { get; set; }
        public DbSet<IncidentCriticality> IncidentCriticality { get; set; }

		#endregion

		#region База знаний
		public DbSet<ArticleFolder> ArticleFolders { get; set; }

		public DbSet<Article> Articles { get; set; }

		public DbSet<ArticleTag> ArticleTags { get; set; }
		#endregion

		#region Справочники

		public DbSet<AttackDirectory> AttackDirectory { get; set; }
		public DbSet<BranchDirectory> BranchDirectory { get; set; }
		public DbSet<CPUDirectory> CpuDirectory { get; set; }
		public DbSet<EquipmentDirectory> EquipmentDirectory { get; set; }
		public DbSet<HDDDirectory> HddDirectory { get; set; }
		public DbSet<NetworkAdapterDirectory> NetworkAdapterDirectory { get; set; }
		public DbSet<ObjectDirectory> ObjectDirectory { get; set; }
		public DbSet<OSDirectory> OsDirectory { get; set; }
		public DbSet<PlatformDirectory> PlatformDirectory { get; set; }
		public DbSet<RAIDDirectory> RaidDirectory { get; set; }
		public DbSet<RAMDirectory> RamDirectory { get; set; }
		public DbSet<SoftDirectory> SoftDirectory { get; set; }

		public DbSet<TagsToDirectory> TagsToDirectory { get; set; }

		#endregion

		#region Identity
		public DbSet<AppUserRole> AppUserRoles { get; set; }

        #endregion

        #region Журналы оборудования

        /// <summary>
        /// Правила обработки журналов
        /// </summary>
        public DbSet<Rule> EquipmentLogRules { get; set; }

        /// <summary>
        /// Условия правил обработки журналов
        /// </summary>
        public DbSet<Condition> EquipmentLogRuleConditions { get; set; }

        public DbSet<EquipmentLog> EquipmentLogs { get; set; }

        public DbSet<EquipmentLogSeverity> EquipmentLogSeverity { get; set; }

        public DbSet<EquipmentLogRuleState> EquipmentLogRuleStates { get; set; }

        #endregion

        #region Уязвимости
        /// <summary>
        /// Уязвимости
        /// </summary>
        public DbSet<Vulnerability> Vulnerabilities { get; set; }

        public DbSet<VulnerabilityFolder> VulnerabilityFolders { get; set; }

        public DbSet<VulnerabilityComment> VulnerabilityComments { get; set; }

        #endregion

        public DbSet<LogAction> LogAction { get; set; }

        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<ConversationMessage> ConversationMessages { get; set; }
        public DbSet<ConversationUser> ConversationUsers { get; set; }
        public DbSet<ConversationMessageStatus> ConversationMessageStatuses { get; set; }
        public DbSet<UserConnection> UserConnections { get; set; }

        public DbSet<Company> Companies { get; set; }

        public DbSet<Tariff> Tariffs { get; set; }

        public DbSet<Invoice> Invoices { get; set; }

        public DbSet<Balance> Balances { get; set; }

        public DbSet<CompanyTariff> CompanyTariffs { get; set; }

		public SopkaDbContext(string connectionString) : base(GetDbContextOptions(connectionString))
		{
		}

		public SopkaDbContext(DbContextOptions<SopkaDbContext> options) : base(options)
		{
		}

		public static DbContextOptions<SopkaDbContext> GetDbContextOptions(string connectionString, int commandTimeout = 600)
		{
			var options = new DbContextOptionsBuilder<SopkaDbContext>();
			options.UseSqlServer(connectionString, opt =>
			{
				opt.CommandTimeout(commandTimeout);
			});
			return options.Options;
		}

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
            base.OnModelCreating(modelBuilder);

			modelBuilder.Entity<ObjectEntry>()
				.HasMany(x => x.Equipment)
				.WithOne(x => x.ObjectEntry)
				.HasForeignKey(x => x.IdObject);
				
			
			modelBuilder.Entity<ObjectEntry>()
				.ToTable("Objects");

			modelBuilder.Entity<Equipment>()
				.HasMany(x => x.Devices)
				.WithOne(x => x.Equipment)
				.HasForeignKey(x => x.IdEquipment)
				.OnDelete(DeleteBehavior.Cascade);

			modelBuilder.Entity<Device>()
				.HasMany(x => x.HDD)
				.WithOne(x => x.Device)
				.HasForeignKey(x => x.IdDevice);

			modelBuilder.Entity<Device>()
				.HasMany(x => x.Memory)
				.WithOne(x => x.Device)
				.HasForeignKey(x => x.IdDevice);

			modelBuilder.Entity<Device>()
				.HasMany(x => x.OperationSystems)
				.WithOne(x => x.Device)
				.HasForeignKey(x => x.IdDevice);

			modelBuilder.Entity<Device>()
				.HasMany(x => x.Software)
				.WithOne(x => x.Device)
				.HasForeignKey(x => x.IdDevice);

			modelBuilder.Entity<Device>()
				.HasOne(x => x.CPU)
				.WithMany(x => x.Devices)
				.HasForeignKey(x => x.IdCPU);

			modelBuilder.Entity<Memory>()
				.HasOne(x => x.RamDirectory)
				.WithMany(x => x.Memory)
				.HasForeignKey(x => x.IdRAMDirectory);

			modelBuilder.Entity<OperationSystem>()
				.HasOne(x => x.OSDirectory)
				.WithMany(x => x.OperationSystems)
				.HasForeignKey(x => x.IdOSDirectory);

			modelBuilder.Entity<Software>()
				.HasOne(x => x.SoftDirectory)
				.WithMany(x => x.Software)
				.HasForeignKey(x => x.IdSoftDirectory);

			modelBuilder.Entity<HDD>()
				.HasOne(x => x.HddDirectory)
				.WithMany(x => x.HDD)
				.HasForeignKey(x => x.IdHDDDirectory);

			modelBuilder.Entity<HDD>()
				.HasOne(x => x.RaidDirectory)
				.WithMany(x => x.HDD)
				.HasForeignKey(x => x.IdRAIDDirectory);

			modelBuilder.Entity<ObjectEntry>()
				.HasOne(x => x.Branch)
				.WithMany(x => x.Objects)
				.HasForeignKey(x => x.IdBranch);

			modelBuilder.Entity<ObjectEntry>()
				.HasOne(x => x.ObjectType)
				.WithMany(x => x.Objects)
				.HasForeignKey(x => x.IdType);

			modelBuilder.Entity<NetworkAdapter>()
				.HasOne(x => x.Device)
				.WithMany(x => x.NetworkAdapters)
				.HasForeignKey(x => x.IdDevice);

			modelBuilder.Entity<NetworkAdapter>()
				.HasOne(x => x.NetworkAdapterDirectory)
				.WithMany(x => x.NetworkAdapters)
				.HasForeignKey(x => x.IdNetworkAdapterDirectory);

            modelBuilder.Entity<Incident>(entity =>
			{
				entity.HasOne(x => x.AttackDirectory)
					.WithMany(x => x.Incidents)
					.HasForeignKey(x => x.AttackType);

				entity.HasOne(x => x.SourceEquipment)
		            .WithMany(x => x.Incidents)
		            .HasForeignKey(x => x.SourceEquipmentId);

				entity.HasOne(x => x.Status)
					.WithMany(x => x.Incidents)
					.HasForeignKey(x => x.IdStatus)
					.IsRequired(false);
			});

            modelBuilder.Entity<IncidentRelation>()
                .HasKey(x => new {x.SourceIncidentId, x.RelatedIncidentId});

            modelBuilder.Entity<IncidentRelation>()
                .HasOne(x => x.SourceIncident)
                .WithMany(x => x.RelatedIncidents)
                .HasForeignKey(x => x.SourceIncidentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<IncidentRelation>()
                .HasOne(x => x.RelatedIncident)
                .WithMany(x => x.RelatedIncidentOf)
                .HasForeignKey(x => x.RelatedIncidentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<IncidentStatus>(entity =>
            {
	            entity.HasMany(x => x.Transitions)
		            .WithOne(x => x.InitialStatus)
		            .HasForeignKey(x => x.InitialStatusId);

	            entity.HasOne(x => x.ResponsibleRole)
		            .WithMany(x => x.Statuses)
		            .HasForeignKey(x => x.Responsible);
            });

			modelBuilder.Entity<IncidentStatusTransition>()
	            .HasKey(x => new {x.InitialStatusId, x.FinalStatusId});

			modelBuilder.Entity<IncidentStatusHistory>(entity =>
			{
				entity.HasOne(x => x.Incident)
					.WithMany(x => x.History)
					.HasForeignKey(x => x.IdIncident);

				entity.HasMany(x => x.FieldHistory)
					.WithOne(x => x.StatusHistory)
					.HasForeignKey(x => x.IdIncidentStatusHistory);
			});

			modelBuilder.Entity<Article>(entity =>
			{
				entity.HasKey(x => x.Id);
				entity.HasOne(x => x.User)
					.WithMany(x => x.Articles)
					.HasForeignKey(x => x.IdCreator)
					.IsRequired();
			});

			modelBuilder.Entity<ArticleFolder>()
				.HasMany(x => x.Articles)
				.WithOne(x => x.Folder)
				.HasForeignKey(x => x.IdFolder);

			modelBuilder.Entity<ArticleTag>(entity =>
			{
				entity.HasKey(x => new {x.IdArticle, x.IdDirectory, x.DirectoryType});
				entity.HasOne(x => x.Article)
					.WithMany(x => x.Tags)
					.HasForeignKey(x => x.IdArticle);
			});

            modelBuilder.Entity<IncidentArticle>(entity =>
            {
                entity.HasKey(x => new {x.ArticleId, x.IncidentId});

                entity.HasOne(x => x.Article)
                    .WithMany(x => x.RelatedIncidents)
                    .HasForeignKey(x => x.ArticleId);

                entity.HasOne(x => x.Incident)
                    .WithMany(x => x.RelatedArticles)
                    .HasForeignKey(x => x.IncidentId);
            });

            modelBuilder.Entity<AttackDirectory>(entity =>
            {
                entity.HasKey(x => x.Id);

                entity.HasOne(x => x.IncidentCriticality)
                    .WithMany(x => x.AttackDirectories)
                    .HasForeignKey(x => x.CriticalityDefault);
            });

            #region Уязвимости

            modelBuilder.Entity<Vulnerability>(entity => { 
                entity.HasOne(x => x.Folder)
                    .WithMany(x => x.Vulnerabilities)
                    .HasForeignKey(x => x.IdFolder);

                entity.HasMany(x => x.Comments)
                    .WithOne(x => x.Vulnerability)
                    .HasForeignKey(x => x.VulnerabilityId);
            });

            modelBuilder.Entity<VulnerabilityComment>()
                .HasOne(x => x.User)
                .WithMany(x => x.VulnerabilityComments)
                .HasForeignKey(x => x.UserId);

            #endregion


            #region Журналы оборудования - Модель

            modelBuilder.Entity<Rule>(entity =>
            {
                entity.HasMany(x => x.Conditions)
                    .WithOne(x => x.Rule)
                    .HasForeignKey(x => x.RuleId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(x => x.Creator)
                    .WithMany(x => x.EquipmentLogRules)
                    .HasForeignKey(x => x.CreatorId);
            });

            modelBuilder.Entity<Condition>(entity =>
            {
                entity.HasOne(x => x.Severity)
                    .WithMany(x => x.EquipmentLogRuleConditions)
                    .HasForeignKey(x => x.SeverityId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(x => x.Equipment)
                    .WithMany(x => x.EquipmentLogRuleConditions)
                    .HasForeignKey(x => x.EquipmentId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            #endregion
            #region Identity
            modelBuilder.Entity<AppUser>(entity =>
            {
                entity.ToTable(name: "Users");
                entity.HasMany(e => e.UserRoles)
	                .WithOne(e => e.User)
	                .HasForeignKey(ur => ur.UserId)
	                .IsRequired();
			});
            modelBuilder.Entity<AppRole>(entity =>
            {
                entity.ToTable(name: "Roles");
                entity.HasMany(e => e.UserRoles)
	                .WithOne(e => e.Role)
	                .HasForeignKey(ur => ur.RoleId)
	                .IsRequired();
			});
          
            modelBuilder.Entity<IdentityRoleClaim<string>>(entity =>
            {
                entity.ToTable(name: "RoleClaims");
            });
            modelBuilder.Entity<IdentityUserClaim<string>>(entity =>
            {
                entity.ToTable(name: "UserClaims");
            });
            modelBuilder.Entity<IdentityUserLogin<string>>(entity =>
            {
                entity.ToTable(name: "UserLogins");
            });
          
            modelBuilder.Entity<IdentityUserToken<string>>(entity =>
            {
                entity.ToTable(name: "UserTokens");
            });

            modelBuilder.Entity<AppUserRole>(userRole =>
            {
	            userRole.HasKey(ur => new { ur.UserId, ur.RoleId });
				userRole.ToTable("UserRoles");
            });
            #endregion

            modelBuilder.Entity<UserConnection>(entity =>
            {
                entity.HasKey(x => x.ConnectionId);
            });

            modelBuilder.Entity<Company>(entity =>
            {
                entity.HasOne(x => x.Balance)
                    .WithOne(x => x.Company)
                    .HasForeignKey<Balance>(x => x.CompanyId);
            });

            modelBuilder.Entity<Company>(entity =>
            {
                entity.HasOne(x => x.CompanyTariff)
                    .WithOne(x => x.Company)
                    .HasForeignKey<CompanyTariff>(x => x.CompanyId);
            });
        }
	}
}
