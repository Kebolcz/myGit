using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Easy4net.CustomAttributes;

namespace WechatApp.Models
{
    [Table(Name = "BA_ZPResult")]
    public class ZPResult
    {
        [Id(Name = "ID", Strategy = GenerationType.INDENTITY)]
        public int ID { get; set; }

        [Column(Name = "UserID")]
        public string UserID { get; set; }

        [Column(Name = "QuestionID")]
        public int? QuestionID { get; set; }

        [Column(Name = "Score")]
        public int? Score { get; set; }

        [Column(Name = "AddTime")]
        public DateTime AddTime { get; set; }

    }
}