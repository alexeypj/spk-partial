using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq.Expressions;
using Newtonsoft.Json;
using sopka.Models.ContextModels;

namespace sopka.Models
{
    public class UserConnectionContract
    {
        public void Intern()
        {
            ConnectionId = !string.IsNullOrEmpty(ConnectionId) ? String.Intern(ConnectionId) : ConnectionId;
            Ip = !string.IsNullOrEmpty(Ip) ? String.Intern(Ip) : Ip;
        }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string ConnectionId { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string UserId { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public DateTimeOffset LastAccess { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Ip { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public bool IsConnected { get; set; }
        #region IBulkInsert
        public object GetColumnValue(int columnIndex)
        {
            switch (columnIndex)
            {
                case 0: return ConnectionId;
                case 1: return UserId;
                case 2: return LastAccess;
                case 3: return Ip;
                case 4: return IsConnected;
                default:
                    throw new Exception("Unknown column index " + columnIndex);
            }
        }

        public int FieldCount => 7;
        #endregion

        #region SelectExpression
        public static Expression<Func<UserConnection, UserConnectionContract>> SelectExpression =
            obj => new UserConnectionContract
            {
                ConnectionId = obj.ConnectionId,
                UserId = obj.UserId,
                LastAccess = obj.LastAccess,
                Ip = obj.Ip,
                IsConnected = obj.IsConnected,
            };
        public static Func<UserConnection, UserConnectionContract> SelectExpressionCompiled = SelectExpression.Compile();
        #endregion

        public UserConnectionContract Copy()
        {
            return new UserConnectionContract
            {
                ConnectionId = ConnectionId,
                UserId = UserId,
                LastAccess = LastAccess,
                Ip = Ip,
                IsConnected = IsConnected,
            };
        }

        public int GetDataSize()
        {
            return 61 //all column name length sum
                + (ConnectionId != null ? ConnectionId.Length : 0) //ConnectionId
                + 4 //UserId
                + 33 //LastAccess
                + (Ip != null ? Ip.Length : 0) //Ip
                + (IsConnected ? 4 : 5) //IsConnected
            ;
        }

        #region Insert, Update, Select
        public static string GetSelectColumns()
        {
            return "[ConnectionId],[UserId],[LastAccess],[Ip],[UserOrgInfo],[UserOrgId],[IsConnected]";
        }

        public static string GetSelectColumns(string tableAlias)
        {
            return String.Format("{0}.[ConnectionId],{0}.[UserId],{0}.[LastAccess],{0}.[Ip],{0}.[UserOrgInfo],{0}.[UserOrgId],{0}.[IsConnected]", tableAlias);
        }

        public static string GetSelectColumnsNoData(string tableAlias)
        {
            return String.Format("{0}.[ConnectionId],{0}.[UserId],{0}.[LastAccess],{0}.[Ip],{0}.[UserOrgInfo],{0}.[UserOrgId],{0}.[IsConnected]", tableAlias);
        }

        public static string GetInsertSql(string idx, string tableAlias = null)
        {
            return $@"INSERT INTO {(tableAlias ?? "UserConnections")}(ConnectionId,UserId,LastAccess,Ip,IsConnected) VALUES(@ConnectionId_{idx},@UserId_{idx},@LastAccess_{idx},@Ip_{idx},@IsConnected_{idx})";
        }

        public static string GetUpdateSql(string idx)
        {
            return $@"UPDATE [UserConnections] SET [ConnectionId]=@ConnectionId_{idx},[UserId]=@UserId_{idx},[LastAccess]=@LastAccess_{idx},[Ip]=@Ip_{idx},[UserOrgInfo]=@UserOrgInfo_{idx},[UserOrgId]=@UserOrgId_{idx},[IsConnected]=@IsConnected_{idx} WHERE Id=@Id_{idx}";
        }

        public static string GetSyncInsertSql(string idx)
        {
            return $@"INSERT INTO [UserConnections] VALUES(@ConnectionId_{idx},@UserId_{idx},@LastAccess_{idx},@Ip_{idx},@UserOrgInfo_{idx},@UserOrgId_{idx},@IsConnected_{idx})";
        }

        public static string GetSyncUpdateSql(string idx)
        {
            return $@"UPDATE [UserConnections] SET [ConnectionId]=@ConnectionId_{idx},[UserId]=@UserId_{idx},[LastAccess]=@LastAccess_{idx},[Ip]=@Ip_{idx},[UserOrgInfo]=@UserOrgInfo_{idx},[UserOrgId]=@UserOrgId_{idx},[IsConnected]=@IsConnected_{idx} WHERE Id=@Id_{idx}";
        }

        public static string GetMergeSql(string sourceTable, bool insert, bool update, string destTable = "UserConnections")
        {
            return $@"MERGE [{destTable}] AS t  
USING {sourceTable} AS s
ON (t.[ConnectionId] = s.[ConnectionId])
{(update ? $@"WHEN MATCHED THEN   
	UPDATE SET [UserId]=s.[UserId],[LastAccess]=s.[LastAccess],[Ip]=s.[Ip],[IsConnected]=s.[IsConnected]" : "")}
{(insert ? $@"WHEN NOT MATCHED THEN  
	INSERT ([ConnectionId],[UserId],[LastAccess],[Ip],[IsConnected])  
	VALUES (s.[ConnectionId],s.[UserId],s.[LastAccess],s.[Ip],s.[IsConnected])" : "")};";
        }

        public static UserConnectionContract CreateFrom(SqlDataReader rdr)
        {
            return new UserConnectionContract
            {
                ConnectionId = (string)rdr.GetValue(0),
                UserId = (string)rdr.GetValue(1),
                LastAccess = (DateTimeOffset)rdr.GetValue(2),
                Ip = rdr.GetValue(3) as string,
                IsConnected = (bool)rdr.GetValue(6)
            };
        }

        public static UserConnectionContract CreateFromNoData(SqlDataReader rdr)
        {
            return new UserConnectionContract
            {
                ConnectionId = (string)rdr.GetValue(0),
                UserId = (string)rdr.GetValue(1),
                LastAccess = (DateTimeOffset)rdr.GetValue(2),
                Ip = rdr.GetValue(3) as string,
                IsConnected = (bool)rdr.GetValue(6)
            };
        }

        public static IEnumerable<UserConnectionContract> CreateListFrom(SqlDataReader rdr)
        {
            while (rdr.Read())
            {
                yield return new UserConnectionContract
                {
                    ConnectionId = (string)rdr.GetValue(0),
                    UserId = (string)rdr.GetValue(1),
                    LastAccess = (DateTimeOffset)rdr.GetValue(2),
                    Ip = rdr.GetValue(3) as string,
                    IsConnected = (bool)rdr.GetValue(6)
                };
            }
        }

        public static IEnumerable<UserConnectionContract> CreateRankedListFrom(SqlDataReader rdr)
        {
            while (rdr.Read())
            {
                yield return new UserConnectionContract
                {
                    ConnectionId = (string)rdr.GetValue(0),
                    UserId = (string)rdr.GetValue(1),
                    LastAccess = (DateTimeOffset)rdr.GetValue(2),
                    Ip = rdr.GetValue(3) as string,
                    IsConnected = (bool)rdr.GetValue(6)
                };
            }
        }

        public const SqlDbType ConnectionId_Type = SqlDbType.VarChar;
        public const SqlDbType UserId_Type = SqlDbType.Int;
        public const SqlDbType LastAccess_Type = SqlDbType.DateTimeOffset;
        public const SqlDbType Ip_Type = SqlDbType.VarChar;
        public const SqlDbType UserOrgInfo_Type = SqlDbType.NVarChar;
        public const SqlDbType UserOrgId_Type = SqlDbType.Int;
        public const SqlDbType IsConnected_Type = SqlDbType.Bit;
        #endregion
    }
}