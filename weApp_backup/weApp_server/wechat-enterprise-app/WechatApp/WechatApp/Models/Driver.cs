using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Easy4net.CustomAttributes;

namespace WechatApp.Models
{
    [Table(Name = "drivers")]
    public class Driver
    {
        [Id(Name = "id")]
        public int Id { get; set; }

        [Column(Name = "name")]
        public string Name { get; set; }

        [Column(Name = "tel")]
        public string Tel { get; set; }

        [Column(Name = "carid")]
        public int CarId { get; set; }

    }
}