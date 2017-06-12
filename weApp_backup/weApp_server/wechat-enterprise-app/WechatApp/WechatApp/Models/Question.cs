using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Easy4net.CustomAttributes;
namespace WechatApp.Models
{
    [Table(Name = "BA_Questions")]
    public class Question
    {
        [Id(Name = "ID", Strategy = GenerationType.INDENTITY)]
        public int Id { get; set; }

        [Column(Name = "OrderNo")]
        public string OrderNo { get; set; }

        [Column(Name = "Type")]
        public int? Type { get; set; }

        [Column(Name = "Description")]
        public string Description { get; set; }

        [Column(Name = "Status")]
        public string Status { get; set; }

    }
}