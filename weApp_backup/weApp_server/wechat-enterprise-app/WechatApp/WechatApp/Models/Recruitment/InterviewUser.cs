using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Easy4net.CustomAttributes;
namespace WechatApp.Models
{
    [Table(Name = "BA_InterviewUser")]
    public class InterviewUser
    {
        [Id(Name = "ID", Strategy = GenerationType.INDENTITY)]
        public int Id { get; set; }

        [Column(Name = "UserID")]
        public int? UserID { get; set; }

        [Column(Name = "UserNo")]
        public string UserNo { get; set; }

        [Column(Name = "UserName")]
        public string UserName { get; set; }

        [Column(Name = "Status")]
        public string Status { get; set; }
        [Column(Name = "IsPost")]
        public string IsPost { get; set; }
        [Column(Name = "Type")]
        public string Type { get; set; }
    }
}