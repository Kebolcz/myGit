using Easy4net.DBUtility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WechatApp.Models;
using WechatApp.Tools;

namespace WechatApp.Controllers
{
    public class OrderController : Controller
    {
        DBHelper db = new DBHelper();
        

        //订单列表
        public ActionResult Index()
        {
            string userId = Request.QueryString["ssoid"].ToString();

            string today = DateTime.Now.ToShortDateString();
            string roleSql = string.Format("select * from roles where value = '{0}'", userId);
            var role = db.FindBySql<Role>(roleSql).SingleOrDefault();

            string orderSqlStr = string.Empty;
            List<Order> allOrders = new List<Order>();
            if (role == null)
            {
                orderSqlStr = string.Format(@"select * from orders where datediff(day,cast('{0}' as datetime),begtime) >= 0
                                       and person = '{1}'",today,userId);
            }
            else 
            {
                if (role.role.ToString() == "admin")
                {
                    orderSqlStr = string.Format(@"select * from orders where datediff(day,cast('{0}' as datetime),begtime) >= 0",today);
                }
                else if (role.role.ToString() == "driver")
                {
                    orderSqlStr = string.Format(@"select * from orders where datediff(day,cast('{0}' as datetime),begtime) >= 0
                    and driver = '{1}'", today, 3);//司机编号
                }
            }

            allOrders = db.FindBySql<Order>(orderSqlStr);
            var allcars = db.FindAll<Car>().ToList();
            var allDrivers = db.FindAll<Driver>().ToList();

            var ordersForView = new List<OrderView>();
            allOrders.ForEach(order =>
            {
                var orderView = new OrderView();
                string orderCarName,
                       orderDriverName;

                orderView.Guid = order.Guid;
                orderCarName = (from car in allcars
                         where car.Id == Convert.ToInt32(order.Car)
                         select car).Single().Name.ToString();
                orderView.Car = orderCarName;
                if (order.Driver == -1)
                {
                    orderDriverName = "-1";//-1无司机
                }
                else
                {
                    orderDriverName = (from d in allDrivers
                                where d.Id == order.Driver
                                select d).Single().Name.ToString();
                }
                orderView.Driver = orderDriverName;
                
                AdUser aduser = LdapUtility.GetUserInfo(order.Person.Trim());
                if (aduser != null)
                {
                    orderView.Person = aduser.Name;
                }

                orderView.Origin = order.Origin;
                orderView.Destination = order.Destination;
                orderView.BegTime = order.BegTime;

                var journey = new Journey();
                journey = db.FindByProperty<Journey>("OrderId", order.Guid).SingleOrDefault();
                orderView.JourneyStatus = journey == null ? "0" : journey.Status;

                if (orderView.JourneyStatus != "2")
                {
                    ordersForView.Add(orderView);
                }
            });

            ViewBag.UserId = userId;
            ViewBag.Role = role == null ? "normal" : role.role.ToString();
            return View(ordersForView);
        }

        //删除、取消订单；开始、结束行程
        public ActionResult Do(string guid,string oprate,string ssoid)
        {
            log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType.ToString());
            int flag = 0;
            if (oprate == "cancel" || oprate == "delete")
            {
                try
                {
                    flag = db.Remove<Order>(guid);
                }
                catch (Exception ex)
                {
                    log.Error(ex);
                    throw ex;
                }
            }

            if (oprate == "start")
            {
                Journey jouney = new Journey();
                jouney.OrderId = guid;
                jouney.BegTime = DateTime.Now.ToString("g");
                jouney.Status = "1";//开始
                try
                {
                    flag = db.Save<Journey>(jouney);   
                }
                catch (Exception ex)
                {
                    log.Error(ex);
                    throw ex;
                }
            }

            if (oprate == "end")
            {
                Journey journey = db.FindByProperty<Journey>("OrderId", guid).SingleOrDefault();
                if (journey == null)
                {
                    flag = -1;//错误
                }
                else
                {
                    journey.Status = "2";//结束
                    journey.EndTime = DateTime.Now.ToString("g");
                    try
                    {
                        flag = db.Update<Journey>(journey);
                    }
                    catch (Exception ex)
                    {
                        log.Error(ex);
                        throw ex;
                    }
                }
            }

            if (flag > 0)
            {
                return RedirectToAction("Index", new { ssoid = ssoid });
            }
            else
            {
                return View("Error");
            }
        }

        //订单详情
        [HttpGet]
        public ActionResult Detail(string guid,string ssoid)
        {
            Order order = null;
            try
            {
                order = db.FindById<Order>(guid);
            }
            catch (Exception ex)
            {
                log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType.ToString());
                log.Error(ex);                
                throw ex;
            }
            ViewBag.Guid = guid;
            ViewBag.UserId = ssoid;
            return View(order);
        }

        [HttpPost]
        public ActionResult Detail(Order order)
        {
            string guid = Request.QueryString["guid"].ToString();
            string userId = Request.QueryString["ssoid"].ToString();
            var _order = db.FindById<Order>(guid);
            if (_order == null)
            {
                return View("Error");
            }
            _order.Car = order.Car;
            _order.Driver = order.Driver;

            try
            {
                db.Update<Order>(_order);
            }
            catch (Exception ex)
            {
                log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType.ToString());
                log.Error(ex);                
                throw ex;
            }
            return RedirectToAction("Index", new { ssoid = userId });

        }
    }
}