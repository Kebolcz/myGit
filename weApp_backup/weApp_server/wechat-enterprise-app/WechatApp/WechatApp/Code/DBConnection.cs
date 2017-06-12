using System;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;

namespace WechatApp.Code
{
    /// <summary>
    /// 提供数据访问层的基本操作的封装、实现
    /// </summary>

    public class DBConnection
    {
        private static string _connectString = ConfigurationManager.ConnectionStrings["DBConnection"].ConnectionString;
        private int _connectionCount;
        private SqlConnection _connection;
        protected SqlCommand sqlCommand;

        public DBConnection()
        {
            _connectionCount = 0;
            _connection = null;
            sqlCommand = null;

        }

        protected void Connect()
        {
            try
            {
                if (_connectionCount == 0)
                {
                    _connection = new SqlConnection(_connectString);

                    _connection.Open();

                    try
                    {
                        sqlCommand = _connection.CreateCommand();
                    }
                    catch (Exception e)
                    {
                        _connectionCount++;
                        throw e;
                    }
                }
                _connectionCount++;
            }
            catch (Exception exp)
            {
                Disconnect();
                throw exp;
            }
        }

        protected void Disconnect()
        {
            try
            {
                _connectionCount--;
                if (_connectionCount == 0)
                {
                    _connection.Close();
                }
                if (_connectionCount < 0)
                {
                    _connectionCount = 0;
                }
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}
