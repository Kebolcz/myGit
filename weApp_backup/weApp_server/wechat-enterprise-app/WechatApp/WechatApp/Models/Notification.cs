using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WechatApp.Models
{
    public class Notification
    {
        public string Title { get; set; }

        public DateTime PublishDate { get; set; }

        public bool HasImage { get; set; }

    }
}