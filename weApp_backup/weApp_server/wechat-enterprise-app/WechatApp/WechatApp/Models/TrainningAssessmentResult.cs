using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WechatApp.Models
{
    public class TrainningAssessmentResult
    {
        public string Lesson { get; set; }

        public string Person { get; set; }

        public string Guid { get; set; }

        public List<Assess> Scores { get; set; }
    }
}