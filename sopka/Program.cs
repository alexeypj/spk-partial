using System;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using sopka.Helpers.Log4Net;

namespace sopka
{
    public class Program
    {
        public static void Main(string[] args)
        {
            InitLog();
            try
            {
                CreateWebHostBuilder(args).ConfigureLogging((hostingContext, logging) =>
                {
                    var dbConnection = hostingContext.Configuration.GetConnectionString("DefaultConnection");
                    var loggingSection = hostingContext.Configuration.GetSection("Logging");
                    Log4NetAspExtensions.ConfigureLog4Net(dbConnection, loggingSection, hostingContext.HostingEnvironment);

                    logging.AddConfiguration(hostingContext.Configuration.GetSection("Logging"));
                    logging.AddConsole();
                    logging.AddDebug();
                    logging.AddEventSourceLogger();
                    logging.AddLog4Net();
                }).Build().Run();
            }
            catch (Exception error)
            {
                WriteLogError(error.Message + Environment.NewLine + error.StackTrace);
            }
        }
        
        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args).UseStartup<Startup>();

        public static string LogName = "SOPKA";

        public static void InitLog()
        {
            try
            {   
                if (!EventLog.SourceExists(LogName))
                    EventLog.CreateEventSource(LogName, "Application");
            }
            catch (Exception error)
            {
                Console.WriteLine(error.Message + Environment.NewLine + error.StackTrace);
            }
        }

        public static void WriteLogInfo(string message)
        {
            WriteLog(message, EventLogEntryType.Information);
        }

        public static void WriteLogError(string message)
        {
            WriteLog(message, EventLogEntryType.Error);
        }

        public static void WriteLog(string message, EventLogEntryType type)
        {
            try
            {
                using (var log = new EventLog())
                {
                    log.Source = LogName;
                    log.WriteEntry(message, type);
                }
            }
            catch (Exception error)
            {
                Console.WriteLine(error.Message + Environment.NewLine + error.StackTrace);
            }
        }



    }
}
