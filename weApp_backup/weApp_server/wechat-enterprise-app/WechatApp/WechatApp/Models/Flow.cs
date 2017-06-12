using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Easy4net.CustomAttributes;

namespace WechatApp.Models
{
    [Table(Name = "FeedbackFlows")]
    public class Flow
    {
        [Id(Name = "id", Strategy = GenerationType.INDENTITY)]
        public int Id { get; set; }

        [Column(Name = "person")]
        public string Person { get; set; }

        [Column(Name = "lesson")]
        public string Lesson { get; set; }

        [Column(Name = "guid")]
        public string Guid { get; set; }

        [Column(Name = "transfer")]
        public string Transfer { get; set; }
    }
}