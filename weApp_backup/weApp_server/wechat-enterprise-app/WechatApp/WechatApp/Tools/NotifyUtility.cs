using Senparc.Weixin.MP.AdvancedAPIs.TemplateMessage;
using Senparc.Weixin.MP.CommonAPIs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Configuration;

namespace WechatApp.Tools
{
    public class NotifyUtility
    {
        static string appId = ConfigurationManager.AppSettings["AppId"].ToString();
        static string appSecret = ConfigurationManager.AppSettings["AppSecret"].ToString();

        /// <summary>
        /// 发送模板消息
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="openid">微信id</param>
        /// <param name="tpl">模板id</param>
        /// <param name="data">发送的数据</param>
        /// <returns></returns>
        public static bool SendTplMessage<T>(string openid, string tpl, T data) where T : new()
        {
            bool flag = true;

            var url = string.Empty;
            Type type = data.GetType();
            PropertyInfo[] properties = type.GetProperties(BindingFlags.Public | BindingFlags.Instance);
            var urlProperty = (from p in properties
                               where p.Name == "Url"
                               select p).SingleOrDefault();
            if (urlProperty != null)
            {
                url = urlProperty.GetValue(data, null).ToString();
            }

            string accessToken = AccessTokenContainer.TryGetToken(appId, appSecret);
            var templateMessageResult = TemplateApi.SendTemplateMessage(accessToken, openid, tpl, "#FF0000", url, data);

            if (templateMessageResult.errcode != Senparc.Weixin.ReturnCode.请求成功)
            {
                flag = false;
            }
            return flag;
        }

        public static bool SendTplMessage(string openid, string tpl, object data, string url, out string msg)
        {
            bool flag = true;

            string accessToken = AccessTokenContainer.TryGetToken(appId, appSecret);
            var templateMessageResult = TemplateApi.SendTemplateMessage(accessToken, openid, tpl, "#FF0000", url, data);

            if (templateMessageResult == null || templateMessageResult.errcode != Senparc.Weixin.ReturnCode.请求成功)
            {
                flag = false;
                msg = templateMessageResult == null ? "调用微信模板消息发送消息是出错" : templateMessageResult.errmsg;
            }
            else
            {
                msg = "";
            }
            return flag;
        }
    }
}