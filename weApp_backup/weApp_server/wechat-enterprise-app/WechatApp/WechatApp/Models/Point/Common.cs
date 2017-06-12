using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WechatApp.Models.Point
{
    /// <summary>
    /// 项目设置产品调试记录表
    /// </summary>
    public class RecordListItem
    {
        public string ProjectNo;
        public string ProductCode;
        public string RecordSheetCode;
        public string CreateUser;
        public string RecordSheetVersion;
    }
    /// <summary>
    /// 安装点上传结构
    /// </summary>
    public class PointInfoListItem
    {
        public string ProjectNo;
        public string PointCode;
        public string PointDesc;
        public string ProductCode;
        public string ProductDesc;
        public string EquipmentSerialNumber;
        public string MaterialNo;
        public string EquipmentDesc;
        public string UserNo;
        public string Category;
    }

    /// <summary>
    /// 调试记录表主数据
    /// </summary>
    public class RecordSheetResultProcess
    {
        public string ProjectNo;
        public string PointCode;
        public string ProductCode;
        public string RecordSheetCode;
        public string RecordSheetVersion;
        public string CreateTime;
        public string CreateUser;
        public string SubTime;
        public string SubUser;
        public string PMTime;
        public string PMName;
        public List<RecordSheetResult> Item;
    }

    /// <summary>
    /// 调试记录表主数据
    /// </summary>
    public class PMRecordSheetResultProcess
    {
        public string ID;
        public string ProjectNo;
        public string PointCode;
        public string ProductCode;
        public string RecordSheetCode;
        public string RecordSheetVersion;
        public string PMTime;
        public string PMName;
    }

    /// <summary>
    /// 调试记录表结果数据
    /// </summary>
    public class RecordSheetResult
    {
        public string ProcessId;
        public string ItemId;
        public string ItemSubId;
        public string CreateUser;
        public string CreateName;
        public string Remark;
        public string Image;
    }
    public class RecordListHead
    {
        public List<RecordListItem> Item;
        public string RecordSheetCode;
    }
}