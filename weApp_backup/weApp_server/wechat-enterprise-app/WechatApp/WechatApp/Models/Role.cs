using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Easy4net.CustomAttributes;

namespace WechatApp.Models
{
    [Table(Name = "Roles")]
    public class Role
    {
        [Id(Name = "id", Strategy = GenerationType.INDENTITY)]
        public int Id { get; set; }

        [Column(Name = "role")]
        public string role { get; set; }

        [Column(Name = "value")]
        public string Value { get; set; }
    }
}