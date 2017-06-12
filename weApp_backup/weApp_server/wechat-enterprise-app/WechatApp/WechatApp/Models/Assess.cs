using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Easy4net.CustomAttributes;

namespace WechatApp.Models
{
    [Table(Name = "FeedbackData")]
    public class Assess
    {
        [Id(Name = "id", Strategy = GenerationType.INDENTITY)]
        public int Id { get; set; }

        [Column(Name = "flowid")]
        public string FlowId { get; set; }

        [Column(Name = "seqno")]
        public int? Seqno { get; set; }

        [Column(Name = "kpi")]
        public string Kpi { get; set; }

        [Column(Name = "seqnr")]
        public string Seqnr { get; set; }

        [Column(Name = "score")]
        public int? Score { get; set; }

        [Column(Name = "transfer")]
        public string Transfer { get; set; }
    }
}