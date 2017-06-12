using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WechatApp.Models;
using WechatApp.Tools;
using Easy4net.DBUtility;
using log4net;
using System.Configuration;
using Senparc.Weixin.QY.Entities;
using System.Text;
using System.Web.Script.Serialization;
using Senparc.Weixin.QY.AdvancedAPIs.MailList;
using Senparc.Weixin.QY.Helpers;
using Senparc.Weixin.QY.CommonAPIs;

namespace WechatApp.Controllers
{
    public class RecruitmentController : Controller
    {
        DBHelper db = new DBHelper();

        /// <summary>
        /// 性格测试注册初始
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult Index()
        {
            bool msgFlag = NotifyUtilityQY.SendTplMessage("61106", "", "", "25", GetNewsContent2222());
            SetJSViewbag();
            ViewBag.UserName = "";
            ViewBag.IsCarList = false;
            return View();
        }

        /// <summary>
        /// 获取微信内容
        /// </summary>
        /// <param name="info"></param>
        /// <param name="zpresult"></param>
        /// <returns></returns>
        private List<Article> GetNewsContent2222()
        {
            StringBuilder sb = new StringBuilder();

            sb.AppendFormat("详情", "");
            List<Article> dataList = new List<Article>();
            Article data = new Article();
            data.Url = "";
            data.PicUrl = "";

            data.Title = "面试通知(三面)";
            //data.Title = "面试通知";
            data.Description = "";
            dataList.Add(data);
            Article data1 = new Article();
            data1.Url = "http://wechat.casco.com.cn:9004/Recruitment/list?ssoid=";
            data1.PicUrl = "";
            data1.Title = sb.ToString();
            data1.Description = "";
            dataList.Add(data1);
            return dataList;
        }

        /// <summary>
        /// 获取JSSDK参数信息
        /// </summary>
        private void SetJSViewbag()
        {
            ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

            string appId = ConfigurationManager.AppSettings["AppId"];
            string appSecret = ConfigurationManager.AppSettings["AppSecret"];

            string jsapi_ticket = JsApiTicketContainer.TryGetTicket(appId, appSecret);
            //string jsapi_ticket = Senparc.Weixin.QY.CommonAPIs.CommonApi.GetTicket(appId, appSecret).ticket;

            JsSdkUtility jssdk = new JsSdkUtility();
            var noncestr = jssdk.getRandomString(16);
            var timestamp = JSSDKHelper.GetTimestamp();

            var url = "http://" + Request.Url.Host + ":" + Request.Url.Port + Request.Url.PathAndQuery;
            log.Info(url);

            //JSSDKHelper jssdkHelper = new JSSDKHelper();
            var signature = JSSDKHelper.GetSignature(jsapi_ticket, noncestr, long.Parse(timestamp), url);

            ViewBag.appId = appId;
            ViewBag.timestamp = long.Parse(timestamp);
            ViewBag.nonceStr = noncestr;
            ViewBag.signature = signature;
        }

        /// <summary>
        /// 性格测试提交注册
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult Index(UserInfo info)
        {
            SetJSViewbag();
            ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
            int result = 0;
            if (info == null)
            {
                return View("Error");
            }
            if (info.UserName == null || info.UserAge == null || info.UserPhone == null || info.UserSex == null)
            {
                return new HttpStatusCodeResult(System.Net.HttpStatusCode.BadRequest);
            }
            try
            {
                List<UserInfo> uiList = db.FindByProperty<UserInfo>("UserPhone", info.UserPhone);
                if (uiList.Count > 0)
                {
                    result = 1;
                    info = uiList[0];
                }
                else
                {
                    info.Status = "1";
                    info.AddTime = DateTime.Now;
                    result = db.Save<UserInfo>(info);
                    info.Id = result;
                }
            }
            catch (Exception ex)
            {
                log.Error(ex);
                throw;
            }
            if (result <= 0)
            {
                return new HttpStatusCodeResult(System.Net.HttpStatusCode.BadRequest);
            }
            else
            {
                ViewBag.UserName = info.UserName;
                ViewBag.UserId = info.Id;
                ViewBag.IsCarList = true;
            }
            var allcars = db.FindAll<Question>().ToList();
            return View(allcars);
        }

        /// <summary>
        /// 面试安排初始化
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult Interview()
        {
            SetJSViewbag();
            ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

            if (string.IsNullOrEmpty(Request.QueryString["ssoid"]) || string.IsNullOrEmpty(Request.QueryString["userId"]) || string.IsNullOrEmpty(Request.QueryString["type"]))
            {
                return View("Error");
            }

            string userid = Request.QueryString["userId"].ToString().Trim();
            string userNo = Request.QueryString["ssoid"].ToString().Trim();
            string type = Request.QueryString["type"].ToString().Trim();
            List<UserInfo> uilist = db.FindByProperty<UserInfo>("ID", userid);
            if (uilist != null && uilist.Count > 0)
            {
                ViewBag.UserName = uilist[0].UserName;
                ViewBag.UserSex = uilist[0].UserSex;
                ViewBag.UserAge = uilist[0].UserAge;
                ViewBag.UserId = userid;
                ViewBag.UserNo = userNo;
                ViewBag.Type = type;

            }
            else
            {
                return new HttpStatusCodeResult(System.Net.HttpStatusCode.BadRequest);
            }

            var allcars = db.FindAll<InterViewer>().ToList();
            return View(allcars);
        }

        /// <summary>
        /// 安排面试
        /// </summary>
        /// <param name="zpresult"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult Interview(InterviewArrangementList zpresult)
        {
            SetJSViewbag();
            ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
            int result = 0;
            InterviewArrangement ina = new InterviewArrangement();
            if (zpresult == null)
            {
                return new HttpStatusCodeResult(System.Net.HttpStatusCode.BadRequest);
            }
            try
            {
                string sql = "SELECT * FROM [WeChat].[dbo].[BA_InterviewArrangement] where UserID={0} and Type='{1}'";
                List<InterviewArrangement> zplist = db.FindBySql<InterviewArrangement>(string.Format(sql, zpresult.UserId, zpresult.Type.Trim()));
                foreach (var resultInfo in zpresult.Users)
                {
                    if (resultInfo.UserNo != "" && resultInfo.UserNo != "0")
                    {
                        resultInfo.Status = "1";
                        resultInfo.IsPost = "0";
                        resultInfo.Type = zpresult.Type.Trim();
                        if (resultInfo.UserNo.Trim().Length > 5)
                        {
                            resultInfo.UserName = resultInfo.UserNo.Trim().Substring(5, resultInfo.UserNo.Trim().Length - 5);
                        }
                        resultInfo.UserNo = resultInfo.UserNo.Trim().Substring(0, 5);
                        string InterviewUserSql = "SELECT * FROM [WeChat].[dbo].[BA_InterviewUser] where UserID={0} and UserNo={1} and Type={2} and Status=1";
                        List<InterviewUser> InterviewUserList = db.FindBySql<InterviewUser>(string.Format(InterviewUserSql, zpresult.UserId, resultInfo.UserNo.Trim(), zpresult.Type.Trim()));
                        if (InterviewUserList.Count == 0)
                        {
                            result = db.Save<InterviewUser>(resultInfo);
                        }
                    }
                }

                if (zplist.Count == 0)
                {
                    ina.CreateTime = DateTime.Now;
                    ina.InterviewPlace = zpresult.InterviewPlace;
                    ina.InterviewTime = zpresult.InterviewTime;
                    ina.Remarks = zpresult.Remarks;
                    ina.UserId = zpresult.UserId;
                    ina.Type = zpresult.Type;
                    result = db.Save<InterviewArrangement>(ina);
                }
                List<UserInfo> uiInfo = db.FindByProperty<UserInfo>("ID", zpresult.UserId);
                if (uiInfo != null && uiInfo.Count > 0)
                {
                    if (GetTypeInfo(zpresult.Type.Trim(), uiInfo[0].Status.Trim()))
                    {
                        uiInfo[0].Status = GetTypeInfo(zpresult.Type.Trim());
                    }
                    result = db.Update<UserInfo>(uiInfo[0]);
                }
                if (result > 0)
                {
                    string appId = ConfigurationManager.AppSettings["YYId"].ToString();
                    string InterviewUserSql = "SELECT * FROM [WeChat].[dbo].[BA_InterviewUser] where UserID={0} and Type={1} and Status=1";
                    List<InterviewUser> InterviewUserList = db.FindBySql<InterviewUser>(string.Format(InterviewUserSql, zpresult.UserId, zpresult.Type));

                    foreach (var resultInfo in InterviewUserList)
                    {
                        if (resultInfo.UserNo != "" && resultInfo.UserNo != "0" && resultInfo.IsPost.Trim() != "1")
                        {
                            bool msgFlag = NotifyUtilityQY.SendTplMessage(resultInfo.UserNo.Trim(), "", "", appId,
                                GetNewsContent(uiInfo[0], zpresult, resultInfo.UserNo.Trim()));
                            if (!msgFlag)
                            {
                                //log.Error(new Exception("发送错误"));
                            }
                            else
                            {
                                resultInfo.IsPost = "1";
                                result = db.Update<InterviewUser>(resultInfo);
                                log.Info("发送成功");
                            }
                        }
                        string isDelete = "1";
                        foreach (var resultInfo2 in zpresult.Users)
                        {
                            if (resultInfo.UserNo.Trim() == resultInfo2.UserNo.Trim())
                            {
                                isDelete = "0";
                                break;
                            }
                        }
                        if (isDelete != "0")
                        {
                            result = db.Remove<InterviewUser>(resultInfo.Id);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                log.Error(ex);
                throw;
            }
            if (result < 0)
            {
                return new HttpStatusCodeResult(System.Net.HttpStatusCode.BadRequest);
            }
            return new HttpStatusCodeResult(200);
        }

        /// <summary>
        /// 类型转换
        /// </summary>
        /// <param name="status"></param>
        /// <returns></returns>
        private string GetTypeInfo(string status)
        {
            string result = string.Empty;
            switch (status.Trim())
            {
                case "1":
                    result = "3";
                    break;
                case "2":
                    result = "5";
                    break;
                case "3":
                    result = "7";
                    break;
                default:
                    result = "3";
                    break;
            }
            return result;
        }
        private bool GetTypeInfo(string status, string resultStatus)
        {
            string result = string.Empty;
            bool info = true;
            switch (status.Trim())
            {
                case "1":
                    result = "3";
                    break;
                case "2":
                    result = "5";
                    break;
                case "3":
                    result = "7";
                    break;
                default:
                    result = "3";
                    break;
            }
            if (Convert.ToInt32(resultStatus) >= Convert.ToInt32(result))
            {
                info = false;
            }
            return info;
        }
        private string GetTypeInfo2(string status)
        {
            string result = string.Empty;
            switch (status.Trim())
            {
                case "1":
                    result = "4";
                    break;
                case "2":
                    result = "6";
                    break;
                case "3":
                    result = "8";
                    break;
                default:
                    result = "4";
                    break;
            }
            return result;
        }
        private bool GetTypeInfo2(string status, string resultStatus)
        {
            string result = string.Empty;
            bool info = true;
            switch (status.Trim())
            {
                case "1":
                    result = "4";
                    break;
                case "2":
                    result = "6";
                    break;
                case "3":
                    result = "8";
                    break;
                default:
                    result = "4";
                    break;
            }
            if (Convert.ToInt32(resultStatus) >= Convert.ToInt32(result))
            {
                info = false;
            }
            return info;
        }

        /// <summary>
        /// 获取微信内容
        /// </summary>
        /// <param name="info"></param>
        /// <param name="zpresult"></param>
        /// <returns></returns>
        private List<Article> GetNewsContent(UserInfo info, InterviewArrangementList zpresult, string toUser)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendFormat("面试时间：{0}\n", zpresult.InterviewTime);
            sb.AppendFormat("面试地点：{0}\n", zpresult.InterviewPlace);
            sb.AppendFormat("姓       名：{0}\n", info.UserName);
            sb.AppendFormat("性       别：{0}\n", info.UserSex);
            sb.AppendFormat("学       历：{0}\n", info.UserDegree);
            sb.AppendFormat("毕业院校：{0}\n", info.UserSchool);
            sb.AppendFormat("专       业：{0}\n\n\n\n", info.UserMajor);
            sb.AppendFormat("详情", "");
            List<Article> dataList = new List<Article>();
            Article data = new Article();
            data.Url = "";
            data.PicUrl = "";
            if (zpresult.Type.Trim() == "1")
            {
                data.Title = "面试通知(一面)";
            }
            else if (zpresult.Type.Trim() == "2")
            {
                data.Title = "面试通知(二面)";
            }
            else if (zpresult.Type.Trim() == "3")
            {
                data.Title = "面试通知(三面)";
            }
            else { data.Title = "面试通知"; }
            //data.Title = "面试通知";
            data.Description = "";
            dataList.Add(data);
            Article data1 = new Article();
            data1.Url = "http://wechat.casco.com.cn:9004/Recruitment/list?ssoid=" + toUser + "&type=one&userId=" + zpresult.UserId + "";
            data1.PicUrl = "";
            data1.Title = sb.ToString();
            data1.Description = "";
            dataList.Add(data1);
            return dataList;
        }

        /// <summary>
        /// 根据不同角色获取不同的内容
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult list()
        {
            ViewBag.Title = "人员管理";
            List<UserInfo> allcars = new List<UserInfo>();
            List<UserInfoList> allUserList = new List<UserInfoList>();
            UserInfoList allUser = null;
            var allroles = new List<InterviewRole>();
            if (string.IsNullOrEmpty(Request.QueryString["ssoid"]))
            {
                return View("Error");
            }
            string userNo = Request.QueryString["ssoid"].ToString().Trim();
            ViewBag.UserNo = userNo;
            if (!string.IsNullOrEmpty(Request.QueryString["type"]))
            {
                if (Request.QueryString["type"].ToString().Trim() == "one" && !string.IsNullOrEmpty(Request.QueryString["userId"]))
                {
                    allcars = db.FindByProperty<UserInfo>("ID", Request.QueryString["userId"].ToString());
                    ViewBag.UserRoles = "my";
                    ViewBag.Title = "我的待办";
                }
                else if (Request.QueryString["type"].ToString().Trim() == "my")
                {
                    string sql = @"if  exists(select * from [BA_Roles] where UserNo='{0}')     
                                begin
                                SELECT * FROM [WeChat].[dbo].[BA_UserInfo] where status not in('9','10','11','12','1') order by AddTime desc 
                                end
                                else
                                begin                
                                SELECT * FROM [WeChat].[dbo].[BA_UserInfo] where ID in
                                (select distinct userid from [WeChat].[dbo].[BA_InterviewUser] where UserNo='{0}') order by AddTime desc
                                end ";
                                                allcars = db.FindBySql<UserInfo>(string.Format(sql, userNo));
                    ViewBag.UserRoles = "my";
                    ViewBag.Title = "我的待办";
                }

                allroles = db.FindByProperty<InterviewRole>("UserNo", userNo);
                if (allroles != null && allroles.Count > 0)
                {
                    ViewBag.UserRoles = allroles[0].Type.Trim();
                }
            }
            else
            {
                //allcars = db.FindAll<UserInfo>().OrderByDescending(e => e.AddTime).ToList();
                string sql = @"if  exists(select * from [BA_Roles] where UserNo='{0}')     
                begin
                SELECT * FROM [WeChat].[dbo].[BA_UserInfo] order by AddTime desc
                end
                else
                begin
                SELECT * FROM [WeChat].[dbo].[BA_UserInfo] where ID in
                (select distinct userid from [WeChat].[dbo].[BA_InterviewUser] where UserNo='{0}') order by AddTime desc
                end ";

                allcars = db.FindBySql<UserInfo>(string.Format(sql, userNo));
                allroles = db.FindByProperty<InterviewRole>("UserNo", userNo);
                if (allroles != null && allroles.Count > 0)
                {
                    ViewBag.UserRoles = allroles[0].Type.Trim();
                }
                else
                {
                    ViewBag.UserRoles = "view";
                }
            }
            foreach (var info in allcars)
            {
                allUser = new UserInfoList();
                allUser.Id = info.Id;
                allUser.AddTime = info.AddTime;
                allUser.Status = info.Status;
                allUser.UserAge = info.UserAge;
                allUser.UserDegree = info.UserDegree;
                allUser.UserMajor = info.UserMajor;
                allUser.UserName = info.UserName;
                allUser.UserPhone = info.UserPhone;
                allUser.UserSchool = info.UserSchool;
                allUser.UserSex = info.UserSex;
                if (!string.IsNullOrEmpty(Request.QueryString["type"]))
                {
                    string sql = @"select * from [WeChat].[dbo].[BA_InterviewUser] where UserNo='{0}' and UserID={1}";
                    List<InterviewUser> userList = db.FindBySql<InterviewUser>(string.Format(sql, userNo, info.Id));
                    allUser.Users = userList;
                }
                allUserList.Add(allUser);
            }
            return View(allUserList);
        }

        /// <summary>
        /// 性格测试结果
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult Detail()
        {
            SetJSViewbag();
            string sql = string.Empty;
            if (string.IsNullOrEmpty(Request.QueryString["userId"]))
            {
                return View("Error");
            }
            List<UserInfo> uiList = db.FindByProperty<UserInfo>("ID", Request.QueryString["userId"].ToString());
            if (uiList != null && uiList.Count > 0)
            {
                ViewBag.UserName = uiList[0].UserName;
                ViewBag.UserPhone = uiList[0].UserPhone;
            }
            List<Formula> foList = db.FindAll<Formula>().ToList();

            if (foList != null && foList.Count > 0)
            {
                foreach (var fo in foList)
                {
                    sql = " select *  from dbo.BA_ZPResult where questionId in( select ID from dbo.BA_Questions where rtrim(Mark) in {0}) and userId='{1}'";
                    List<ZPResult> zpList = db.FindBySql<ZPResult>(string.Format(sql, fo.FormulaDesc, Request.QueryString["userId"].ToString()));
                    if (zpList != null && zpList.Count > 0)
                    {
                        fo.Score = (zpList.Sum(e => e.Score)).ToString();
                    }
                }


            }
            return View(foList);
        }

        /// <summary>
        /// 性格测试完成提交信息
        /// </summary>
        /// <param name="zpresult"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult ResultInfo(ZPResultList zpresult)
        {
            SetJSViewbag();
            ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
            int result = 0;
            if (zpresult == null)
            {
                return View("Error");
            }
            try
            {
                List<ZPResult> zplist = db.FindByProperty<ZPResult>("UserID", zpresult.UserID);
                if (zplist.Count > 0)
                {
                    return new HttpStatusCodeResult(System.Net.HttpStatusCode.BadRequest);
                }
                foreach (var resultInfo in zpresult.Scores)
                {
                    resultInfo.AddTime = DateTime.Now;
                    result = db.Save<ZPResult>(resultInfo);
                }
                if (result > 0)
                {
                    List<UserInfo> uiInfo = db.FindByProperty<UserInfo>("ID", zpresult.UserID);
                    if (uiInfo != null && uiInfo.Count > 0)
                    {
                        uiInfo[0].Status = "2";
                        result = db.Update<UserInfo>(uiInfo[0]);
                    }
                    if (result > 0)
                    {
                        string appId = ConfigurationManager.AppSettings["YYId"].ToString();
                        List<InterviewRole> zplist2 = db.FindByProperty<InterviewRole>("Type", "admin");
                        if (zplist2 != null && zplist2.Count > 0)
                        {
                            foreach (var resultInfo in zplist2)
                            {
                                if (resultInfo.UserNo.Trim() != "")
                                {
                                    bool msgFlag = NotifyUtilityQY.SendTplMessage(resultInfo.UserNo.Trim(), "", "",
                                        appId, GetNewsContent(uiInfo[0], resultInfo.UserNo.Trim()));
                                    if (!msgFlag)
                                    {
                                        //log.Error(new Exception("发送错误"));
                                    }
                                    else
                                    {
                                        log.Info("发送成功");
                                    }
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                log.Error(ex);
                throw;
            }
            if (result < 0)
            {
                return new HttpStatusCodeResult(System.Net.HttpStatusCode.BadRequest);
            }
            return new HttpStatusCodeResult(200);
        }

        /// <summary>
        /// 获取性格测试完成微信内容
        /// </summary>
        /// <param name="info"></param>
        /// <param name="zpresult"></param>
        /// <returns></returns>
        private List<Article> GetNewsContent(UserInfo info, string userNo)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendFormat("姓       名：{0}\n", info.UserName);
            sb.AppendFormat("性       别：{0}\n", info.UserSex);
            sb.AppendFormat("学       历：{0}\n", info.UserDegree);
            sb.AppendFormat("毕业院校：{0}\n", info.UserSchool);
            sb.AppendFormat("专       业：{0}\n\n\n\n", info.UserMajor);
            sb.AppendFormat("安排面试", "");
            List<Article> dataList = new List<Article>();
            Article data = new Article();
            data.Url = "";
            data.PicUrl = "";
            data.Title = string.Format("{0}性格及职业人格测试完成通知", info.UserName);
            data.Description = "";
            dataList.Add(data);
            Article data1 = new Article();
            data1.Url = "http://wechat.casco.com.cn:9004/Recruitment/list?ssoid=" + userNo + "&type=one&userId=" + info.Id + "";
            data1.PicUrl = "";
            data1.Title = sb.ToString();
            data1.Description = "";
            dataList.Add(data1);
            return dataList;
        }

        /// <summary>
        /// 获取面试评价完成微信内容
        /// </summary>
        /// <param name="info"></param>
        /// <param name="zpresult"></param>
        /// <returns></returns>
        private List<Article> GetNewsRMContent(UserInfo info, string userNo, string userNoAdmin, string type)
        {
            string name = userNo;
            GetMemberResult member = NotifyUtilityQY.GetUserInfo(userNo.Trim());
            if (member != null && member.name != "")
            {
                name = member.name;
            }
            StringBuilder sb = new StringBuilder();
            sb.AppendFormat("姓       名：{0}\n", info.UserName);
            sb.AppendFormat("性       别：{0}\n", info.UserSex);
            sb.AppendFormat("学       历：{0}\n", info.UserDegree);
            sb.AppendFormat("毕业院校：{0}\n", info.UserSchool);
            sb.AppendFormat("专       业：{0}\n\n\n\n", info.UserMajor);
            sb.AppendFormat("面试结果", "");
            List<Article> dataList = new List<Article>();
            Article data = new Article();
            data.Url = "";
            data.PicUrl = "";
            if (type.Trim() == "1")
            {
                data.Title = string.Format("{0}一面评价完成通知", name);
            }
            else if (type.Trim() == "2")
            {
                data.Title = string.Format("{0}二面评价完成通知", name);
            }
            else if (type.Trim() == "3")
            {
                data.Title = string.Format("{0}三面评价完成通知", name);
            }
            else
            {
                data.Title = string.Format("{0}面试评价完成通知", name);
            }
            data.Description = "";
            dataList.Add(data);
            Article data1 = new Article();
            data1.Url = "http://wechat.casco.com.cn:9004/Recruitment/list?ssoid=" + userNoAdmin + "&type=one&userId=" + info.Id + "";
            data1.PicUrl = "";
            data1.Title = sb.ToString();
            data1.Description = "";
            dataList.Add(data1);
            return dataList;
        }

        /// <summary>
        /// 获取录用通知微信内容
        /// </summary>
        /// <param name="info"></param>
        /// <param name="zpresult"></param>
        /// <returns></returns>
        private List<Article> GetNewsLYTZContent(UserInfo info, string userNo, string userNoAdmin, string type, string Remark)
        {
            string name = userNo;
            GetMemberResult member = NotifyUtilityQY.GetUserInfo(userNo.Trim());
            if (member != null && member.name != "")
            {
                name = member.name;
            }
            StringBuilder sb = new StringBuilder();
            sb.AppendFormat("姓       名：{0}\n", info.UserName);
            sb.AppendFormat("性       别：{0}\n", info.UserSex);
            sb.AppendFormat("学       历：{0}\n", info.UserDegree);
            sb.AppendFormat("毕业院校：{0}\n", info.UserSchool);
            sb.AppendFormat("专       业：{0}\n", info.UserMajor);
            sb.AppendFormat("备       注：{0}\n\n\n", Remark);
            if (type.Trim() == "9")
            {
                sb.AppendFormat("最终结果：录用", "");
            }
            else if (type.Trim() == "10")
            {
                sb.AppendFormat("最终结果：不录用", "");
            }
            else if (type.Trim() == "11")
            {
                sb.AppendFormat("最终结果：备选", "");
            }

            List<Article> dataList = new List<Article>();
            Article data = new Article();
            data.Url = "";
            data.PicUrl = "";
            if (type.Trim() == "9")
            {
                data.Title = "录用通知";
            }
            else if (type.Trim() == "10")
            {
                data.Title = "不录用通知";
            }
            else if (type.Trim() == "10")
            {
                data.Title = "备选通知";
            }
            data.Description = "";
            dataList.Add(data);
            Article data1 = new Article();
            data1.Url = "http://wechat.casco.com.cn:9004/Recruitment/list?ssoid=" + userNoAdmin + "&type=one&userId=" + info.Id + "";
            data1.PicUrl = "";
            data1.Title = sb.ToString();
            data1.Description = "";
            dataList.Add(data1);
            return dataList;
        }

        /// <summary>
        /// 面试评价表初始
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult Evaluation()
        {
            SetJSViewbag();
            ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

            if (string.IsNullOrEmpty(Request.QueryString["ssoid"]) || string.IsNullOrEmpty(Request.QueryString["userId"]) || string.IsNullOrEmpty(Request.QueryString["type"]))
            {
                return View("Error");
            }

            string userid = Request.QueryString["userId"].ToString().Trim();
            string userNo = Request.QueryString["ssoid"].ToString().Trim();
            string type = Request.QueryString["type"].ToString().Trim();
            List<UserInfo> uilist = db.FindByProperty<UserInfo>("ID", userid);
            if (uilist != null && uilist.Count > 0)
            {
                ViewBag.UserName = uilist[0].UserName;
                ViewBag.UserSex = uilist[0].UserSex;
                ViewBag.UserAge = uilist[0].UserAge;
                ViewBag.UserId = userid;
                ViewBag.UserNo = userNo;
                ViewBag.Type = type;
            }
            else
            {
                return new HttpStatusCodeResult(System.Net.HttpStatusCode.BadRequest);
            }

            var allcars = db.FindAll<Question>().ToList();
            return View(allcars);
        }
        /// <summary>
        /// 面试评价表提交评价结果
        /// </summary>
        /// <param name="zpresult"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult Evaluation(InterviewEvaluationList zpresult)
        {
            SetJSViewbag();
            ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
            int result = 0;
            if (zpresult == null)
            {
                return new HttpStatusCodeResult(System.Net.HttpStatusCode.BadRequest);
            }
            try
            {
                string sql = "SELECT * FROM [WeChat].[dbo].[BA_InterviewEvaluation] where UserID={0} and Assessment='{1}' and Type='{2}'";
                List<InterviewEvaluation> zplist = db.FindBySql<InterviewEvaluation>(string.Format(sql, zpresult.UserID, zpresult.UserNo, zpresult.Type.Trim()));
                if (zplist.Count > 0)
                {
                    return new HttpStatusCodeResult(System.Net.HttpStatusCode.BadRequest);
                }
                foreach (var resultInfo in zpresult.Scores)
                {
                    resultInfo.CreateTime = DateTime.Now;
                    result = db.Save<InterviewEvaluation>(resultInfo);
                }
                if (result > 0)
                {
                    List<UserInfo> uiInfo = db.FindByProperty<UserInfo>("ID", zpresult.UserID);
                    if (uiInfo != null && uiInfo.Count > 0)
                    {
                        if (GetTypeInfo2(zpresult.Type.Trim(), uiInfo[0].Status.Trim()))
                        {
                            uiInfo[0].Status = GetTypeInfo2(zpresult.Type.Trim());
                        }
                        result = db.Update<UserInfo>(uiInfo[0]);
                    }
                    if (result > 0)
                    {
                        string appId = ConfigurationManager.AppSettings["YYId"].ToString();
                        List<InterviewRole> zplist2 = db.FindByProperty<InterviewRole>("Type", "admin");
                        if (zplist2 != null && zplist2.Count > 0)
                        {
                            foreach (var resultInfo in zplist2)
                            {
                                if (resultInfo.UserNo.Trim() != "")
                                {
                                    bool msgFlag = NotifyUtilityQY.SendTplMessage(resultInfo.UserNo.Trim(), "", "",
                                        appId, GetNewsRMContent(uiInfo[0], zpresult.UserNo.Trim(), resultInfo.UserNo.Trim(), zpresult.Type.Trim()));
                                    if (!msgFlag)
                                    {
                                        //log.Error(new Exception("发送错误"));
                                    }
                                    else
                                    {
                                        log.Info("发送成功");
                                    }
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                log.Error(ex);
                throw;
            }
            if (result < 0)
            {
                return new HttpStatusCodeResult(System.Net.HttpStatusCode.BadRequest);
            }
            return new HttpStatusCodeResult(200);
        }

        /// <summary>
        /// 加载已评价的面试评价表数据
        /// </summary>
        /// <param name="UserNO"></param>
        /// <param name="UserID"></param>
        /// <param name="Type"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult LoadEvaluation(string UserNO, string UserID, string Type)
        {
            SetJSViewbag();
            ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
            List<InterviewEvaluation> zplist = new List<InterviewEvaluation>();
            string JsonStr = string.Empty;
            if (UserNO == null)
            {
                return new HttpStatusCodeResult(System.Net.HttpStatusCode.BadRequest);
            }
            try
            {
                string sql = "SELECT * FROM [WeChat].[dbo].[BA_InterviewEvaluation] where UserID={0} and Assessment='{1}' and Type='{2}'";
                zplist = db.FindBySql<InterviewEvaluation>(string.Format(sql, UserID, UserNO, Type.Trim()));
                JavaScriptSerializer jss = new JavaScriptSerializer();
                JsonStr = jss.Serialize(zplist);

            }
            catch (Exception ex)
            {
                log.Error(ex);
                throw;
            }
            return Content(JsonStr);
        }

        /// <summary>
        /// 加载已面试安排数据
        /// </summary>
        /// <param name="UserNO"></param>
        /// <param name="UserID"></param>
        /// <param name="Type"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult LoadInterview(string UserNO, string UserID, string Type)
        {
            SetJSViewbag();
            ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
            List<InterviewUser> zplist = new List<InterviewUser>();
            InterviewArrangementList IntList = new InterviewArrangementList();
            string JsonStr = string.Empty;
            if (UserNO == null || Type == null)
            {
                return new HttpStatusCodeResult(System.Net.HttpStatusCode.BadRequest);
            }
            try
            {
                string sql = "SELECT * FROM [WeChat].[dbo].[BA_InterviewArrangement] where UserID={0} and Type='{1}'";
                List<InterviewArrangement> uiInfo = db.FindBySql<InterviewArrangement>(string.Format(sql, UserID, Type));
                if (uiInfo != null && uiInfo.Count > 0)
                {
                    IntList.InterviewTime = uiInfo[0].InterviewTime;
                    IntList.Remarks = uiInfo[0].Remarks;
                    IntList.InterviewPlace = uiInfo[0].InterviewPlace;
                }
                string sql2 = "SELECT * FROM [WeChat].[dbo].[BA_InterviewUser] where UserID={0} and Type='{1}'";
                zplist = db.FindBySql<InterviewUser>(string.Format(sql2, UserID, Type));
                IntList.Users = zplist;

                JavaScriptSerializer jss = new JavaScriptSerializer();
                JsonStr = jss.Serialize(IntList);

            }
            catch (Exception ex)
            {
                log.Error(ex);
                throw;
            }
            return Content(JsonStr);
        }

        /// <summary>
        /// 加载汇总面试结果
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult Result()
        {
            SetJSViewbag();
            ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
            var allcars = new List<InterviewResult>();
            InterviewResult result = null;

            if (string.IsNullOrEmpty(Request.QueryString["ssoid"]) || string.IsNullOrEmpty(Request.QueryString["userId"]))
            {
                return View("Error");
            }

            string userid = Request.QueryString["userId"].ToString().Trim();
            string userNo = Request.QueryString["ssoid"].ToString().Trim();
            var allroles = db.FindByProperty<InterviewRole>("UserNo", userNo);
            if (allroles != null && allroles.Count > 0)
            {
                foreach (InterviewRole roles in allroles)
                {
                    if (roles.Data2 != null && roles.Data2.Trim() == "1")
                    {
                        string sql = "SELECT * FROM [WeChat].[dbo].[BA_Log] where UserID={0} ";
                        List<InterviewLog> zplist = db.FindBySql<InterviewLog>(string.Format(sql, userid));
                        if (zplist.Count == 0)
                        {
                            ViewBag.UserRoles = "1";
                            ViewBag.Remark = "";
                            break;
                        }
                        else
                        {
                            ViewBag.UserRoles = "0";
                            ViewBag.Remark = zplist[0].Remark;
                            break;
                        }
                    }
                    else
                    {
                        ViewBag.UserRoles = "0";
                    }
                }
            }
            List<UserInfo> uilist = db.FindByProperty<UserInfo>("ID", userid);
            if (uilist != null && uilist.Count > 0)
            {
                ViewBag.UserName = uilist[0].UserName;
                ViewBag.UserSex = uilist[0].UserSex;
                ViewBag.UserAge = uilist[0].UserAge;
                ViewBag.UserSchool = uilist[0].UserSchool;
                ViewBag.UserDegree = uilist[0].UserDegree;
                ViewBag.UserMajor = uilist[0].UserMajor;
                ViewBag.UserId = userid;
                ViewBag.UserNo = userNo;
            }
            else
            {
                return new HttpStatusCodeResult(System.Net.HttpStatusCode.BadRequest);
            }
            List<InterviewUser> userList = db.FindByProperty<InterviewUser>("UserID", userid).OrderBy(e => e.Type).ToList();
            if (userList != null && userList.Count > 0)
            {
                foreach (var user in userList)
                {
                    result = new InterviewResult();
                    result.UserID = user.UserID;
                    result.UserName = user.UserName;
                    result.UserNo = user.UserNo;
                    result.Type = user.Type;
                    string sql = @"SELECT TOP 1 *
                                  FROM [WeChat].[dbo].[BA_InterviewEvaluation] where Assessment='{1}' and UserID='{0}' and Type='{2}' ";
                    List<InterviewEvaluation> IntEv = db.FindBySql<InterviewEvaluation>(string.Format(sql, userid, user.UserNo, user.Type.Trim()));
                    if (IntEv != null && IntEv.Count > 0)
                    {
                        result.MSEvaluation = IntEv[0].MSEvaluation;
                        result.Evaluation = IntEv[0].Evaluation;
                        result.Assessment = IntEv[0].Assessment;
                    }
                    else
                    {
                        result.MSEvaluation = "无";
                        result.Evaluation = "未评价";
                        result.Assessment = userNo;
                    }
                    allcars.Add(result);
                }
            }
            return View(allcars);
        }

        /// <summary>
        /// 录用结果处理
        /// </summary>
        /// <param name="userNo"></param>
        /// <param name="userId"></param>
        /// <param name="Remark"></param>
        /// <param name="Type"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult SaveResult(string userNo, string userId, string Remark, string Type)
        {
            SetJSViewbag();
            ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
            int result = 0;
            InterviewLog Ilog = new InterviewLog();
            if (userNo == "" || userId == "" || Type == "")
            {
                return new HttpStatusCodeResult(System.Net.HttpStatusCode.BadRequest);
            }
            try
            {
                string sql = "SELECT * FROM [WeChat].[dbo].[BA_Log] where UserID={0} and UserNo='{1}'";
                List<InterviewLog> zplist = db.FindBySql<InterviewLog>(string.Format(sql, userId, userNo));
                if (zplist.Count > 0)
                {
                    return new HttpStatusCodeResult(System.Net.HttpStatusCode.BadRequest);
                }
                Ilog.UserID = Convert.ToInt32(userId);
                Ilog.UserNo = userNo;
                Ilog.AddTime = DateTime.Now;
                Ilog.Result = Type;
                Ilog.Remark = Remark;
                result = db.Save<InterviewLog>(Ilog);
                if (result > 0)
                {
                    List<UserInfo> uiInfo = db.FindByProperty<UserInfo>("ID", userId);
                    if (uiInfo != null && uiInfo.Count > 0)
                    {
                        uiInfo[0].Status = Type;
                        result = db.Update<UserInfo>(uiInfo[0]);
                    }
                    if (result > 0)
                    {
                        string appId = ConfigurationManager.AppSettings["YYId"].ToString();
                        List<InterviewRole> zplist2 = db.FindByProperty<InterviewRole>("Type", "admin");
                        if (zplist2 != null && zplist2.Count > 0)
                        {
                            foreach (var resultInfo in zplist2)
                            {
                                if (resultInfo.UserNo.Trim() != "")
                                {
                                    bool msgFlag = NotifyUtilityQY.SendTplMessage(resultInfo.UserNo.Trim(), "", "",
                                        appId, GetNewsLYTZContent(uiInfo[0], userNo.Trim(), resultInfo.UserNo.Trim(), Type.Trim(), Remark));
                                    if (!msgFlag)
                                    {
                                        //log.Error(new Exception("发送错误"));
                                    }
                                    else
                                    {
                                        log.Info("发送成功");
                                    }
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                log.Error(ex);
                throw;
            }
            if (result < 0)
            {
                return new HttpStatusCodeResult(System.Net.HttpStatusCode.BadRequest);
            }
            return new HttpStatusCodeResult(200);
        }

        /// <summary>
        /// 转办初始化加载部门列表
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult Forward()
        {
            SetJSViewbag();
            ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
            var allcars = new List<DeptUserList>();
            List<DepartmentListInfo> departmentInfo = new List<Models.DepartmentListInfo>();
            Models.DepartmentListInfo dep = null;
            List<UserList> userlist = new List<UserList>();

            if (string.IsNullOrEmpty(Request.QueryString["ssoid"]) || string.IsNullOrEmpty(Request.QueryString["userId"]))
            {
                return View("Error");
            }
            string userid = Request.QueryString["userId"].ToString().Trim();
            string userNo = Request.QueryString["ssoid"].ToString().Trim();
            ViewBag.UserId = userid;
            ViewBag.UserNo = userNo;
            GetDepartmentListResult departmentAllList = NotifyUtilityQY.GetDepartmentList(1);
            GetMemberResult member = NotifyUtilityQY.GetUserInfo(userNo);
            if (departmentAllList != null)
            {
                foreach (var dept in departmentAllList.department)
                {
                    if (member.department.Contains(dept.id) && dept.id != 1)
                    {
                        dep = new Models.DepartmentListInfo();
                        dep.id = dept.id;
                        dep.name = dept.name;
                        dep.order = dept.order;
                        dep.parentid = dep.parentid;
                        departmentInfo.Add(dep);
                    }
                }
                foreach (var dept in departmentAllList.department)
                {
                    if (!member.department.Contains(dept.id) && dept.id != 1)
                    {
                        dep = new Models.DepartmentListInfo();
                        dep.id = dept.id;
                        dep.name = dept.name;
                        dep.order = dept.order;
                        dep.parentid = dep.parentid;
                        departmentInfo.Add(dep);
                    }
                }
            }
            DeptUserList list = new DeptUserList();
            list.department = departmentInfo;
            allcars.Add(list);
            return View(allcars);
        }

        /// <summary>
        /// 转办根据部门查找部门内成员
        /// </summary>
        /// <param name="id"></param>
        /// <param name="userNo"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult Forward2(string id, string userNo, string userid)
        {
            SetJSViewbag();
            ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
            var allcars = new List<DeptUserList>();
            List<UserList> userInfo = new List<Models.UserList>();
            Models.UserList dep = null;
            List<UserList> userlist = new List<UserList>();
            string JsonStr = string.Empty;
            if (string.IsNullOrEmpty(userNo) || string.IsNullOrEmpty(userid))
            {
                return View("Error");
            }
            GetDepartmentMemberInfoResult departmentAllList = NotifyUtilityQY.GetDepartmentMember(Convert.ToInt32(id), 1, 0);
            if (departmentAllList != null)
            {
                foreach (var dept in departmentAllList.userlist)
                {
                    dep = new Models.UserList();
                    dep.userid = dept.userid;
                    dep.name = dept.name;
                    dep.department = dept.department;
                    dep.status = dept.status;
                    userInfo.Add(dep);
                }
            }
            DeptUserList list = new DeptUserList();
            list.userlist = userInfo;
            allcars.Add(list);
            JavaScriptSerializer jss = new JavaScriptSerializer();
            JsonStr = jss.Serialize(allcars);
            return Content(JsonStr);
        }

        /// <summary>
        /// 转办处理
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="UserFromNo"></param>
        /// <param name="UserToNo"></param>
        /// <param name="UserName"></param>
        /// <param name="Remarks"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult Forward(string UserId, string UserFromNo, string UserToNo, string UserName, string Remarks)
        {
            SetJSViewbag();
            ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
            int result = 0;
            if (string.IsNullOrEmpty(UserId) || string.IsNullOrEmpty(UserToNo))
            {
                return new HttpStatusCodeResult(System.Net.HttpStatusCode.BadRequest);
            }
            string sql = "select * from  BA_InterviewUser  where UserID={0} and UserNo='{1}' order by type desc";
            List<InterviewUser> user = db.FindBySql<InterviewUser>(string.Format(sql, UserId, UserFromNo));
            if (user == null || user.Count == 0)
            {
                return new HttpStatusCodeResult(System.Net.HttpStatusCode.BadRequest);
            }
            string sql2 = "select * from  BA_InterviewArrangement  where UserID={0} and Type='{1}' ";
            List<InterviewArrangement> Arrangement = db.FindBySql<InterviewArrangement>(string.Format(sql2, UserId, user[0].Type.Trim()));
            if (Arrangement == null || Arrangement.Count == 0)
            {
                return new HttpStatusCodeResult(System.Net.HttpStatusCode.BadRequest);
            }
            List<UserInfo> UserInfo = db.FindByProperty<UserInfo>("ID", UserId);
            if (UserInfo == null || UserInfo.Count == 0)
            {
                return new HttpStatusCodeResult(System.Net.HttpStatusCode.BadRequest);
            }
            string fromUserName = user[0].UserName;
            user[0].UserNo = UserToNo;
            user[0].UserName = UserName;
            result = db.Update<InterviewUser>(user[0]);
            if (result <= 0)
            {
                return new HttpStatusCodeResult(System.Net.HttpStatusCode.BadRequest);
            }
            else
            {
                string appId = ConfigurationManager.AppSettings["YYId"].ToString();
                bool msgFlag = NotifyUtilityQY.SendTplMessage(UserToNo.Trim(), "", "",
                    appId, GetNewsZBContent(UserInfo[0], Arrangement[0], UserToNo, fromUserName, Remarks, UserName));
                if (!msgFlag)
                {
                    //log.Error(new Exception("发送错误"));
                }
                else
                {
                    log.Info("发送成功");
                    //string appId = ConfigurationManager.AppSettings["YYId"].ToString();
                    List<InterviewRole> zplist2 = db.FindByProperty<InterviewRole>("Type", "admin");
                    if (zplist2 != null && zplist2.Count > 0)
                    {
                        foreach (var resultInfo in zplist2)
                        {
                            if (resultInfo.UserNo.Trim() != "")
                            {
                                msgFlag = NotifyUtilityQY.SendTplMessage(resultInfo.UserNo.Trim(), "", "",
                                   appId, GetNewsZBContent(UserInfo[0], Arrangement[0], resultInfo.UserNo.Trim(), fromUserName, Remarks, UserName));
                                if (!msgFlag)
                                {
                                    //log.Error(new Exception("发送错误"));
                                }
                                else
                                {
                                    log.Info("发送成功");
                                }
                            }
                        }
                    }
                }
            }
            return new HttpStatusCodeResult(200); ;
        }
        /// <summary>
        /// 获取转办微信内容
        /// </summary>
        /// <param name="info"></param>
        /// <param name="zpresult"></param>
        /// <returns></returns>
        private List<Article> GetNewsZBContent(UserInfo info, InterviewArrangement zpresult, string toUser, string fromUserName, string remark, string UserName)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendFormat("面试时间：{0}\n", zpresult.InterviewTime);
            sb.AppendFormat("面试地点：{0}\n", zpresult.InterviewPlace);
            sb.AppendFormat("姓       名：{0}\n", info.UserName);
            sb.AppendFormat("性       别：{0}\n", info.UserSex);
            sb.AppendFormat("学       历：{0}\n", info.UserDegree);
            sb.AppendFormat("毕业院校：{0}\n", info.UserSchool);
            sb.AppendFormat("专       业：{0}\n", info.UserMajor);
            sb.AppendFormat("备       注：{0}\n\n\n\n", remark);
            sb.AppendFormat("详情", "");
            List<Article> dataList = new List<Article>();
            Article data = new Article();
            data.Url = "";
            data.PicUrl = "";
            if (zpresult.Type.Trim() == "1")
            {
                data.Title = string.Format("{0}转发{1}面试通知(一面)", fromUserName, UserName);
            }
            else if (zpresult.Type.Trim() == "2")
            {
                data.Title = string.Format("{0}转发{1}面试通知(二面)", fromUserName, UserName);
            }
            else if (zpresult.Type.Trim() == "3")
            {
                data.Title = string.Format("{0}转发{1}面试通知(三面)", fromUserName, UserName);
            }
            else { data.Title = string.Format("{0}转发{1}面试通知", fromUserName, UserName); }
            //data.Title = "面试通知";
            data.Description = "";
            dataList.Add(data);
            Article data1 = new Article();
            data1.Url = "http://wechat.casco.com.cn:9004/Recruitment/list?ssoid=" + toUser + "&type=one&userId=" + zpresult.UserId + "";
            data1.PicUrl = "";
            data1.Title = sb.ToString();
            data1.Description = "";
            dataList.Add(data1);
            return dataList;
        }

        /// <summary>
        /// 搜索智能提示
        /// </summary>
        /// <param name="UserNO"></param>
        /// <param name="UserID"></param>
        /// <param name="Type"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult GetUserList(string UserName)
        {
            ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
            List<UserInfo> zplist = new List<UserInfo>();
            string JsonStr = string.Empty;
            if (UserName == null)
            {
                return new HttpStatusCodeResult(System.Net.HttpStatusCode.BadRequest);
            }
            try
            {
                string sql = "SELECT top 4* FROM [WeChat].[dbo].[BA_UserInfo] where UserName like '%{0}%'";
                zplist = db.FindBySql<UserInfo>(string.Format(sql, UserName));
                JavaScriptSerializer jss = new JavaScriptSerializer();
                JsonStr = jss.Serialize(zplist);

            }
            catch (Exception ex)
            {
                log.Error(ex);
                throw;
            }
            return Content(JsonStr);
        }
    }
}
