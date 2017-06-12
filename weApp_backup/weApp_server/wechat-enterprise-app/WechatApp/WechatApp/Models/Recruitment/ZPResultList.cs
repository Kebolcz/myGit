using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Easy4net.CustomAttributes;

namespace WechatApp.Models
{
    public class ZPResultList
    {
        public string UserID { get; set; }
        public List<ZPResult> Scores { get; set; }

    }
}