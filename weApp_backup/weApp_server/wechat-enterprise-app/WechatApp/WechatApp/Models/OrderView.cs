using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WechatApp.Models
{
    public class OrderView
    {
        public string Guid { get; set; }

        public string Person { get; set; }

        public string Car { get; set; }

        public string Driver { get; set; }

        public string BegTime { get; set; }

        public string Origin { get; set; }

        public string Destination { get; set; }

        public string JourneyStatus { get; set; }

        public string Content { get; set; }
    }
}
