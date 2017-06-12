using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Easy4net.CustomAttributes;

namespace WechatApp.Models
{
    [Table(Name = "Tails")]
    public class Tail
    {
        [Id(Name = "id", Strategy = GenerationType.INDENTITY)]
        public int Id { get; set; }

        [Column(Name = "number")]
        public string Number { get; set; }

        [Column(Name = "day")]
        public string Day { get; set; }
    }
}