using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Configuration;
using WechatApp.Tools;
using log4net;

using Senparc.Weixin.MP.AdvancedAPIs;
using Senparc.Weixin.MP.CommonAPIs;
using Senparc.Weixin.MP.Helpers;
using System.Web.Script.Serialization;
using Easy4net.DBUtility;
using WechatApp.Models;

namespace WechatApp.Controllers
{
    public class TrainingController : Controller
    {
        [HttpGet]
        public ActionResult Index()
        {
            ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

            var userid = Request.QueryString["ssoid"].Trim();

            string appId = ConfigurationManager.AppSettings["AppId"];
            string appSecret = ConfigurationManager.AppSettings["AppSecret"];
            var jsapi_ticket = JsApiTicketContainer.TryGetTicket(appId,appSecret);

            JsSdkUtility jssdk = new JsSdkUtility();
            var noncestr = jssdk.getRandomString(16);
            var timestamp = JSSDKHelper.GetTimestamp();

            var url = "http://" + Request.Url.Host + ":" + Request.Url.Port + Request.Url.PathAndQuery;
            log.Info(url);

            JSSDKHelper jssdkHelper = new JSSDKHelper();
            var signature = jssdkHelper.GetSignature(jsapi_ticket, noncestr, timestamp, url);

            ViewBag.userId = userid;
            ViewBag.appId = appId;
            ViewBag.timestamp = Convert.ToInt32(timestamp);
            ViewBag.nonceStr = noncestr;
            ViewBag.signature = signature;

            return View();
        }

        [HttpPost]
        public ActionResult Index(TrainningAssessmentResult trainningAssessmentResult) {
            ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
            DBHelper db = new DBHelper();
            Flow flowInfo;
            try
            {
                flowInfo = db.FindByProperty<Flow>("Guid", trainningAssessmentResult.Guid).SingleOrDefault();
            }
            catch (Exception ex)
            {
                log.Error(ex);
                throw;
            }
            if (flowInfo != null)
            {
                return new HttpStatusCodeResult(System.Net.HttpStatusCode.BadRequest);
            }

            flowInfo = new Flow();
            flowInfo.Guid = trainningAssessmentResult.Guid;
            flowInfo.Lesson = trainningAssessmentResult.Lesson;
            flowInfo.Person = trainningAssessmentResult.Person;
            flowInfo.Transfer = "1";
            int saveResultFlag;
            try
            {
                saveResultFlag = db.Save<Flow>(flowInfo);
            }
            catch (Exception ex)
            {
                log.Error(ex);
                throw;
            }
            if (saveResultFlag < 1)
            {
                return new HttpStatusCodeResult(System.Net.HttpStatusCode.BadRequest);
            }

            var i = 0;
            trainningAssessmentResult.Scores.ForEach(s =>
            {
                i++;
                var score = new Assess();
                score.FlowId = trainningAssessmentResult.Guid;
                score.Kpi = s.Kpi;
                score.Seqnr = s.Seqnr;
                score.Score = s.Score;
                score.Seqno = i;
                score.Transfer = "1";

                db.Save<Assess>(score);
            });
            return new HttpStatusCodeResult(200);
        }
    }
}
