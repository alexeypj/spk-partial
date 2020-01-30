using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using JobServer.Collections;
using JobServer.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using sopka.Models;
using sopka.Services.EquipmentLogMatcher;

namespace sopka.Services.EquipmentLogImport
{
    public class EquipmentLogImportService
    {
        private readonly SopkaDbContext _dbContext;
        private readonly EquipmentLogOptions _options;
        private readonly EquipmentLogDataBus _dataBus;

        public EquipmentLogImportService(SopkaDbContext dbContext, IOptions<EquipmentLogOptions> optionsAccessor, EquipmentLogDataBus dataBus)
        {
            _dbContext = dbContext;
            _options = optionsAccessor.Value;
            _dataBus = dataBus;
        }

        public async Task Import(Stream logsStream)
        {
            var logs = await ParseLogs(logsStream);
            await PreProcessLogs(logs);
            await InsertLogs(logs);

            var savedLogs = await _dbContext.EquipmentLogs.AsNoTracking()
                .OrderByDescending(x => x.Id)
                .Take(logs.Count)
                .ToListAsync();
            _dataBus.LogQueue.Add(savedLogs);
        }

        public async Task PreProcessLogs(List<EquipmentLogInfo> logs)
        {
            var synonyms = _dbContext.EquipmentLogSeverity
                .ToDictionary(x => x.Id, x => x.Synonyms?.ToLower().Split(',') ?? new string[0]);

            using (var connection = new SqlConnection(_dbContext.Database.GetDbConnection().ConnectionString))
            {
                var tempTableName = "#EquipmentLogInfoTmp";
                connection.ExecuteNonQuery($"CREATE TABLE {tempTableName} " +
                                           "(TempId uniqueidentifier, EquipmentName nvarchar(150), EquipmentIp nvarchar(17))");
                await InsertLogsToTempTable(tempTableName, logs, connection);

                var result= new Dictionary<Guid, int>(logs.Count);

                (await connection.QueryAsync<(Guid, int)>(@"
                        SELECT t.TempId, e.id
                        FROM [#EquipmentLogInfoTmp] As t
                        JOIN [Equipments] AS e ON t.EquipmentName like e.eName
                        JOIN [Device] AS d ON d.idEquipments = e.id AND d.dIP = t.EquipmentIp"))
                    .ForEach(x => result.TryAdd(x.Item1, x.Item2));

                foreach (var log in logs)
                {
                    if (result.ContainsKey(log.TempId))
                    {
                        log.EquipmentId = result[log.TempId];
                    }

                    var description = log.Description.ToLower();
                    foreach (var severityId in synonyms.Keys)
                    {
                        if (synonyms[severityId].Any(x => description.Contains(x)))
                        {
                            log.SeverityId = severityId;
                            break;
                        }
                    }
                }
            }
        }

        private async Task InsertLogsToTempTable(string tmpTableName, List<EquipmentLogInfo> logs,
            SqlConnection connection)
        {
            var datatable = new DataTable();
            datatable.Columns.Add("TempId", typeof(Guid));
            datatable.Columns.Add("EquipmentName", typeof(string));
            datatable.Columns.Add("EquipmentIp", typeof(string));

            foreach (var log in logs)
            {
                datatable.Rows.Add(log.TempId, log.EquipmentName, log.EquipmentIp);
            }

            using (var sql = new SqlBulkCopy(connection))
            {
                foreach (DataColumn dataColumn in datatable.Columns)
                {
                    sql.ColumnMappings.Add(dataColumn.ColumnName, dataColumn.ColumnName);
                }
                sql.DestinationTableName = tmpTableName;
                sql.BatchSize = _options.BatchSize;
                await sql.WriteToServerAsync(datatable);
            }

        }

        public async Task InsertLogs(List<EquipmentLogInfo> logs)
        {
            var datatable = new DataTable();
            datatable.Columns.Add("Date", typeof(DateTime));
            datatable.Columns.Add("Level", typeof(string));
            datatable.Columns.Add("Description", typeof(string));
            datatable.Columns.Add("Source", typeof(string));
            datatable.Columns.Add("EquipmentId", typeof(int));
            datatable.Columns.Add("SeverityId", typeof(int));

            foreach (var log in logs)
            {
                datatable.Rows.Add(log.Date, log.Level, log.Description, log.Source, log.EquipmentId);
            }

            using (var sql = new SqlBulkCopy(_dbContext.Database.GetDbConnection().ConnectionString))
            {
                foreach (DataColumn dataColumn in datatable.Columns)
                {
                    sql.ColumnMappings.Add(dataColumn.ColumnName, dataColumn.ColumnName);
                }
                sql.DestinationTableName = "EquipmentLogs";
                sql.BatchSize = _options.BatchSize;
                await sql.WriteToServerAsync(datatable);
            }
        }

        private async Task<List<EquipmentLogInfo>> ParseLogs(Stream stream)
        {
            var logs = new List<EquipmentLogInfo>();
            using (var requestBody = stream)
            {
                using (var streamReader = new StreamReader(requestBody, System.Text.Encoding.UTF8)) 
                {
                    using (JsonTextReader reader = new JsonTextReader(streamReader) { SupportMultipleContent = true })
                    {
                        while (await reader.ReadAsync())
                        {
                            if (reader.TokenType != JsonToken.StartObject)
                            {
                                continue;
                            }

                            var jObject = JObject.Load(reader);
                            EquipmentLogInfo log = new EquipmentLogInfo();
                            log.TempId = Guid.NewGuid();

                            ParseField(jObject, nameof(EquipmentLogInfo.Level), token => log.Level = token.Value<string>());
                            ParseField(jObject, nameof(EquipmentLogInfo.Date), token => log.Date = token.Value<DateTime>());
                            ParseField(jObject, nameof(EquipmentLogInfo.Description), token => log.Description = token.Value<string>());
                            ParseField(jObject, nameof(EquipmentLogInfo.Source), token => log.Source = token.Value<string>());
                            ParseField(jObject, nameof(EquipmentLogInfo.EquipmentName), token => log.EquipmentName = token.Value<string>());
                            ParseField(jObject, nameof(EquipmentLogInfo.EquipmentIp), token => log.EquipmentIp = token.Value<string>());

                            logs.Add(log);
                        }
                    }
                }
            }
            return logs;
        }

        private void ParseField(JObject jObject, string destFieldName, Action<JToken> action)
        {
            var srcFieldName = GetFieldName(destFieldName);
            var jToken = jObject[srcFieldName];
            if (jToken != null)
            {
                action(jToken);
            }
        }

        private string GetFieldName(string logFieldName)
        {
            return _options.FieldMapping.ContainsKey(logFieldName)
                ? _options.FieldMapping[logFieldName]
                : logFieldName;
        }
    }
}