using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace WechatApp.Tools
{
    public class JsSdkUtility
    {
        Random m_rnd = new Random();
        char getRandomChar()
        {
            int ret = m_rnd.Next(122);
            while (ret < 48 || (ret > 57 && ret < 65) || (ret > 90 && ret < 97))
            {
                ret = m_rnd.Next(122);
            }
            return (char)ret;
        }
        public string getRandomString(int length)
        {
            StringBuilder sb = new StringBuilder(length);
            for (int i = 0; i < length; i++)
            {
                sb.Append(getRandomChar());
            }
            return sb.ToString();
        }     
    }
}