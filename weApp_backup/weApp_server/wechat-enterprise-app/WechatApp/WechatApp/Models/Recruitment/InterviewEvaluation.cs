using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Easy4net.CustomAttributes;
namespace WechatApp.Models
{
    [Table(Name = "BA_InterviewEvaluation")]
    public class InterviewEvaluation
    {
        [Id(Name = "ID", Strategy = GenerationType.INDENTITY)]
        public int Id { get; set; }

        [Column(Name = "QuestionID")]
        public int? QuestionID { get; set; }

        [Column(Name = "Score")]
        public string Score { get; set; }

        [Column(Name = "CreateTime")]
        public DateTime CreateTime { get; set; }
        [Column(Name = "UserPosition")]
        public string UserPosition { get; set; }
        [Column(Name = "Evaluation")]
        public string Evaluation { get; set; }
        [Column(Name = "MSEvaluation")]
        public string MSEvaluation { get; set; }
        [Column(Name = "Assessment")]
        public string Assessment { get; set; }
        [Column(Name = "UserID")]
        public int? UserID { get; set; }

        [Column(Name = "Type")]
        public int? Type { get; set; }

    }
}