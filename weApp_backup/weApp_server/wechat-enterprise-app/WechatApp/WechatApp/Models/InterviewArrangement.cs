using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Easy4net.CustomAttributes;
namespace WechatApp.Models
{
    [Table(Name = "BA_InterviewArrangement")]
    public class InterviewArrangement
    {
        [Id(Name = "ID", Strategy = GenerationType.INDENTITY)]
        public int Id { get; set; }

        [Column(Name = "UserId")]
        public int UserId { get; set; }

        [Column(Name = "CreateTime")]
        public DateTime CreateTime { get; set; }

        [Column(Name = "InterviewTime")]
        public DateTime InterviewTime { get; set; }

        [Column(Name = "InterviewPlace")]
        public string InterviewPlace { get; set; }
        [Column(Name = "Remarks")]
        public string Remarks { get; set; }

    }
    public class InterviewArrangementList
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime CreateTime { get; set; }
        public DateTime InterviewTime { get; set; }
        public string InterviewPlace { get; set; }
        public string Remarks { get; set; }
        public string UserNo { get; set; }
        public List<InterviewUser> Users { get; set; }

    }
}