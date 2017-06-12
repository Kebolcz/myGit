using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WechatApp.Models;
using log4net;

namespace WechatApp.Controllers
{
    public class AnnouncementController : Controller
    {
        string MossAnnouncementNum = ConfigurationManager.AppSettings["MossAnnouncementNum"];
        MossAnnouncement.Service MossService = new MossAnnouncement.Service();
        public ActionResult Index()
        {
            int _last = 10;
            int _showNum = Convert.ToInt32(MossAnnouncementNum);
            MossAnnouncement.HomePageCenterEntity[] notifications = new MossAnnouncement.HomePageCenterEntity[_showNum];
            try
            {
                notifications = MossService.GetListData(_showNum, _last);
            }
            catch (Exception ex)
            {
                ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
                log.Error(ex);
            }
            List<Notification> notifisForView = new List<Notification>();
            if (notifications!=null&& notifications.Length > 0)
            {
                for (int i = 0; i < notifications.Length; i++) {
                    var notifi = new Notification();
                    notifi.Title = notifications[i].ListTitle.Trim();
                    notifi.PublishDate = Convert.ToDateTime(notifications[i].ListDate);
                    notifi.HasImage = true;
                    notifisForView.Add(notifi);
                }
            }
            notifisForView.Sort((o, p) =>{ return DateTime.Compare(o.PublishDate, p.PublishDate) >= 0? -1:1; });
            return View(notifisForView);
        }
    }
}
