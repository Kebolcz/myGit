using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WechatApp.Controllers
{
    public class AttendanceController : Controller
    {
        //
        // GET: /Attendance/

        public ActionResult Index()
        {
            ViewBag.UserName = "";
            ViewBag.IsCarList = false;
            return View();
        }

    }
}
