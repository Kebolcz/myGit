using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Easy4net.CustomAttributes;
namespace WechatApp.Models
{

    public class InterviewResult
    {

        public int Id { get; set; }
        public int? UserID { get; set; }
        public string UserNo { get; set; }
        public string UserName { get; set; }
        public string Status { get; set; }
        public string Assessment { get; set; }
        public string Evaluation { get; set; }
        public string MSEvaluation { get; set; }
        public string Type { get; set; }

    }
}