using System;
using System.Collections.Generic;
using System.Text;
using System.Data;
using System.Data.SqlClient;

namespace WechatApp.Code
{
    public class BaseCommand : DBConnection
    {
        /// <summary>
        /// 生成参数数组
        /// </summary>
        /// <param name="paramNames">参数名称</param>
        /// <param name="paramValues">参数值</param>
        /// <returns></returns>
        internal SqlParameter[] BuildSqlParameters(string[] paramNames, object[] paramValues)
        {
            SqlParameter[] result = new SqlParameter[paramNames.Length];

            for (int i = 0; i < paramNames.Length; i++)
            {
                result[i] = new SqlParameter(paramNames[i], paramValues[i]);
            }

            return result;
        }
        /// <summary>
        /// 添加数据方法
        /// </summary>
        /// <param name="procName">过程名称</param>
        /// <param name="values">参数值</param>
        /// <returns>新添加记录的ID值，如为－1则添加失败</returns>
        internal Int64 InsertQuery(string procName, params SqlParameter[] values)
        {
            int result = 0;

            try
            {
                Connect();
                sqlCommand.CommandText = procName;
                sqlCommand.CommandType = CommandType.StoredProcedure;
                sqlCommand.Parameters.AddRange(values);
                sqlCommand.Parameters.Add("@ID",SqlDbType.BigInt);
                sqlCommand.Parameters["@ID"].Direction = ParameterDirection.Output;

                result = sqlCommand.ExecuteNonQuery();

                //return result > 0 ? Convert.ToInt64(sqlCommand.Parameters["@ID"].Value) : -1;
                return Convert.ToInt64(sqlCommand.Parameters["@ID"].Value);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                this.Disconnect();
            }
        }
        /// <summary>
        /// 更新数据方法（包括更新和删除）
        /// </summary>
        /// <param name="procName">过程名称</param>
        /// <param name="values">参数值</param>
        /// <returns></returns>
        internal bool UpdateQuery(string procName, params SqlParameter[] values)
        {
            int result = 0;

            try
            {
                Connect();
                sqlCommand.CommandText = procName;
                sqlCommand.CommandType = CommandType.StoredProcedure;
                sqlCommand.Parameters.AddRange(values);

                result = sqlCommand.ExecuteNonQuery();

                return result > 0 ? true : false;
            }
            catch(Exception ex)
            {
                throw ex;
            }
            finally
            {
                this.Disconnect();
            }
        }

        /// <summary>
        /// 执行SQL语句
        /// </summary>
        /// <param name="sql">SQL语句</param>
        /// <returns></returns>
        internal bool ExecuteSQLQuery(string sql)
        {
            int result = -1;

            try
            {
                Connect();
                sqlCommand.CommandText = sql;
                sqlCommand.CommandType = CommandType.Text;

                result = sqlCommand.ExecuteNonQuery();

                return result > 0 ? true : false;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                this.Disconnect();
            }
        }

        /// <summary>
        /// 获取查询数据
        /// </summary>
        /// <param name="procName">过程名称</param>
        /// <param name="values">参数值</param>
        /// <returns></returns>
        internal DataSet GetData(string procName,params SqlParameter[] values)
        {

            DataSet dataSet = null;
            try
            {
                Connect();
                sqlCommand.Parameters.Clear();
                sqlCommand.CommandText = procName;
                sqlCommand.CommandType = CommandType.StoredProcedure;
                sqlCommand.Parameters.AddRange(values);

                SqlDataAdapter sqlDataAdapter = new SqlDataAdapter(sqlCommand);
                dataSet = new DataSet();
                sqlDataAdapter.Fill(dataSet);

            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                this.Disconnect();

            }
            return dataSet;
        }

        internal object GetDataItem(string procName, params SqlParameter[] values)
        {
            object obj = null;
            try
            {
                Connect();
                sqlCommand.Parameters.Clear();
                sqlCommand.CommandText = procName;
                sqlCommand.CommandType = CommandType.StoredProcedure;
                sqlCommand.Parameters.AddRange(values);

                obj = sqlCommand.ExecuteScalar();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                this.Disconnect();

            }
            return obj;
        }
    }
}
