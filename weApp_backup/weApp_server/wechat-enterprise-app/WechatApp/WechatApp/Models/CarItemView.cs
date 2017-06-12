using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WechatApp.Models
{
    public class CarItemView
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public string Number { get; set; }
        public string Picture { get; set; }
        public string Seat { get; set; }

        public List<OrderView> Orders { get; set; }
        public JourneyView Journey { get; set; }
        public bool Limited { get; set; }
    }
}