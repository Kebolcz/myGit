using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.DirectoryServices;
using System.Configuration;

namespace WechatApp
{
    public class ADhelper
    {
        // Methods
        private ADhelper()
        {
        }

        /// <summary>
        /// 检查AD用户是否正确
        /// </summary>
        /// <param name="argDomainName"></param>
        /// <param name="argAccountName"></param>
        /// <param name="argPass"></param>
        /// <param name="msg"></param>
        /// <returns></returns>
        public static bool CheckUserADPass(string argDomainName, string argAccountName, string argPass)
        {
            bool flag = false;
           // msg = "OK";
            DirectoryEntry entry = new DirectoryEntry(GetLDAPPathString(argDomainName), argAccountName, argPass, AuthenticationTypes.Secure);
            try
            {
                string temp = entry.Name;
                flag = true;
            }
            catch (DirectoryServicesCOMException ex)
            {
                if (ex.ErrorCode == -2147023570)
                {
                    //msg = "PASSWORD ERROR";
                    return flag;
                }
                //msg = ex.Message;
            }
            return flag;
        }

        /// <summary>
        /// 获取LDAP路径
        /// </summary>
        /// <param name="argDomain"></param>
        /// <returns></returns>
        public static string GetLDAPPathString(string argDomain)
        {
            try
            {
                string domainName = argDomain.ToLower();
                if ((domainName != null) && (domainName == "casco"))
                {
                    return ConfigurationManager.AppSettings["CascoLDAPPath"];
                }
                return "";
            }
            catch
            {
                return "";
            }
        }

    }
}
