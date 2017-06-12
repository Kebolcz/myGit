using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Easy4net.CustomAttributes;
namespace WechatApp.Models
{
    [Table(Name = "BA_Log")]
    public class InterviewLog
    {
        [Id(Name = "ID", Strategy = GenerationType.INDENTITY)]
        public int Id { get; set; }

        [Column(Name = "UserID")]
        public int? UserID { get; set; }

        [Column(Name = "UserNo")]
        public string UserNo { get; set; }

        [Column(Name = "AddTime")]
        public DateTime AddTime { get; set; }

        [Column(Name = "Result")]
        public string Result { get; set; }

        [Column(Name = "Remark")]
        public string Remark { get; set; }

    }
}