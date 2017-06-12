using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Linq;
using WechatApp.Models;

namespace WechatApp.Tools
{
    /// <summary>
    /// 域控工具类
    /// </summary>
    public class LdapUtility
    {
        /// <summary>
        /// 根据工号获得人员的信息（基本信息，部门，直属领导）
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public static AdUser GetUserInfo(string user)
        {
            MWFWebService.MobileWFWebService mwfService = new MWFWebService.MobileWFWebService();
            string userXml = mwfService.GetUserADInfo(user);
            if (string.IsNullOrEmpty(userXml))
            {
                return null;
            }
            var root = XDocument.Parse(userXml).Element("Result");
            if (root == null)
            {
                return null;
            }
            var name = root.Element("Name").Value;
            var mail = root.Element("Mail").Value;
            var mobile = root.Element("Mobile").Value;
            var tel = root.Element("Tel").Value;
            var department = root.Element("Department").Value;
            var manager = root.Element("Manager").Value;

            AdUser aduser = new AdUser()
            {
                Name = name,
                Mail = mail,
                Mobile = mobile,
                Tel = tel,
                Department = department,
                Manager = manager
            };
            return aduser;
        }
    }
}