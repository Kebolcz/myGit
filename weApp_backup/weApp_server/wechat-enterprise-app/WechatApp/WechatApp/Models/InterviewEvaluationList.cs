using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Easy4net.CustomAttributes;
namespace WechatApp.Models
{

    public class InterviewEvaluationList
    {
        public string UserID { get; set; }
        public string UserNo { get; set; }
        public List<InterviewEvaluation> Scores { get; set; }

    }
}