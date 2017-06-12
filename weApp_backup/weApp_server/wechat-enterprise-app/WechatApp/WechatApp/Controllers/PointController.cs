using Maticsoft.DBUtility;
using Senparc.Weixin.QY.Entities;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WechatApp.Tools;
using WechatApp.Models.Point;
using Newtonsoft;
using Newtonsoft.Json;
using System.Text;

namespace WechatApp.Controllers
{
    public class PointController : Controller
    {
        //
        // GET: /Point/

        public JsonResult Index()
        {
            var res = new JsonResult();
            var name = "北京机场线及二号线技术服务";
            var no = "A1.00106010";
            var pm = "梁晓龙";
            var icon = "/images/project.png";
            var jd = "安装调试";
            res.Data = new object[] { new { name, no, icon, pm, jd }, new { name, no, icon, pm, jd } };//返回一个自定义的object数组  
            res.JsonRequestBehavior = JsonRequestBehavior.AllowGet;//允许使用GET方式获取，否则用GET获取是会报错。  
            return res;
        }
        private JsonResult RetResult(string message)
        {
            var res = new JsonResult();
            //res.Data = new object[] { new { message, result = 'E' } };//返回一个自定义的object数组  
            res = Json(new { message = message, result = 'E' }, JsonRequestBehavior.AllowGet);
            // res.JsonRequestBehavior = JsonRequestBehavior.AllowGet;//允许使用GET方式获取，否则用GET获取是会报错。
            return res;
        }

        /// <summary>
        /// 获取员工项目列表
        /// </summary>
        /// <returns></returns>
        public JsonResult MyProjectList()
        {
            var res = new JsonResult();
            try
            {
                if (!string.IsNullOrEmpty(Request.Params["userNo"]))
                {
                    string userNo = Request.Params["userNo"];
                    string sql = string.Format(@"SELECT distinct  
                                      a.[ProjectNo]
                                      ,[ProjectName]
                                      ,[ProjectManagerNo]
                                      ,b.UserName as [ProjectManagerName]
                                  FROM [CascoMountPoint].[dbo].[tb_Project] as a left join [CascoMountPoint].[dbo].[tb_User] as b
                                  on a.ProjectManagerNo=b.UserNo
                                  LEFT JOIN [CascoMountPoint].[dbo].tb_ProjectMembers c 
                                  ON a.ProjectNo=c.ProjectNo 
                                  where a.Status!=0 and  (c.ProjectUserNo='{0}' or a.ProjectManagerNo='{0}');
                                 SELECT * FROM [CascoMountPoint].[dbo].[MyCollectionProject] where UserNo='{0}' and status!=0;", userNo.Trim());
                    DataSet ds = DbHelperSQL.Query(sql);
                    var query = from p in ds.Tables[0].AsEnumerable()
                                select new
                                {
                                    ProjectNo = p["ProjectNo"].ToString(),
                                    ProjectName = p["ProjectName"].ToString().Split('-')[1],
                                    ProjectManagerNo = p["ProjectManagerNo"].ToString(),
                                    ProjectManagerName = p["ProjectManagerName"].ToString(),
                                    //rate = getProjectRate(p["ProjectNo"].ToString())
                                    rate = 20
                                };
                    var query2 = from p in ds.Tables[1].AsEnumerable()
                                 select new
                                 {
                                     ProjectNo = p["ProjectNo"].ToString()
                                 };
                    res = Json(new { rows = query, rows2 = query2, total = ds.Tables[0].Rows.Count, result = 'S' }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    res = RetResult("参数错误");
                }
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// <summary>
        /// 获取项目收集完成率
        /// </summary>
        /// <param name="projectNo"></param>
        /// <returns></returns>
        private double getProjectRate(string projectNo)
        {
            double result = 0;
            string sql = string.Format(@"SELECT COUNT(*) as count
                                  FROM [CascoMountPoint].[dbo].[tb_ProjectAndEquipment] where ProjectNo='{0}' and Status!=0;
                                select COUNT(*) as count from [CascoMountPoint].[dbo].[tb_Main] where ProjectNo='{0}' 
                                and Status!=0 and  MaterialNo in ( SELECT MaterialNo
                                  FROM [CascoMountPoint].[dbo].[tb_ProjectAndEquipment] where ProjectNo='{0}' and Status!=0)", projectNo);
            DataSet ds = DbHelperSQL.Query(sql);
            if (ds != null)
            {
                if (Convert.ToDouble(ds.Tables[0].Rows[0]["count"]) > 0)
                {
                    result = Math.Round(Convert.ToDouble(ds.Tables[1].Rows[0]["count"]) / Convert.ToDouble(ds.Tables[0].Rows[0]["count"]) * 100, 2);
                }
            }
            return result;
        }

        /// <summary>
        /// 获取员工收藏项目列表
        /// </summary>
        /// <returns></returns>
        public JsonResult MyCollectionProjectList()
        {
            var res = new JsonResult();
            try
            {
                if (!string.IsNullOrEmpty(Request.Params["userNo"]))
                {
                    string userNo = Request.Params["userNo"];
                    string sql = string.Format(@"SELECT distinct  
                                      a.[ProjectNo]
                                      ,b.[ProjectName]
                                      ,b.[ProjectManagerNo]
                                      ,c.UserName as [ProjectManagerName]
                                  FROM [CascoMountPoint].[dbo].[MyCollectionProject] as a left join [CascoMountPoint].[dbo].[tb_Project] as b
                                  on a.ProjectNo=b.ProjectNo
                                  LEFT JOIN [CascoMountPoint].[dbo].[tb_User] as c 
                                  ON b.ProjectManagerNo=c.userno
                                  where a.Status!=0 and  a.userno='{0}';", userNo);
                    DataTable dt = DbHelperSQL.Query(sql).Tables[0];
                    var query = from p in dt.AsEnumerable()
                                select new
                                {
                                    ProjectNo = p["ProjectNo"].ToString(),
                                    ProjectName = p["ProjectName"].ToString().Split('-')[1],
                                    ProjectManagerNo = p["ProjectManagerNo"].ToString(),
                                    ProjectManagerName = p["ProjectManagerName"].ToString(),
                                    //rate = getProjectRate(p["ProjectNo"].ToString())
                                    rate = 20
                                };
                    res = Json(new { rows = query, total = dt.Rows.Count, result = 'S' }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    res = RetResult("参数错误");
                }
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// <summary>
        /// 获取最近使用项目列表
        /// </summary>
        /// <returns></returns>
        public JsonResult MyRecentUseProjectList()
        {
            var res = new JsonResult();
            try
            {
                if (!string.IsNullOrEmpty(Request.Params["userNo"]))
                {
                    string userNo = Request.Params["userNo"];
                    string sql = string.Format(@" select [ProjectNo] into #table  from [CascoMountPoint].[dbo].[tb_Main] where  UserNo='{0}' and Status !=0
                                                    group by [ProjectNo]  
                                                    order by max(id);
                                                    select b.*,c.UserName from #table as a left join dbo.tb_Project  as b
                                                    on a.ProjectNo=b.ProjectNo  
                                                    left join [CascoMountPoint].[dbo].[tb_User] as c
                                                    on b.ProjectManagerNo=c.UserNo", userNo);
                    DataTable dt = DbHelperSQL.Query(sql).Tables[0];

                    var query = from p in dt.AsEnumerable()
                                select new
                                {
                                    ProjectNo = p["ProjectNo"].ToString(),
                                    ProjectName = p["ProjectName"].ToString().Split('-')[1],
                                    ProjectManagerNo = p["ProjectManagerNo"].ToString(),
                                    ProjectManagerName = p["UserName"].ToString(),
                                    //rate = getProjectRate(p["ProjectNo"].ToString())
                                    rate = 20
                                };
                    res = Json(new { rows = query, total = dt.Rows.Count, result = 'S' }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    res = RetResult("参数错误");
                }
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// 操作员工收藏项目
        /// </summary>
        /// <returns></returns>
        public JsonResult OperationCollectionProjectList()
        {
            var res = new JsonResult();
            string resultInfo = string.Empty;
            string message = string.Empty;
            try
            {
                if (!string.IsNullOrEmpty(Request.Params["userNo"]) && !string.IsNullOrEmpty(Request.Params["projectNo"]) && !string.IsNullOrEmpty(Request.Params["type"]))
                {
                    string userNo = Request.Params["userNo"];
                    string projectNo = Request.Params["projectNo"];
                    string projectName = Request.Params["projectName"];
                    string type = Request.Params["type"];
                    string sql = string.Empty;
                    if (type.Trim() == "1")
                    {
                        sql = string.Format(@"INSERT INTO [CascoMountPoint].[dbo].[MyCollectionProject]
                                             ([ProjectNo],[ProjectName] ,[UserNo],[CreateTime]) VALUES ('{0}','{1}','{2}','{3}')", projectNo, projectName, userNo, DateTime.Now);
                    }
                    else if (type.Trim() == "2")
                    {
                        sql = string.Format(@" update [CascoMountPoint].[dbo].[MyCollectionProject] set status=0 where UserNo='{1}' and projectNo='{0}'", projectNo, userNo);
                    }
                    int result = DbHelperSQL.ExecuteSql(sql);
                    if (result > 0)
                    {
                        resultInfo = "S";
                        message = "操作成功！";
                    }
                    else
                    {
                        resultInfo = "E";
                        message = "操作失败！";
                    }
                    res = Json(new { result = resultInfo, message = message }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    res = RetResult("参数错误");
                }
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// <summary>
        /// 获取安装点列表
        /// </summary>
        /// <returns></returns>
        public JsonResult GetPointList()
        {
            var res = new JsonResult();
            try
            {
                string sql = string.Format(@"SELECT * FROM [CascoMountPoint].[dbo].tb_Point WHERE status!=0");
                DataTable dt = DbHelperSQL.Query(sql).Tables[0];
                var query = from p in dt.AsEnumerable()
                            select new
                            {
                                PointCode = p["PointCode"].ToString(),
                                PointDesc = p["PointDesc"].ToString(),
                                //PointType = p["PointType"].ToString(),
                                PointTypeDesc = p["PointTypeDesc"].ToString(),
                                //PointLuJuCode = p["PointLuJuCode"].ToString(),
                                PointLuJuCodeDesc = p["PointLuJuCodeDesc"].ToString(),
                                //PointCheDuanCode = p["PointCheDuanCode"].ToString(),
                                PointCheDuanCodeDesc = p["PointCheDuanCodeDesc"].ToString()
                            };
                res = Json(new { rows = query, total = dt.Rows.Count, result = 'S' }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// <summary>
        /// 获取安装点描述模糊搜索结果
        /// </summary>
        /// <returns></returns>
        public JsonResult GetPointSearchResult()
        {
            var res = new JsonResult();
            try
            {
                if (!string.IsNullOrEmpty(Request.Params["pointDesc"]))
                {
                    string pointDesc = Request.Params["pointDesc"];
                    string sql = string.Format(@"SELECT TOP 20 * FROM [CascoMountPoint].[dbo].tb_Point WHERE status!=0 and PointDesc like '%{0}%'", pointDesc);
                    DataTable dt = DbHelperSQL.Query(sql).Tables[0];
                    var query = from p in dt.AsEnumerable()
                                select new
                                {
                                    PointCode = p["PointCode"].ToString(),
                                    PointDesc = p["PointDesc"].ToString(),
                                    // PointType = p["PointType"].ToString(),
                                    PointTypeDesc = p["PointTypeDesc"].ToString(),
                                    //PointLuJuCode = p["PointLuJuCode"].ToString(),
                                    PointLuJuCodeDesc = p["PointLuJuCodeDesc"].ToString(),
                                    //PointCheDuanCode = p["PointCheDuanCode"].ToString(),
                                    PointCheDuanCodeDesc = p["PointCheDuanCodeDesc"].ToString()
                                };
                    res = Json(new { rows = query, total = dt.Rows.Count, result = 'S' }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    res = RetResult("参数错误");
                }
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// <summary>
        /// 获取产品列表
        /// </summary>
        /// <returns></returns>
        public JsonResult GetProductList()
        {
            var res = new JsonResult();
            try
            {
                string sql = string.Format(@"SELECT * FROM [CascoMountPoint].[dbo].tb_Product WHERE status!=0");
                DataTable dt = DbHelperSQL.Query(sql).Tables[0];
                var query = from p in dt.AsEnumerable()
                            select new
                            {
                                ProductCode = p["ProductCode"].ToString(),
                                ProductDesc = p["ProductDesc"].ToString()
                            };
                res = Json(new { rows = query, total = dt.Rows.Count, result = 'S' }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// <summary>
        /// 获取项目下安装点列表
        /// </summary>
        /// <returns></returns>
        public JsonResult GetProjectPointList()
        {
            var res = new JsonResult();
            try
            {
                if (!string.IsNullOrEmpty(Request.Params["projectNo"]))
                {
                    string projectNo = Request.Params["projectNo"];
                    string sql = string.Format(@"SELECT * FROM [CascoMountPoint].[dbo].tb_ProjectAndPoint WHERE ProjectNo='{0}' AND status!=0 order by CreateTime desc", projectNo);
                    DataTable dt = DbHelperSQL.Query(sql).Tables[0];
                    var query = from p in dt.AsEnumerable()
                                select new
                                {
                                    ProjectNo = p["ProjectNo"].ToString(),
                                    PointCode = p["PointCode"].ToString(),
                                    PointDesc = p["PointDesc"].ToString()
                                };
                    res = Json(new { rows = query, total = dt.Rows.Count, result = 'S' }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    res = RetResult("参数错误");
                }
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// <summary>
        /// 获取项目下安装点信息
        /// </summary>
        /// <returns></returns>
        public JsonResult GetProjectPointInfo()
        {
            var res = new JsonResult();
            try
            {
                if (!string.IsNullOrEmpty(Request.Params["projectNo"]))
                {
                    string projectNo = Request.Params["projectNo"];
                    string sql = string.Format(@"SELECT b.* FROM [CascoMountPoint].[dbo].tb_ProjectAndPoint as a
                                                left join dbo.tb_Point as b on a.PointCode=b.PointCode
                                                WHERE ProjectNo='{0}' AND a.status!=0 order by a.CreateTime desc;
                                                SELECT * FROM [CascoMountPoint].[dbo].tb_ProjectAndProduct WHERE 
                                                ProjectNo='{0}' AND status!=0 order by CreateTime desc;", projectNo);
                    DataSet ds = DbHelperSQL.Query(sql);
                    var query = from p in ds.Tables[0].AsEnumerable()
                                select new
                                {
                                    PointCode = p["PointCode"].ToString(),
                                    PointDesc = p["PointDesc"].ToString(),
                                    PointType = p["PointType"].ToString(),
                                    PointTypeDesc = p["PointTypeDesc"].ToString(),
                                    PointLuJuCode = p["PointLuJuCode"].ToString(),
                                    PointLuJuCodeDesc = p["PointLuJuCodeDesc"].ToString(),
                                    PointCheDuanCode = p["PointCheDuanCode"].ToString(),
                                    PointCheDuanCodeDesc = p["PointCheDuanCodeDesc"].ToString()
                                };
                    var query2 = from p in ds.Tables[1].AsEnumerable()
                                 select new
                                 {
                                     ProjectNo = p["ProjectNo"].ToString(),
                                     PointCode = p["PointCode"].ToString(),
                                     ProductCode = p["ProductCode"].ToString(),
                                     ProductDesc = p["ProductDesc"].ToString()
                                 };
                    res = Json(new { rows = query, rows2 = query2, total = ds.Tables[0].Rows.Count, result = 'S' }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    res = RetResult("参数错误");
                }
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// <summary>
        /// 操作项目下安装点信息
        /// </summary>
        /// <returns></returns>
        public JsonResult SaveProjectPointInfo()
        {
            var res = new JsonResult();
            StringBuilder sb = new StringBuilder();
            string resultInfo = string.Empty;
            string message = string.Empty;
            int result = 0;
            try
            {
                if (!string.IsNullOrEmpty(Request.Params["projectNo"]) && !string.IsNullOrEmpty(Request.Params["pointCode"]) && !string.IsNullOrEmpty(Request.Params["pointDesc"]))
                {
                    string projectNo = Request.Params["projectNo"];
                    string pointCode = Request.Params["pointCode"];
                    string pointDesc = Request.Params["pointDesc"];
                    string sql = string.Format(@"SELECT * FROM [CascoMountPoint].[dbo].tb_ProjectAndPoint WHERE ProjectNo='{0}' and PointCode='{1}' AND status!=0", projectNo, pointCode);
                    DataTable dt = DbHelperSQL.Query(sql).Tables[0];
                    if (dt.Rows.Count == 0)
                    {
                        sb.AppendFormat(@"INSERT INTO [CascoMountPoint].[dbo].[tb_ProjectAndPoint]
                                       ([ProjectNo],[PointCode],[PointDesc])  VALUES ('{0}','{1}','{2}');", projectNo, pointCode, pointDesc);
                        if (sb.ToString() != "")
                        {
                            result = DbHelperSQL.ExecuteSql(sb.ToString());
                            if (result > 0)
                            {
                                resultInfo = "S";
                                message = "添加成功！";
                            }
                            else
                            {
                                resultInfo = "E";
                                message = "添加失败！";
                            }
                        }
                    }
                    else
                    {
                        resultInfo = "E";
                        message = "安装点已存在，不允许重复添加！";
                    }
                    res = Json(new { message = message, result = resultInfo }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    res = RetResult("参数错误");
                }
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// <summary>
        /// 操作项目下产品信息
        /// </summary>
        /// <returns></returns>
        public JsonResult SaveProjectProductInfo()
        {
            var res = new JsonResult();
            StringBuilder sb = new StringBuilder();
            string resultInfo = string.Empty;
            string message = string.Empty;
            int result = 0;
            try
            {
                if (!string.IsNullOrEmpty(Request.Params["projectNo"]) && !string.IsNullOrEmpty(Request.Params["productCode"]) && !string.IsNullOrEmpty(Request.Params["productDesc"]))
                {
                    string projectNo = Request.Params["projectNo"];
                    string pointCode = Request.Params["pointCode"];
                    string productCode = Request.Params["productCode"];
                    string productDesc = Request.Params["productDesc"];
                    string sql = string.Format(@"SELECT * FROM [CascoMountPoint].[dbo].tb_ProjectAndProduct WHERE ProjectNo='{0}' and pointCode='{2}' and ProductCode='{1}' AND status!=0",
                        projectNo, productCode, pointCode);
                    DataTable dt = DbHelperSQL.Query(sql).Tables[0];
                    if (dt.Rows.Count == 0)
                    {
                        sb.AppendFormat(@"INSERT INTO [CascoMountPoint].[dbo].[tb_ProjectAndProduct]
                                       ([ProjectNo],[ProductCode],[ProductDesc],[pointCode])  VALUES ('{0}','{1}','{2}','{3}');", projectNo, productCode, productDesc,pointCode);
                        if (sb.ToString() != "")
                        {
                            result = DbHelperSQL.ExecuteSql(sb.ToString());
                            if (result > 0)
                            {
                                resultInfo = "S";
                                message = "添加成功！";
                            }
                            else
                            {
                                resultInfo = "E";
                                message = "添加失败！";
                            }
                        }
                    }
                    else
                    {
                        resultInfo = "E";
                        message = "产品已存在，不允许重复添加！";
                    }
                    res = Json(new { message = message, result = resultInfo }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    res = RetResult("参数错误");
                }
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// <summary>
        /// 获取安装点下产品列表
        /// </summary>
        /// <returns></returns>
        public JsonResult GetPointProductInfo()
        {
            var res = new JsonResult();
            try
            {
                if (!string.IsNullOrEmpty(Request.Params["projectNo"]))
                {
                    string projectNo = Request.Params["projectNo"];
                    string sql = string.Format(@"SELECT * FROM [CascoMountPoint].[dbo].tb_ProjectAndProduct WHERE ProjectNo='{0}' AND status!=0 order by CreateTime desc", projectNo);
                    DataTable dt = DbHelperSQL.Query(sql).Tables[0];
                    var query = from p in dt.AsEnumerable()
                                select new
                                {
                                    ProjectNo = p["ProjectNo"].ToString(),
                                    ProductCode = p["ProductCode"].ToString(),
                                    ProductDesc = p["ProductDesc"].ToString()
                                };
                    res = Json(new { rows = query, total = dt.Rows.Count, result = 'S' }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    res = RetResult("参数错误");
                }
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// <summary>
        /// 获取物料列表
        /// </summary>
        /// <returns></returns>
        public JsonResult GetMatnrList()
        {
            var res = new JsonResult();
            try
            {
                string sql = string.Format(@"SELECT * FROM [CascoMountPoint].[dbo].W_Matnr WHERE status!=0");
                DataTable dt = DbHelperSQL.Query(sql).Tables[0];
                var query = from p in dt.AsEnumerable()
                            select new
                            {
                                MaterialNo = p["MaterialNo"].ToString(),
                                EquipmentDesc = p["EquipmentDesc"].ToString()
                            };
                res = Json(new { rows = query, total = dt.Rows.Count, result = 'S' }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// <summary>
        /// 获取物料搜索列表
        /// </summary>
        /// <returns></returns>
        public JsonResult GetMatnrSearchList()
        {
            var res = new JsonResult();
            try
            {
                if (!string.IsNullOrEmpty(Request.Params["matnrDesc"]))
                {
                    string matnrDesc = Request.Params["matnrDesc"];
                    string sql = string.Format(@"SELECT TOP 20 * FROM [CascoMountPoint].[dbo].W_Matnr WHERE status!=0 and EquipmentDesc like '%{0}%'", matnrDesc);
                    DataTable dt = DbHelperSQL.Query(sql).Tables[0];
                    var query = from p in dt.AsEnumerable()
                                select new
                                {
                                    MaterialNo = p["MaterialNo"].ToString(),
                                    EquipmentDesc = p["EquipmentDesc"].ToString()
                                };
                    res = Json(new { rows = query, total = dt.Rows.Count, result = 'S' }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    res = RetResult("参数错误");
                }
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// <summary>
        /// 获取最近使用物料列表
        /// </summary>
        /// <returns></returns>
        public JsonResult MyRecentUseMatnrList()
        {
            var res = new JsonResult();
            try
            {
                if (!string.IsNullOrEmpty(Request.Params["userNo"]))
                {
                    string userNo = Request.Params["userNo"];
                    string sql = string.Format(@"
                                              SELECT  distinct [MaterialNo] into #table
                                              FROM [CascoMountPoint].[dbo].[tb_Main] where UserNo='{0}' and Status!=0 
                                              select  top 20 a.* from [CascoMountPoint].[dbo].[W_Matnr] as a right join  #table as b
                                              on a.MaterialNo=b.MaterialNo", userNo);
                    DataTable dt = DbHelperSQL.Query(sql).Tables[0];

                    var query = from p in dt.AsEnumerable()
                                select new
                                {
                                    MaterialNo = p["MaterialNo"].ToString(),
                                    EquipmentDesc = p["EquipmentDesc"].ToString()
                                };
                    res = Json(new { rows = query, total = dt.Rows.Count, result = 'S' }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    res = RetResult("参数错误");
                }
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }
        /// <summary>
        /// 获取序列号搜索信息
        /// </summary>
        /// <returns></returns>
        public JsonResult GetSNSearchResult()
        {
            var res = new JsonResult();
            try
            {
                if (!string.IsNullOrEmpty(Request.Params["sn"]))
                {
                    string sn = Request.Params["sn"];
                    string sql = string.Format(@"SELECT * FROM [CascoMountPoint].[dbo].[tb_Equipment] where EquipmentSerialNumber='{0}' and Status!=0", sn);
                    DataTable dt = DbHelperSQL.Query(sql).Tables[0];
                    var query = from p in dt.AsEnumerable()
                                select new
                                {
                                    EquipmentSerialNumber = p["EquipmentSerialNumber"].ToString(),
                                    MaterialNo = p["MaterialNo"].ToString(),
                                    EquipmentDesc = p["EquipmentDesc"].ToString(),
                                    Datum = p["Datum"].ToString()
                                };
                    res = Json(new { rows = query, total = dt.Rows.Count, result = 'S' }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    res = RetResult("参数错误");
                }
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// <summary>
        /// 获取项目数据
        /// </summary>
        /// <returns></returns>
        public JsonResult GetProjectMainData()
        {
            var res = new JsonResult();
            try
            {
                if (!string.IsNullOrEmpty(Request.Params["projectNo"]))
                {
                    string projectNo = Request.Params["projectNo"];
                    string sql = string.Format(@"SELECT * FROM [CascoMountPoint].[dbo].[tb_Main] WHERE ProjectNo='" + projectNo + "' and Status!=0 order by CreateTime desc", projectNo);
                    DataTable dt = DbHelperSQL.Query(sql).Tables[0];
                    var query = from p in dt.AsEnumerable()
                                select new
                                {
                                    ProjectNo = p["ProjectNo"].ToString(),
                                    PointCode = p["PointCode"].ToString(),
                                    PointDesc = p["PointDesc"].ToString(),
                                    ProductCode = p["ProductCode"].ToString(),
                                    ProductDesc = p["ProductDesc"].ToString(),
                                    EquipmentSerialNumber = p["EquipmentSerialNumber"].ToString(),
                                    MaterialNo = p["MaterialNo"].ToString(),
                                    EquipmentDesc = p["EquipmentDesc"].ToString(),
                                    UserNo = p["UserNo"].ToString(),
                                    CreateTime = p["CreateTime"].ToString()
                                };
                    res = Json(new { rows = query, total = dt.Rows.Count, result = 'S' }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    res = RetResult("参数错误");
                }
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// <summary>
        /// 获取项目产品下数据
        /// </summary>
        /// <returns></returns>
        public JsonResult GetProjectProductMainData()
        {
            var res = new JsonResult();
            try
            {
                if (!string.IsNullOrEmpty(Request.Params["projectNo"]) && !string.IsNullOrEmpty(Request.Params["pointCode"])
                    && !string.IsNullOrEmpty(Request.Params["prductCode"]))
                {
                    string projectNo = Request.Params["projectNo"];
                    string pointCode = Request.Params["pointCode"];
                    string prductCode = Request.Params["prductCode"];
                    string sql = string.Format(@"SELECT * FROM [CascoMountPoint].[dbo].[tb_Main] WHERE 
                                               ProjectNo='{0}' and PointCode='{1}' and ProductCode='{2}' and Status!=0 order by CreateTime desc", projectNo, pointCode, prductCode);
                    DataTable dt = DbHelperSQL.Query(sql).Tables[0];
                    var query = from p in dt.AsEnumerable()
                                select new
                                {
                                    ProjectNo = p["ProjectNo"].ToString(),
                                    PointCode = p["PointCode"].ToString(),
                                    PointDesc = p["PointDesc"].ToString(),
                                    ProductCode = p["ProductCode"].ToString(),
                                    ProductDesc = p["ProductDesc"].ToString(),
                                    EquipmentSerialNumber = p["EquipmentSerialNumber"].ToString(),
                                    MaterialNo = p["MaterialNo"].ToString(),
                                    EquipmentDesc = p["EquipmentDesc"].ToString(),
                                    UserNo = p["UserNo"].ToString(),
                                    CreateTime = p["CreateTime"].ToString()
                                };
                    res = Json(new { rows = query, total = dt.Rows.Count, result = 'S' }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    res = RetResult("参数错误");
                }
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// <summary>
        /// 获取项目产品调试列表
        /// </summary>
        /// <returns></returns>
        public JsonResult GetProjectProductDebugList()
        {
            var res = new JsonResult();
            try
            {
                if (!string.IsNullOrEmpty(Request.Params["productCode"]) && !string.IsNullOrEmpty(Request.Params["projectNo"]))
                {
                    string productCode = Request.Params["productCode"];
                    string projectNo = Request.Params["projectNo"];
                    string sql = string.Format(@"SELECT * FROM [CascoMountPoint].[dbo].MyProjectProductRecSheet 
                                                  where status!=0 and ProjectNo='{0}' and ProductCode='{1}'", projectNo, productCode);
                    DataSet ds = DbHelperSQL.Query(sql);
                    var query = from p in ds.Tables[0].AsEnumerable()
                                select new
                                {
                                    ProjectNo = p["ProjectNo"].ToString(),
                                    ProductCode = p["ProductCode"].ToString(),
                                    RecordSheetCode = p["RecordSheetCode"].ToString(),
                                    RecordSheetVersion = p["RecordSheetVersion"].ToString(),
                                    CreateTime = p["CreateTime"].ToString(),
                                    CreateUser = p["CreateUser"].ToString()
                                };
                    res = Json(new { rows = query, total = ds.Tables[0].Rows.Count, result = 'S' }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    res = RetResult("参数错误");
                }
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// <summary>
        /// 获取项目站点产品调试列表
        /// </summary>
        /// <returns></returns>
        public JsonResult GetProjectPointProductDebugList()
        {
            var res = new JsonResult();
            try
            {
                if (!string.IsNullOrEmpty(Request.Params["productCode"]) && !string.IsNullOrEmpty(Request.Params["projectNo"]) && !string.IsNullOrEmpty(Request.Params["pointCode"]))
                {
                    string productCode = Request.Params["productCode"];
                    string projectNo = Request.Params["projectNo"];
                    string pointCode = Request.Params["pointCode"];
                    string sql = string.Format(@"SELECT b.* FROM [CascoMountPoint].[dbo].MyProjectProductRecSheet as a
                                                left join [CascoMountPoint].[dbo].RecordSheetMain as b on
                                                a.RecordSheetCode+b.RecordSheetVersion=b.RecordSheetCode+b.RecordSheetVersion
                                                where ProjectNo='{0}' and ProuctCode='{1}' and a.Status!=0;
                                                SELECT * FROM [CascoMountPoint].[dbo].[RecordSheetResultProcess] 
                                                  where status!=0 and ProjectNo='{0}' and pointcode='{2}' and productCode='{1}'", projectNo, productCode, pointCode);
                    DataSet ds = DbHelperSQL.Query(sql);
                    var query = from p in ds.Tables[0].AsEnumerable()
                                select new
                                {
                                    ProuctCode = p["ProuctCode"].ToString(),
                                    OrderNo = p["OrderNo"].ToString(),
                                    TypeId = p["TypeId"].ToString(),
                                    RecordSheetCode = p["RecordSheetCode"].ToString(),
                                    RecordSheetName = p["RecordSheetName"].ToString(),
                                    RecordSheetVersion = p["RecordSheetVersion"].ToString(),
                                    ItemType = p["ItemType"].ToString()
                                };
                    var query2 = from p in ds.Tables[1].AsEnumerable()
                                 select new
                                 {
                                     // ProuctCode = p["ProuctCode"].ToString(),
                                     //CreateTime = Convert.ToDateTime(p["CreateTime"]).ToString("yyyy-MM-dd"),
                                     //CreateUser = p["CreateUser"].ToString(),
                                     // SubTime = Convert.ToDateTime(p["SubTime"]).ToString("yyyy-MM-dd"),
                                     //SubUser = p["SubUser"].ToString(),
                                     ID = p["ID"].ToString(),
                                     RecordSheetCode = p["RecordSheetCode"].ToString(),
                                     RecordSheetVersion = p["RecordSheetVersion"].ToString(),
                                     CreateUser = p["CreateUser"].ToString(),
                                     CreateTime = Convert.ToDateTime(p["CreateTime"].ToString()).ToString("yyyy.MM.dd")
                                 };
                    res = Json(new { rows = query, rows2 = query2, total = ds.Tables[0].Rows.Count, result = 'S' }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    res = RetResult("参数错误");
                }
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// <summary>
        /// 操作项目产品调试列表
        /// </summary>
        /// <returns></returns>
        public JsonResult SaveProjectProductDebugList()
        {
            var res = new JsonResult();
            StringBuilder sb = new StringBuilder();
            string resultInfo = string.Empty;
            string message = string.Empty;
            int result = 0;
            try
            {
                if (!string.IsNullOrEmpty(Request.Params["data"]))
                {
                    string json = Request.Params["data"];
                    RecordListItem[] datas = JsonConvert.DeserializeObject<RecordListItem[]>(json);
                    sb.AppendFormat(@"UPDATE [CascoMountPoint].[dbo].[MyProjectProductRecSheet] SET 
                                     [Status] = '0' WHERE ProjectNo='{0}' and ProductCode='{1}';", datas[0].ProjectNo, datas[0].ProductCode);
                    foreach (RecordListItem data in datas)
                    {
                        sb.AppendFormat(@"INSERT INTO [CascoMountPoint].[dbo].[MyProjectProductRecSheet]
                                       ([ProjectNo],[ProductCode],[RecordSheetCode],[CreateUser],[RecordSheetVersion])
                                       VALUES ('{0}','{1}','{2}','{3}','{4}');", data.ProjectNo, data.ProductCode, data.RecordSheetCode, data.CreateUser, data.RecordSheetVersion);
                    }
                    if (sb.ToString() != "")
                    {
                        result = DbHelperSQL.ExecuteSql(sb.ToString());
                        if (result > 0)
                        {
                            resultInfo = "S";
                            message = "操作成功！";
                        }
                        else
                        {
                            resultInfo = "E";
                            message = "添加失败！";
                        }
                    }
                    res = Json(new { message = message, result = resultInfo }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    res = RetResult("参数错误");
                }
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// <summary>
        /// 获取最新产品调试列表
        /// </summary>
        /// <returns></returns>
        public JsonResult GetProductDebugList()
        {
            var res = new JsonResult();
            try
            {
                if (!string.IsNullOrEmpty(Request.Params["productCode"]))
                {
                    string productCode = Request.Params["productCode"];
                    string sql = string.Format(@"SELECT * FROM [CascoMountPoint].[dbo].[RecordSheetMain] where ProuctCode='{0}' and Status!=0", productCode);
                    DataTable dt = DbHelperSQL.Query(sql).Tables[0];
                    var query = from p in dt.AsEnumerable()
                                select new
                                {
                                    ProuctCode = p["ProuctCode"].ToString(),
                                    OrderNo = p["OrderNo"].ToString(),
                                    TypeId = p["TypeId"].ToString(),
                                    RecordSheetCode = p["RecordSheetCode"].ToString(),
                                    RecordSheetName = p["RecordSheetName"].ToString(),
                                    RecordSheetVersion = p["RecordSheetVersion"].ToString(),
                                    ItemType = p["ItemType"].ToString()
                                };
                    res = Json(new { rows = query, total = dt.Rows.Count, result = 'S' }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    res = RetResult("参数错误");
                }
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// <summary>
        /// 获取调试列表项信息
        /// </summary>
        /// <returns></returns>
        public JsonResult GetProductDebugInfo()
        {
            var res = new JsonResult();
            try
            {
                if (!string.IsNullOrEmpty(Request.Params["RecordSheetCode"]))
                {
                    string RecordSheetCode = Request.Params["RecordSheetCode"];
                    string sql = string.Format(@"SELECT * FROM [CascoMountPoint].[dbo].[RecordSheetItem] where RecordSheetCode='{0}' and Status!=0;
                                                 SELECT * FROM [CascoMountPoint].[dbo].[RecordSheetItemSub] where  Status!=0", RecordSheetCode);
                    DataSet ds = DbHelperSQL.Query(sql);
                    var query = from p in ds.Tables[0].AsEnumerable()
                                select new
                                {
                                    //ProuctCode = p["ProuctCode"].ToString().Replace("-",""),
                                    ID = p["ID"].ToString(),
                                    OrderNo = p["OrderNo"].ToString(),
                                    Type = p["Type"].ToString(),
                                    HeadDescription = p["HeadDescription"].ToString(),
                                    Description = p["Description"].ToString()
                                };
                    var query2 = from p in ds.Tables[1].AsEnumerable()
                                 select new
                                 {
                                     ID = p["ID"].ToString(),
                                     OrderNo = p["OrderNo"].ToString(),
                                     Type = p["Type"].ToString(),
                                     Description = p["Description"].ToString()
                                 };
                    res = Json(new { rows = query, rows2 = query2, total = ds.Tables[0].Rows.Count, result = 'S' }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    res = RetResult("参数错误");
                }
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// <summary>
        /// 获取调试列表项选项信息
        /// </summary>
        /// <returns></returns>
        public JsonResult GetProductDebugItemInfo()
        {
            var res = new JsonResult();
            try
            {
                if (!string.IsNullOrEmpty(Request.Params["Type"]))
                {
                    string Type = Request.Params["Type"];
                    string sql = string.Format(@"SELECT * FROM [CascoMountPoint].[dbo].[RecordSheetItemSub] where Type='{0}' and Status!=0", Type);
                    DataTable dt = DbHelperSQL.Query(sql).Tables[0];
                    var query = from p in dt.AsEnumerable()
                                select new
                                {
                                    OrderNo = p["OrderNo"].ToString(),
                                    Type = p["Type"].ToString(),
                                    Description = p["Description"].ToString()
                                };
                    res = Json(new { rows = query, total = dt.Rows.Count, result = 'S' }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    res = RetResult("参数错误");
                }
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// <summary>
        /// 获取记录表结果信息
        /// </summary>
        /// <returns></returns>
        public JsonResult GetProductDebugResultInfo()
        {
            var res = new JsonResult();
            try
            {
                if (!string.IsNullOrEmpty(Request.Params["ID"]))
                {
                    string ID = Request.Params["ID"];
                    string sql = string.Format(@"SELECT a.*,b.*
                                                 FROM [CascoMountPoint].[dbo].[RecordSheetResult]  as a
                                                left join [CascoMountPoint].[dbo].[RecordSheetResultProcess] as b 
                                                on a.ProcessId=b.ID 
                                                where ProcessId='{0}' and a.Status!=0;", ID);
                    DataTable dt = DbHelperSQL.Query(sql).Tables[0];
                    var query = from p in dt.AsEnumerable()
                                select new
                                {
                                    ProcessId = p["ProcessId"].ToString(),
                                    ItemId = p["ItemId"].ToString(),
                                    ItemSubId = p["ItemSubId"].ToString(),
                                    PMTime = p["PMTime"].ToString(),
                                    PMName = p["PMName"].ToString(),
                                    SubTime = p["SubTime"].ToString(),
                                    SubUser = p["SubUser"].ToString(),
                                    CreateUser = p["CreateUser"].ToString(),
                                    CreateTime = p["CreateTime"].ToString(),
                                    Image = p["Image"].ToString(),
                                    Remark = p["Remark"].ToString()
                                };
                    res = Json(new { rows = query, total = dt.Rows.Count, result = 'S' }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    res = RetResult("参数错误");
                }
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// <summary>
        /// 保存图像信息
        /// </summary>
        /// <returns></returns>
        public JsonResult SaveImageInfo()
        {
            var res = new JsonResult();
            string picStr = string.Empty;
            try
            {
                if (!string.IsNullOrEmpty(Request.Params["Type"]) && !string.IsNullOrEmpty(Request.Params["id"]))
                {
                    string Type = Request.Params["Type"];
                    string id = Request.Params["id"];
                    Stream input = Request.Files["file"].InputStream;
                    string name = Request.Files["file"].FileName;
                    //byte[] b = new byte[input.Length];
                    //input.Read(b, 0, (int)input.Length);
                    string sql = string.Format(@"UPDATE [CascoMountPoint].[dbo].MyCollectionProject SET imagesName='{1}' WHERE [ProjectNo]='{0}'", id, name);
                    int result = DbHelperSQL.ExecuteSql(sql);
                    //二进制转成图片保存  
                    System.Drawing.Image image = System.Drawing.Image.FromStream(input);
                    string imagepath = Server.MapPath(string.Format("/uploadfile/{0}", name));
                    image.Save(imagepath);
                    res = Json(new { rows = result, result = 'S' }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    res = RetResult("参数错误");
                }
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// <summary>
        /// 下载图像信息
        /// </summary>
        /// <returns></returns>
        public JsonResult DownloadImageInfo()
        {
            var res = new JsonResult();
            string url = string.Empty;
            try
            {
                string sql = string.Format(@"SELECT *  FROM [CascoMountPoint].[dbo].[MyCollectionProject]");
                DataTable dt = DbHelperSQL.Query(sql).Tables[0];
                if (dt.Rows.Count > 0)
                {
                    url = "http://" + Request.Url.Host + ":" + Request.Url.Port + string.Format("/uploadfile/{0}", dt.Rows[0]["imagesName"]);
                }
                res = Json(new { url = url, result = 'S' }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// <summary>
        /// 检查用户合法性
        /// </summary>
        /// <returns></returns>
        public JsonResult CheckUserADPass()
        {
            var res = new JsonResult();
            string resultInfo = string.Empty;
            string message = string.Empty;
            try
            {
                if (!string.IsNullOrEmpty(Request.Params["userNo"]) && !string.IsNullOrEmpty(Request.Params["userPass"]))
                {
                    string userNo = Request.Params["userNo"];
                    string userPass = Request.Params["userPass"];
                    string sql = string.Empty;
                    string domain = ConfigurationManager.AppSettings["CascoLDAPPath"];
                    bool result = ADhelper.CheckUserADPass(domain, userNo, userPass);
                    if (result)
                    {
                        sql = string.Format(@"SELECT *  FROM [CascoMountPoint].[dbo].[tb_User] where Status!=0 and UserNo='{0}'", userNo);
                        DataSet ds = DbHelperSQL.Query(sql);
                        var query = from p in ds.Tables[0].AsEnumerable()
                                    select new
                                    {
                                        UserNo = p["UserNo"].ToString(),
                                        userPass = userPass,
                                        UserName = p["UserName"].ToString(),
                                        UserDept = p["UserDept"].ToString(),
                                        UserImmediate = p["UserImmediate"].ToString()
                                    };

                        resultInfo = "S";
                        message = "登录成功！";
                        res = Json(new { result = resultInfo, userdataInfo = query, message = message }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        resultInfo = "E";
                        message = "工号或密码错误！";
                        res = Json(new { result = resultInfo, message = message }, JsonRequestBehavior.AllowGet);
                    }

                }
                else
                {
                    res = RetResult("参数错误");
                }
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// <summary>
        /// 获取用户信息
        /// </summary>
        /// <returns></returns>
        public JsonResult GetUserInfo()
        {
            var res = new JsonResult();
            try
            {
                if (!string.IsNullOrEmpty(Request.Params["userNo"]))
                {
                    string userNo = Request.Params["userNo"];
                    string sql = string.Format(@"SELECT *  FROM [CascoMountPoint].[dbo].[tb_User] where Status!=0 and UserNo='{0}'", userNo);
                    DataSet ds = DbHelperSQL.Query(sql);
                    var query = from p in ds.Tables[0].AsEnumerable()
                                select new
                                {
                                    UserNo = p["UserNo"].ToString(),
                                    UserName = p["UserName"].ToString(),
                                    UserDept = p["UserDept"].ToString(),
                                    UserImmediate = p["UserImmediate"].ToString()
                                };

                    res = Json(new { rows = query, total = ds.Tables[0].Rows.Count, result = 'S' }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    res = RetResult("参数错误");
                }
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// <summary>
        /// 获取组织机构信息
        /// </summary>
        /// <returns></returns>
        public JsonResult GetOrganizationUserInfo()
        {
            var res = new JsonResult();
            try
            {

                string sql = string.Format(@"SELECT DisplayName
                                              FROM [hr].[dbo].[CompanyDepartment] 
                                              where IsDelete!=1 and Type='1'   order by Sequence;
                                            SELECT a.DisplayName,c.Name,c.DomainAccount,c.Sex,Mobile,c.Telephone
                                              FROM [hr].[dbo].[CompanyDepartment] as a left join dbo.UserDept as b 
                                              on a.Id=b.DeptId
                                              left join dbo.UserInfo as c
                                              on b.UserId=c.Id
                                              where a.IsDelete!=1 and Type='1' and c.IsDelete!=1  order by Sequence,DomainAccount");
                DataSet ds = DbHelperSQL.RunSql(sql);
                var query = from p in ds.Tables[0].AsEnumerable()
                            select new
                            {
                                DisplayName = p["DisplayName"].ToString()

                            };
                var query2 = from p in ds.Tables[1].AsEnumerable()
                             select new
                             {
                                 DisplayName = p["DisplayName"].ToString(),
                                 Name = p["Name"].ToString(),
                                 DomainAccount = p["DomainAccount"].ToString().Replace(@"casco\", ""),
                                 Sex = p["Sex"].ToString().Trim() == "0" ? "男" : "女",
                                 Mobile = p["Mobile"].ToString(),
                                 Telephone = p["Telephone"].ToString()
                             };
                res = Json(new { rows = query, rows2 = query2, total = ds.Tables[0].Rows.Count, result = 'S' }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }
        /// <summary>
        /// 企业号验证并且获取userId
        /// </summary>
        /// <returns></returns>
        public JsonResult GetQYUserId()
        {
            var res = new JsonResult();
            string resultInfo = string.Empty;
            string message = string.Empty;
            string userId = string.Empty;
            try
            {
                if (!string.IsNullOrEmpty(Request.Params["openid"]) && !string.IsNullOrEmpty(Request.Params["openid"]))
                {
                    string openid = Request.Params["openid"];
                    ConvertToUserIdResult result = NotifyUtilityQY.GetConvertToUserIdResult(openid);
                    if (result != null && result.userid != "")
                    {
                        resultInfo = "S";
                        message = "验证成功！";
                        userId = result.userid;
                    }
                    else
                    {
                        resultInfo = "E";
                        message = "验证失败！";
                    }
                    res = Json(new { result = resultInfo, message = message, userId = userId }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    res = RetResult("参数错误");
                }
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// <summary>
        /// 上传安装地数据
        /// </summary>
        /// <returns></returns>
        public JsonResult SaveProjectPointEQInfo()
        {
            var res = new JsonResult();
            List<String> SQLStringList = new List<string>();
            string resultInfo = string.Empty;
            string message = string.Empty;
            int result = 0;
            try
            {
                Stream input = Request.InputStream;
                byte[] b = new byte[input.Length];
                input.Read(b, 0, (int)input.Length);
                string json = Encoding.UTF8.GetString(b);//解码
                if (json != "")
                {
                    List<PointInfoListItem> datas = JsonConvert.DeserializeObject<List<PointInfoListItem>>(json);
                    if (datas.Count <= 0)
                    {
                        res = RetResult("请上传数据");
                        return res;
                    }
                    foreach (PointInfoListItem data in datas)
                    {
                        string sqlStr = string.Empty;
                        // 查询当前某列是否存在于数据库 T_REIMBURSE_PROJECT_INFO 表中
                        if (data.EquipmentSerialNumber.ToString().Trim() != "")
                        {
                            sqlStr = @"select * from tb_Main where ProjectNo = '{0}' and EquipmentSerialNumber='{1}' and Status!=0";
                            sqlStr = string.Format(sqlStr, data.ProjectNo.ToString(), data.EquipmentSerialNumber.ToString().Trim());
                        }
                        else
                        {
                            sqlStr = @"select * from tb_Main where ProjectNo = '{0}' and PointCode='{1}' and ProductCode='{2}' and Status!=0";
                            sqlStr = string.Format(sqlStr, data.ProjectNo.ToString(), data.PointCode.ToString(), data.ProductCode.ToString());
                        }
                        DataSet dss = Maticsoft.DBUtility.DbHelperSQL.Query(sqlStr);
                        string updateOrInsertSql = "";
                        if (dss.Tables[0].Rows.Count != 0)
                        {
                            updateOrInsertSql = @" UPDATE tb_Main set Status='0'  where projectNo = '{0}' and EquipmentSerialNumber='{1}';";
                            updateOrInsertSql = string.Format(updateOrInsertSql, data.ProjectNo.ToString(), data.EquipmentSerialNumber.ToString().Trim());
                            result = Maticsoft.DBUtility.DbHelperSQL.ExecuteSql(updateOrInsertSql);

                        }
                        updateOrInsertSql = @" insert into tb_Main (ProjectNo,PointCode,PointDesc,ProductCode,
                                               ProductDesc,EquipmentSerialNumber,MaterialNo,EquipmentDesc,Quantity,UserNo,
                                               CreateTime,Status,YesOrNoSparePart,Category,OpenDate) Values('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','1','{11}','{12}','{13}');";
                        updateOrInsertSql = string.Format(updateOrInsertSql, data.ProjectNo.ToString(), data.PointCode.ToString(), data.PointDesc.ToString()
                            , data.ProductCode.ToString(), data.ProductDesc.ToString(), data.EquipmentSerialNumber.ToString(), data.MaterialNo.ToString(), data.EquipmentDesc.ToString(),
                            1, data.UserNo, DateTime.Now, "", "99", "");
                        SQLStringList.Add(updateOrInsertSql);
                    }
                    if (SQLStringList.Count > 0)
                    {
                        result = Maticsoft.DBUtility.DbHelperSQL.ExecuteSqlTran(SQLStringList);
                        if (result > 0)
                        {
                            resultInfo = "S";
                            message = "上传成功！";
                        }
                        else
                        {
                            resultInfo = "E";
                            message = "上传失败！";
                        }
                    }
                    res = Json(new { message = message, result = resultInfo }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    res = RetResult("参数错误");
                }
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// <summary>
        /// 上传安装调试数据
        /// </summary>
        /// <returns></returns>
        public JsonResult SaveRecordSheetResultInfo()
        {
            var res = new JsonResult();
            List<String> SQLStringList = new List<string>();
            string resultInfo = string.Empty;
            string message = string.Empty;
            int result = 0;
            string ID = string.Empty; ;
            try
            {
                Stream input = Request.InputStream;
                byte[] b = new byte[input.Length];
                input.Read(b, 0, (int)input.Length);
                string json = Encoding.UTF8.GetString(b);//解码
                if (json != "")
                {
                    RecordSheetResultProcess data = JsonConvert.DeserializeObject<RecordSheetResultProcess>(json);
                    if (data.ProjectNo == "")
                    {
                        res = RetResult("请上传数据");
                        return res;
                    }
                    string sqlStr = string.Empty;
                    sqlStr = @"select * from RecordSheetResultProcess where ProjectNo = '{0}' and PointCode='{1}' and ProductCode='{2}' and RecordSheetCode='{3}' and RecordSheetVersion='{4}' and Status!=0";
                    sqlStr = string.Format(sqlStr, data.ProjectNo.ToString(), data.PointCode.ToString(), data.ProductCode.ToString(), data.RecordSheetCode.ToString(), data.RecordSheetVersion.ToString());
                    DataSet dss = Maticsoft.DBUtility.DbHelperSQL.Query(sqlStr);
                    string updateOrInsertSql = "";
                    if (dss.Tables[0].Rows.Count != 0)
                    {
                        ID = dss.Tables[0].Rows[0]["ID"].ToString();
                        updateOrInsertSql = @" UPDATE RecordSheetResultProcess set CreateTime='{1}',CreateUser='{2}'  where ID = {0};";
                        updateOrInsertSql = string.Format(updateOrInsertSql, ID, DateTime.Now, data.CreateUser);
                        result = Maticsoft.DBUtility.DbHelperSQL.ExecuteSql(updateOrInsertSql);

                    }
                    else
                    {
                        updateOrInsertSql = @" insert into RecordSheetResultProcess (ProjectNo,PointCode,ProductCode,RecordSheetCode,
                                               RecordSheetVersion,CreateTime,CreateUser,SubTime,SubUser,PMTime,PMName) Values('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}');";
                        updateOrInsertSql = string.Format(updateOrInsertSql, data.ProjectNo.ToString(), data.PointCode.ToString(), data.ProductCode.ToString(), data.RecordSheetCode.ToString()
                            , data.RecordSheetVersion.ToString(), DateTime.Now, data.CreateUser.ToString(), DateTime.Now, data.SubUser, "", "");
                        result = Maticsoft.DBUtility.DbHelperSQL.ExecuteSql(updateOrInsertSql);
                        if (result > 0)
                        {
                            ID = Maticsoft.DBUtility.DbHelperSQL.GetMaxIDNew("ID", "RecordSheetResultProcess").ToString();
                        }
                        else
                        {
                            res = RetResult("数据上传错误，请联系管理员");
                            return res;
                        }
                    }
                    foreach (RecordSheetResult item in data.Item)
                    {
                        string sqlStr2 = string.Empty;
                        sqlStr2 = @"select ID from RecordSheetResult where ProcessId = '{0}' and ItemId='{1}'  and Status!=0";
                        sqlStr2 = string.Format(sqlStr, ID, item.ItemId.ToString());
                        DataSet dss2 = Maticsoft.DBUtility.DbHelperSQL.Query(sqlStr);
                        if (dss2.Tables[0].Rows.Count != 0)
                        {
                            updateOrInsertSql = @" UPDATE RecordSheetResult set Status='0'  where ProcessId = {0} and ItemId={1} ;";
                            updateOrInsertSql = string.Format(updateOrInsertSql, ID, item.ItemId.ToString());
                            result = Maticsoft.DBUtility.DbHelperSQL.ExecuteSql(updateOrInsertSql);
                        }
                        updateOrInsertSql = @" insert into RecordSheetResult (ProcessId,ItemId,ItemSubId,Image,
                                               Remark,CreateTime,CreateUser,CreateName) Values('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}');";
                        updateOrInsertSql = string.Format(updateOrInsertSql, ID, item.ItemId.ToString(), item.ItemSubId.ToString()
                            , item.Image.ToString(), item.Remark.ToString(), DateTime.Now, item.CreateUser.ToString(), item.CreateName.ToString());
                        SQLStringList.Add(updateOrInsertSql);
                    }

                    if (SQLStringList.Count > 0)
                    {
                        result = Maticsoft.DBUtility.DbHelperSQL.ExecuteSqlTran(SQLStringList);
                        if (result > 0)
                        {
                            resultInfo = "S";
                            message = "上传成功！";
                        }
                        else
                        {
                            resultInfo = "E";
                            message = "上传失败！";
                        }
                    }
                    res = Json(new { message = message, result = resultInfo }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    res = RetResult("参数错误");
                }
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// <summary>
        /// PM确认安装调试数据
        /// </summary>
        /// <returns></returns>
        public JsonResult PMRecordSheetResultInfo()
        {
            var res = new JsonResult();
            string resultInfo = string.Empty;
            string message = string.Empty;
            int result = 0;
            string ID = string.Empty; ;
            try
            {
                if (!string.IsNullOrEmpty(Request.Params["data"]))
                {
                    string json = Request.Params["data"];
                    PMRecordSheetResultProcess[] datas = JsonConvert.DeserializeObject<PMRecordSheetResultProcess[]>(json);
                    if (datas.Length <= 0)
                    {
                        res = RetResult("请上传数据");
                        return res;
                    }
                    foreach (PMRecordSheetResultProcess data in datas)
                    {
                        string sqlStr = string.Empty;
                        sqlStr = @"select * from RecordSheetResultProcess where ProjectNo = '{0}' and PointCode='{1}' and ProductCode='{2}' and RecordSheetCode='{3}' and RecordSheetVersion='{4}' and Status!=0";
                        sqlStr = string.Format(sqlStr, data.ProjectNo.ToString(), data.PointCode.ToString(), data.ProductCode.ToString(), data.RecordSheetCode.ToString(), data.RecordSheetVersion.ToString());
                        DataSet dss = Maticsoft.DBUtility.DbHelperSQL.Query(sqlStr);
                        string updateOrInsertSql = "";
                        if (dss.Tables[0].Rows.Count != 0)
                        {
                            ID = dss.Tables[0].Rows[0]["ID"].ToString();
                            updateOrInsertSql = @" UPDATE RecordSheetResultProcess set PMTime='{2}',PMName='{1}'  where ID = '{0}';";
                            updateOrInsertSql = string.Format(updateOrInsertSql, data.ID.ToString(), data.PMName.ToString(), ID);
                            result = Maticsoft.DBUtility.DbHelperSQL.ExecuteSql(updateOrInsertSql);
                            if (result > 0)
                            {
                                resultInfo = "S";
                                message = "确认成功！";
                            }
                            else
                            {
                                resultInfo = "E";
                                message = "确认失败！";
                            }

                        }
                        else
                        {
                            res = RetResult("未找到该数据，请联系管理员");
                            return res;
                        }
                    }
                    res = Json(new { message = message, result = resultInfo }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    res = RetResult("参数错误");
                }
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// <summary>
        /// 获取K2发货项目列表
        /// </summary>
        /// <returns></returns>
        public JsonResult MyK2AdviceDeliveryProjectList()
        {
            var res = new JsonResult();
            try
            {
                if (!string.IsNullOrEmpty(Request.Params["userNo"]))
                {
                    string userNo = Request.Params["userNo"];
                    string sql = string.Format(@"SELECT *  FROM [Platform_Casco].[dbo].[AUTO_BIZ_Casco.Process_AdviceDelivery_1_T_AdviceDelivery]
                                                where (Emp_Id='{0}' or projectNo in (SELECT ProjectNumber FROM [Platform_Casco_BusinessData].[dbo].[T_REIMBURSE_PROJECT_INFO] where ProjectManager='{0}') )
                                                and ProcessStatus!=0 order by Form_Date desc", userNo.Trim());
                    DataSet ds = DbHelperSQL.RunK2Sql(sql);
                    var query = from p in ds.Tables[0].AsEnumerable()
                                select new
                                {
                                    ProcInstId = p["ProcInstId"].ToString(),
                                    Form_Code = p["Form_Code"].ToString(),
                                    Emp_Id = p["Emp_Id"].ToString(),
                                    Emp_Name = p["Emp_Name"].ToString(),
                                    Emp_SectionId = p["Emp_SectionId"].ToString(),
                                    projectNo = p["projectNo"].ToString(),
                                    ProjectName = p["ProjectName"].ToString(),
                                    MountingPointsDesc = p["MountingPointsDesc"].ToString(),
                                    MountingPoints = p["MountingPoints"].ToString(),
                                    ReceivingPartyName = p["ReceivingPartyName"].ToString(),
                                    DeliveryAddress = p["DeliveryAddress"].ToString(),
                                    ProductCategoriesName = p["ProductCategoriesName"].ToString(),
                                    Process_Status = p["Process_Status"].ToString(),
                                    ProcessStatus = p["ProcessStatus"].ToString(),
                                    Remarks = p["Remarks"].ToString(),
                                    Purpose = p["Purpose"].ToString(),
                                    CargoReceiver = p["CargoReceiver"].ToString(),
                                    PhoneNumber = p["PhoneNumber"].ToString(),
                                    City = p["City"].ToString(),
                                    Postcodes = p["Postcodes"].ToString(),
                                    ShippingPoint = p["ShippingPoint"].ToString(),
                                    PlannedMdate = p["PlannedMdate"].ToString()
                                };
                    res = Json(new { rows = query, total = ds.Tables[0].Rows.Count, result = 'S' }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    res = RetResult("参数错误");
                }
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// <summary>
        /// 获取K2发货信息
        /// </summary>
        /// <returns></returns>
        public JsonResult MyK2AdviceDeliveryInfo()
        {
            var res = new JsonResult();
            try
            {
                if (!string.IsNullOrEmpty(Request.Params["ProcInstId"]))
                {
                    string ProcInstId = Request.Params["ProcInstId"];
                    string sql = string.Format(@"SELECT *
                                                  FROM [Platform_Casco].[dbo].[AUTO_BIZ_Casco.Process_AdviceDelivery_1_T_AdviceDelivery] where ProcInstId='{0}';
                                                SELECT *
                                                  FROM [Platform_Casco].[dbo].[AUTO_BIZ_Casco.Process_AdviceDelivery_1_T_AdviceDelivery_T_Material_Info] where ProcInstId='{0}';
                                                SELECT *
                                                  FROM [Platform_Casco].[dbo].[AUTO_BIZ_Casco.Process_AdviceDelivery_1_T_AdviceDelivery_T_Tracking_Info] where ProcInstId='{0}';", ProcInstId.Trim());
                    DataSet ds = DbHelperSQL.RunK2Sql(sql);
                    var query = from p in ds.Tables[0].AsEnumerable()
                                select new
                                {
                                    ProcInstId = p["ProcInstId"].ToString(),
                                    Form_Code = p["Form_Code"].ToString(),
                                    Emp_Id = p["Emp_Id"].ToString(),
                                    Emp_Name = p["Emp_Name"].ToString(),
                                    Emp_SectionId = p["Emp_SectionId"].ToString(),
                                    projectNo = p["projectNo"].ToString(),
                                    ProjectName = p["ProjectName"].ToString(),
                                    MountingPointsDesc = p["MountingPointsDesc"].ToString(),
                                    MountingPoints = p["MountingPoints"].ToString(),
                                    ReceivingPartyName = p["ReceivingPartyName"].ToString(),
                                    DeliveryAddress = p["DeliveryAddress"].ToString(),
                                    ProductCategoriesName = p["ProductCategoriesName"].ToString(),
                                    Process_Status = p["Process_Status"].ToString(),
                                    ProcessStatus = p["ProcessStatus"].ToString(),
                                    Remarks = p["Remarks"].ToString(),
                                    Purpose = p["Purpose"].ToString(),
                                    CargoReceiver = p["CargoReceiver"].ToString(),
                                    PhoneNumber = p["PhoneNumber"].ToString(),
                                    City = p["City"].ToString(),
                                    Postcodes = p["Postcodes"].ToString(),
                                    ShippingPoint = p["ShippingPoint"].ToString(),
                                    PlannedMdate = p["PlannedMdate"].ToString()
                                };
                    var query1 = from p in ds.Tables[1].AsEnumerable()
                                 select new
                                 {
                                     ProcInstId = p["ProcInstId"].ToString(),
                                     Materials_Number = p["Materials_Number"].ToString(),
                                     Materials_Name = p["Materials_Name"].ToString(),
                                     Unit = p["Unit"].ToString(),
                                     DeliveryMode = p["DeliveryMode"].ToString(),
                                     Purchase_Quantity = p["Purchase_Quantity"].ToString(),
                                     Need_Time = p["Need_Time"].ToString(),
                                     ERPNumber = p["ERPNumber"].ToString(),
                                     Factory = p["Factory"].ToString()
                                 };
                    var query2 = from p in ds.Tables[2].AsEnumerable()
                                 select new
                                 {
                                     ProcInstId = p["ProcInstId"].ToString(),
                                     ERPNumber = p["ERPNumber"].ToString(),
                                     TrackingNumber = p["TrackingNumber"].ToString(),
                                     TrackingRemarks = p["TrackingRemarks"].ToString()
                                 };
                    res = Json(new { rows = query, rows1 = query1, rows2 = query2, total = ds.Tables[0].Rows.Count, result = 'S' }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    res = RetResult("参数错误");
                }
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }

        /// <summary>
        /// 获取物流信息
        /// </summary>
        /// <returns></returns>
        public JsonResult GetLogisticsTrackingInfo()
        {
            var res = new JsonResult();
            string json = string.Empty;
            try
            {
                if (!string.IsNullOrEmpty(Request.Params["ProcInstId"]))
                {
                    Tracking.logisticsTracking track = new Tracking.logisticsTracking();
                    string ProcInstId = Request.Params["ProcInstId"];
                    json = track.getLTRecordBySN(ProcInstId);
                    res = Json(new { rows = json, result = 'S' }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    res = RetResult("参数错误");
                }
            }
            catch (Exception ex)
            {
                res = RetResult(ex.Message);
            }
            return res;
        }


    }
}
