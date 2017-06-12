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
        /// ���ɲ�������
        /// </summary>
        /// <param name="paramNames">��������</param>
        /// <param name="paramValues">����ֵ</param>
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
        /// ������ݷ���
        /// </summary>
        /// <param name="procName">��������</param>
        /// <param name="values">����ֵ</param>
        /// <returns>����Ӽ�¼��IDֵ����Ϊ��1�����ʧ��</returns>
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
        /// �������ݷ������������º�ɾ����
        /// </summary>
        /// <param name="procName">��������</param>
        /// <param name="values">����ֵ</param>
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
        /// ִ��SQL���
        /// </summary>
        /// <param name="sql">SQL���</param>
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
        /// ��ȡ��ѯ����
        /// </summary>
        /// <param name="procName">��������</param>
        /// <param name="values">����ֵ</param>
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
