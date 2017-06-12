using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Easy4net.CustomAttributes;

namespace WechatApp.Models
{
    [Table(Name = "Journeys")]
    public class Journey
    {
        [Id(Name = "id", Strategy = GenerationType.INDENTITY)]
        public int Id { get; set; }

        [Column(Name = "orderid")]
        public string OrderId { get; set; }

        [Column(Name = "origin")]
        public string Origin { get; set; }

        [Column(Name = "destination")]
        public string Destination { get; set; }

        [Column(Name = "begtime")]
        public string BegTime { get; set; }

        [Column(Name = "endtime")]
        public string EndTime { get; set; }

        [Column(Name = "status")]
        public string Status { get; set; }
    }
}