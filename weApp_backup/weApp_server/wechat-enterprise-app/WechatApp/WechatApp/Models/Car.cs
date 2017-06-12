using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Easy4net.CustomAttributes;

namespace WechatApp.Models
{
    [Table(Name = "Cars")]
    public class Car
    {
        [Id(Name = "id", Strategy = GenerationType.INDENTITY)]
        public int Id { get; set; }

        [Column(Name = "name")]
        public string Name { get; set; }

        [Column(Name = "number")]
        public string Number { get; set; }

        [Column(Name = "seat")]
        public string Seat { get; set; }

        [Column(Name = "picture")]
        public string Picture { get; set; }
    }
}