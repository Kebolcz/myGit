using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Easy4net;
using Easy4net.CustomAttributes;

namespace WechatApp.Models
{
    [Table(Name = "BA_UserInfo")]
    public class UserInfo
    {
        [Id(Name = "ID", Strategy = GenerationType.INDENTITY)]
        public int Id { get; set; }

        [Column(Name = "UserName")]
        public string UserName { get; set; }

        [Column(Name = "UserSex")]
        public string UserSex { get; set; }

        [Column(Name = "UserAge")]
        public string UserAge { get; set; }

        [Column(Name = "UserPhone")]
        public string UserPhone { get; set; }
        [Column(Name = "AddTime")]
        public DateTime AddTime { get; set; }
        [Column(Name = "Status")]
        public string Status { get; set; }
        [Column(Name = "UserDegree")]
        public string UserDegree { get; set; }
        [Column(Name = "UserSchool")]
        public string UserSchool { get; set; }
        [Column(Name = "UserMajor")]
        public string UserMajor { get; set; }
    }
}