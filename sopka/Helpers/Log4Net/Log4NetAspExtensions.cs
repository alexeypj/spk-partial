using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using Infrastructure.Log4Net;
using log4net;
using log4net.Appender;
using log4net.Core;
using log4net.Layout;
using log4net.Repository.Hierarchy;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace sopka.Helpers.Log4Net
{
	/// <summary>
	/// Вспомогательный класс для логирования Log4Net
	/// </summary>
	public static class Log4NetAspExtensions
	{
        /// <summary>
        /// Метод выполняет конфигурацию логгера
        /// </summary>
        /// <param name="connectionString">Строка подключения к БД</param>
        /// <param name="section">Секция с параметрами логера</param>
        public static void ConfigureLog4Net(string connectionString, IConfigurationSection section, IHostingEnvironment environment)
        {
            var repositoryAssembly = System.Reflection.Assembly.GetCallingAssembly();
            var hierarchy = (Hierarchy)LogManager.GetRepository(repositoryAssembly);

            var appender = new SqlAdoNetAppender
            {
                BufferSize = 1,
                ConnectionString = connectionString,
                CommandText = @"INSERT INTO [dbo].[Log] ([Date], [Thread], [Level], [Logger], [Message], [Exception]) VALUES (SYSDATETIME(), @thread, @log_level, @logger, @message, @exception)"
            };


            appender.AddParameter(new AdoNetAppenderParameter()
            {
                ParameterName = "@thread",
                DbType = System.Data.DbType.String,
                Size = 255,
                Layout = new RawLayoutConverter().ConvertFrom(new PatternLayout("%thread")) as IRawLayout
            });
            appender.AddParameter(new AdoNetAppenderParameter()
            {
                ParameterName = "@log_level",
                DbType = System.Data.DbType.String,
                Size = 50,
                Layout = new RawLayoutConverter().ConvertFrom(new PatternLayout("%level")) as IRawLayout
            });
            appender.AddParameter(new AdoNetAppenderParameter()
            {
                ParameterName = "@logger",
                DbType = System.Data.DbType.String,
                Size = 255,
                Layout = new RawLayoutConverter().ConvertFrom(new PatternLayout("[%property{log4net:HostName}]%logger")) as IRawLayout
            });
            appender.AddParameter(new AdoNetAppenderParameter()
            {
                ParameterName = "@message",
                DbType = System.Data.DbType.String,
                Size = 4000,
                Layout = new RawLayoutConverter().ConvertFrom(new PatternLayout("%message")) as IRawLayout
            });
            appender.AddParameter(new AdoNetAppenderParameter()
            {
                ParameterName = "@exception",
                DbType = System.Data.DbType.String,
                Size = 2000,
                Layout = new RawLayoutConverter().ConvertFrom(new ExceptionLayout()) as IRawLayout
            });

            appender.ActivateOptions();

            //конфигурация резервного логера в файл на случай недоступности бд
            var reserveLoggerRepositoryName = "sopka-reserve-log-repository";
            var reserveHierarchy = (Hierarchy)LogManager.CreateRepository(reserveLoggerRepositoryName);
            var fileLogAppender = CreateFileLogAppender(environment, section["FileLogDirectory"]);
            reserveHierarchy.Root.AddAppender(fileLogAppender);
            reserveHierarchy.Root.Level = Level.Debug;
            reserveHierarchy.Configured = true;
            appender.ReservedLoggerRepository = reserveLoggerRepositoryName;

            ConfigureFilters(section, hierarchy, appender);
            
            var hierarchy2 = (Hierarchy)LogManager.GetRepository(repositoryAssembly);
        }

        /// <summary>
        /// Настройка log4net дла логирования в файл
        /// </summary>
        /// <param name="environment"></param>
        /// <param name="logDir">Путь к папке в которой будут храниться логи</param>
        private static IAppender CreateFileLogAppender(IHostingEnvironment environment, string logDir)
        {
            RollingFileAppender appender = new
                RollingFileAppender();

            appender.File = Path.Combine(environment.ContentRootPath, logDir);
            appender.AppendToFile = true;
            appender.RollingStyle = RollingFileAppender.RollingMode.Date;
            appender.DatePattern = "yyyy-MM-dd'.log'";
            appender.StaticLogFileName = false;

            PatternLayout layout = new PatternLayout();
            layout.ConversionPattern = "%date|%-5level|%logger|%message %exception%newline";
            layout.ActivateOptions();

            appender.Layout = layout;
            appender.ActivateOptions();

            return appender;
        }


        /// <summary>
        /// Метод для конвертации Core степеней логирования в Log4Net степень
        /// </summary>
        /// <param name="logLevel">Степень логирования</param>
        /// <returns></returns>
        private static Level Net2Log4NetLevel(string logLevel)
        {
            switch (logLevel.ToLower(CultureInfo.InvariantCulture))
            {
                case "none":
                    return Level.Off;
                case "debug":
                    return Level.Debug;
                case "information":
                    return Level.Info;
                case "warning":
                    return Level.Warn;
                case "error":
                    return Level.Error;
                case "fatal":
                    return Level.Fatal;
                default:
                    return Level.Debug;
            }
        }

        /// <summary>
        /// Метод выполняет конфигурацию
        /// </summary>
        /// <param name="configSection">Секция с параметрами логера</param>
        /// <param name="hierarchy">Иерархия организации логеров</param>
        /// <param name="appenders">Провайдер сохранения логов в БД</param>
        private static void ConfigureFilters(IConfigurationSection configSection, Hierarchy hierarchy, IAppender appender)
        {
            

            string defaultLogLevel = configSection.GetValue<string>("LogLevel:Default");
            hierarchy.Root.AddAppender(appender);
            hierarchy.Root.Level = Net2Log4NetLevel(defaultLogLevel);

            var levels = configSection.GetSection("LogLevel")
                                    .GetChildren()
                                    .Where(s => s.Key != "Default")
                                    .Select(s => (@namespace: s.Key, level: s.Value));

            foreach (var tuple in levels)
            {
                if (hierarchy.GetLogger(tuple.@namespace) is Logger logger)
                {
                    logger.Additivity = true;
                    logger.Level = Net2Log4NetLevel(tuple.level);
                }
            }

            hierarchy.Configured = true;
        }

        /// <summary>
        /// Добавление провайдера к фабрике
        /// </summary>
        /// <param name="loggerFactory"></param>
        public static Microsoft.Extensions.Logging.ILoggerFactory AddLog4Net(this Microsoft.Extensions.Logging.ILoggerFactory loggerFactory)
		{
			loggerFactory.AddProvider(new Log4NetProvider());
			return loggerFactory;
		}

        public static ILoggingBuilder AddLog4Net(this ILoggingBuilder builder)
        {
            builder.Services.AddSingleton<ILoggerProvider>((ILoggerProvider)new Log4NetProvider());
            return builder;
        }

    }
}