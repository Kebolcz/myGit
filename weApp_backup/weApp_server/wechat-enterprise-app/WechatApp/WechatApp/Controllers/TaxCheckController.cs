using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Configuration;
using WechatApp.Tools;
using log4net;

//using Senparc.Weixin.MP.AdvancedAPIs;
//using Senparc.Weixin.MP.CommonAPIs;
//using Senparc.Weixin.MP.Helpers;

using Senparc.Weixin.QY.AdvancedAPIs.MailList;
using Senparc.Weixin.QY.Helpers;
using Senparc.Weixin.QY.CommonAPIs;
using System.Web.Script.Serialization;
using Easy4net.DBUtility;
using WechatApp.Models;

namespace WechatApp.Controllers
{
    public class TaxCheckController : Controller
    {
        //
        // GET: /TaxCheck/
        [HttpGet]
        public ActionResult Index()
        {
            ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

            //var userid = Request.QueryString["ssoid"].Trim();

            string appId = ConfigurationManager.AppSettings["AppId"];
            string appSecret = ConfigurationManager.AppSettings["AppSecret"];
            //var jsapi_ticket = AccessTokenContainer.TryGetToken(appId, appSecret);
            var jsapi_ticket = JsApiTicketContainer.TryGetTicket(appId, appSecret);
            var fpCheckUrl = ConfigurationManager.AppSettings["MAS_Interface_TaxCheck"];
            JsSdkUtility jssdk = new JsSdkUtility();
            var noncestr = jssdk.getRandomString(16);
            var timestamp = JSSDKHelper.GetTimestamp();

            var url = "http://" + Request.Url.Host + ":" + Request.Url.Port + Request.Url.PathAndQuery;
            log.Info(url);

            JSSDKHelper jssdkHelper = new JSSDKHelper();
            var signature = JSSDKHelper.GetSignature(jsapi_ticket, noncestr, long.Parse(timestamp), url);

            //ViewBag.userId = userid;
            ViewBag.appId = appId;
            ViewBag.timestamp = Convert.ToInt32(timestamp);
            ViewBag.nonceStr = noncestr;
            ViewBag.signature = signature;
            ViewBag.fpCheckUrl = fpCheckUrl;
            return View();
        }

    }
}
