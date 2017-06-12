using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Easy4net.CustomAttributes;
namespace WechatApp.Models
{
    [Table(Name = "BA_Interviewer")]
    public class InterViewer
    {
        [Id(Name = "ID", Strategy = GenerationType.INDENTITY)]
        public int Id { get; set; }

        [Column(Name = "Type")]
        public int Type { get; set; }

        [Column(Name = "UserNo")]
        public string UserNo { get; set; }

        [Column(Name = "UserName")]
        public string UserName { get; set; }

        [Column(Name = "Status")]
        public string Status { get; set; }

    }
}