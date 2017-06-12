using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WechatApp.Models
{
    public class DeptUserList
    {
        public List<DepartmentListInfo> department { get; set; }

        /// <summary>
        /// 成员列表
        /// </summary>
        public List<UserList> userlist { get; set; }

    }
    public class DepartmentListInfo
    {
        /// <summary>
        /// 部门id
        /// </summary>
        public int id { get; set; }
        /// <summary>
        /// 部门名称
        /// </summary>
        public string name { get; set; }
        /// <summary>
        /// 上级部门id
        /// </summary>
        public int parentid { get; set; }
        /// <summary>
        /// 在父部门中的次序值。order值小的排序靠前。
        /// </summary>
        public int order { get; set; }
    }
    public class UserList
    {
        /// <summary>
        /// 员工UserID
        /// </summary>
        public string userid { get; set; }
        /// <summary>
        /// 成员名称
        /// </summary>
        public string name { get; set; }

        /// <summary>
        /// 成员所属部门id列表
        /// </summary>
        public int[] department { get; set; }

        /// <summary>
        /// 关注状态: 1=已关注，2=已冻结，4=未关注 
        /// </summary>
        public int status { get; set; }
    }
}