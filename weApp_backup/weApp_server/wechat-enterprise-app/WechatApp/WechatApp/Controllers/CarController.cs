using Easy4net.DBUtility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WechatApp.Models;
using WechatApp.Tools;
using System.Configuration;

namespace WechatApp.Controllers
{
    public class CarController : Controller
    {
        [HttpGet]
        public ActionResult Index()
        {
            string userid = Request.QueryString["ssoid"].ToString().Trim();
            ViewBag.UserId = userid;
            ViewBag.IsCarList = false;
            return View();
        }

        [HttpPost]
        public ActionResult Index(string date,string userId) {
            log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
            DBHelper db = new DBHelper();
            string dateEnd = date + " 23:59:59";

            List<Car> Cars = new List<Car>();
            List<CarItemView> CarViews = new List<CarItemView>();
            try
            {
                Cars = db.FindAll<Car>();
            }
            catch (Exception ex)
            {
                log.Error(ex);
                throw ex;
            }
            Cars.ForEach(car =>
            {
                CarItemView carItemView = new CarItemView();
                carItemView.Id = car.Id;
                carItemView.Name = car.Name;
                carItemView.Number = car.Number;
                carItemView.Picture = car.Picture;
                carItemView.Seat = car.Seat;
                carItemView.Orders = new List<OrderView>();

                string ordersSqlStr = @"select * from orders where car = '{0}'
                               and begtime between cast('{1}' as datetime) and cast('{2}' as datetime)";
                string ordersSql = string.Format(ordersSqlStr, car.Id, date, dateEnd);
                List<Order> Orders = db.FindBySql<Order>(ordersSql);
                int count = 0;
                Orders.ForEach(order =>
                {
                    count++;
                    DateTime orderTime = Convert.ToDateTime(order.BegTime.Trim());
                    string orderHour = orderTime.Hour.ToString().TrimStart('0');
                    string orderMinis = orderTime.Minute.ToString().Trim();
                    string orderHalfDay = GetHalfDayByHours(orderTime.Hour);

                    AdUser aduser = LdapUtility.GetUserInfo(order.Person.Trim());

                    carItemView.Orders.Add(new OrderView()
                    {
                        Content = BuildOrderViewContent(aduser,orderHalfDay,orderHour,orderMinis)
                    });

                    var journey = db.FindByProperty<Journey>("OrderId", order.Guid).SingleOrDefault();
                    if (journey != null && journey.Status == "1")
                    {
                        carItemView.Journey = new JourneyView() { Flag = true, Content = "行程" + count.ToString() + "正在进行" };
                    }
                });

                var tailNumber = db.FindByProperty<Tail>("day", Convert.ToDateTime(date).DayOfWeek.ToString()).SingleOrDefault();
                if (tailNumber != null)
                {
                    carItemView.Limited = tailNumber.Number.IndexOf(car.Number.ToCharArray().Last()) != -1 ? true : false;
                }
                CarViews.Add(carItemView);
            });

            ViewBag.IsCarList = true;
            ViewBag.UserId = userId;
            ViewBag.SeletedDate = date;
            return View(CarViews);
        }

        [HttpGet]
        public ActionResult Book(string carid,string date,string userid) 
        {
            ViewBag.CarId = carid;
            ViewBag.Date = date;
            ViewBag.UserId = userid;

            return View();
        }

        [HttpPost]
        public ActionResult Book(Order order) 
        {
            log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
            bool _modelState = ModelState.IsValid;
            if (_modelState)
            {
                if (string.IsNullOrEmpty(order.Car) || string.IsNullOrEmpty(order.Person))
                {
                    _modelState = false;
                }
            }
            if (!_modelState)
	        {
		        ViewBag.Error = true;
                return View();
	        }
            DBHelper db = new DBHelper();
            string bookDate = Request.QueryString["date"].Trim();
            string bookDateTime = bookDate + " " + order.BegTime + ":00";

            List<Driver> allDrivers = db.FindAll<Driver>();
            List<Car> allCars = db.FindAll<Car>();
            var carDriver = (from driver in allDrivers
                             where driver.CarId == Convert.ToInt32(order.Car)
                             select driver).SingleOrDefault();
            if (carDriver != null)
            {
                order.Driver = carDriver.Id;
            }
            else
            {
                string dayOfWeek = Convert.ToDateTime(bookDateTime).DayOfWeek.ToString();
                string limitCarTailNumbers = db.FindByProperty<Tail>("Day", dayOfWeek).SingleOrDefault().Number.ToString().Trim();
                var optionalCar = (from car in
                                      (from _car in allCars
                                       let tail = _car.Number.Substring(_car.Number.Length - 1, 1)
                                       where limitCarTailNumbers.Contains(tail)
                                       select _car)
                                  where car.Id != Convert.ToInt32(order.Car)
                                  select car).SingleOrDefault();
                if (optionalCar != null)
                {
                    var optionalDriver = db.FindByProperty<Driver>("CarId", optionalCar.Id).SingleOrDefault();
                    if (optionalDriver != null)
                    {
                        order.Driver = optionalDriver.Id;
                    }
                    else
                    {
                        order.Driver = null;
                    }
                }
                else
                {
                    order.Driver = null;
                }
            }
            order.BegTime = bookDateTime;
            order.Guid = Guid.NewGuid().ToString();
            try
            {
                db.Save<Order>(order);
            }
            catch (Exception ex)
            {
                string exType = ex.GetType().Name.ToString();
                if (exType != "InvalidCastException")
                {
                    log.Error(ex);
                    ViewBag.Error = true;
                    return View();
                }
            }

            string ConfigColor = ConfigurationManager.AppSettings["ConfigColor"].ToString();
            string NotifyTemplateMessageId =  ConfigurationManager.AppSettings["NotifyTemplateMessageId"].ToString();

            if (string.IsNullOrEmpty(ConfigColor))
	        {
		        ConfigColor = "#173177";
	        }
            if (string.IsNullOrEmpty(NotifyTemplateMessageId))
	        {
		        NotifyTemplateMessageId = "V_y__REPa3SBRH9t2Upg50pt-osUM_gP_gaR4-M-6VM";
	        }
            AdUser aduser = LdapUtility.GetUserInfo(order.Person.Trim());
            string carName = allCars.Single(_car => _car.Id == Convert.ToInt32(order.Car)).Name;
            var pushMessage = new
            {
                Pernr = new { value = aduser == null ? "" : aduser.Name, color = ConfigColor },
                Car = new { value = carName, color = ConfigColor },
                Time = new { value = order.BegTime, color = ConfigColor }
            };

            string msg;
            bool msgFlag = NotifyUtility.SendTplMessage("", NotifyTemplateMessageId, pushMessage, "", out msg);
            if (!msgFlag)
            {
                log.Error(new Exception(msg));
            }
            else
            {
                log.Info("发送成功");
            }

            ViewBag.BookSuccessful = true;
            return View();
        }



        private string BuildOrderViewContent(AdUser aduser, string orderHalfDay, string orderHour, string orderMinis)
        {
            string userName = aduser == null ? "" : aduser.Name;
            string time = orderHalfDay + orderHour + "点" + orderMinis + "分";
            if (string.IsNullOrEmpty(userName))
            {
                return time;
            }
            else
            {
                return userName + " 预约" + time;
            }
        }

        private string GetHalfDayByHours(int hours)
        {
            return hours >= 12 ? "下午" : "上午";
        }
    }
}
