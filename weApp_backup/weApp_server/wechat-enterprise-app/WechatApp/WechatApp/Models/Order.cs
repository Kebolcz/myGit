using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Easy4net.CustomAttributes;

namespace WechatApp.Models
{
    [Table(Name = "Orders")]
    public class Order
    {
        [Id(Name = "guid", Strategy = GenerationType.GUID)]
        public string Guid { get; set; }

        [Column(Name = "person")]
        public string Person { get; set; }

        [Column(Name = "car")]
        public string Car { get; set; }

        [Column(Name = "driver")]
        public int? Driver { get; set; }

        [Column(Name = "begtime")]
        public string BegTime { get; set; }

        [Column(Name = "origin")]
        public string Origin { get; set; }

        [Column(Name = "destination")]
        public string Destination { get; set; }
    }
}