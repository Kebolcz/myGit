using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Easy4net.CustomAttributes;

namespace WechatApp.Models
{

    [Table(Name = "BA_Formula")]
    public class Formula
    {
        [Id(Name = "ID", Strategy = GenerationType.INDENTITY)]
        public int ID { get; set; }
        [Column(Name = "Type")]
        public int? Type { get; set; }
        [Column(Name = "OrderNO")]
        public int? OrderNO { get; set; }
        [Column(Name = "Description")]
        public string Description { get; set; }
        [Column(Name = "FormulaDesc")]
        public string FormulaDesc { get; set; }
        [Column(Name = "Score")]
        public string Score { get; set; }

    }
}