using Senparc.Weixin.QY.AdvancedAPIs;
using Senparc.Weixin.QY.CommonAPIs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Configuration;
using Senparc.Weixin.QY.AdvancedAPIs.Mass;
using Senparc.Weixin.QY.AdvancedAPIs.MailList;
using Senparc.Weixin.QY.Entities;

namespace WechatApp.Tools
{
    public class NotifyUtilityQY
    {
        static string appId = ConfigurationManager.AppSettings["AppId"].ToString();
        static string appSecret = ConfigurationManager.AppSettings["AppSecret"].ToString();

        public NotifyUtilityQY()
        {
            //注册
            //AccessTokenContainer.Register(appId, appSecret);
        }

        /// <summary>
        /// 发送消息
        /// </summary>
        /// <returns></returns>
        public static bool SendTplMessage(string toUser, string toParty, string toTag, string agentId, List<Article> data)
        {
            bool flag = true;
            try
            {
                string accessToken = AccessTokenContainer.TryGetToken(appId, appSecret);
                //string accessToken = Senparc.Weixin.QY.CommonAPIs.CommonApi.GetToken(appId, appSecret).access_token;
                MassResult massRest = MassApi.SendNews(accessToken, toUser, toParty, toTag, agentId, data, 0, 100000);
                if (massRest.errcode != Senparc.Weixin.ReturnCode_QY.请求成功)
                {
                    flag = false;
                }
            }
            catch (Exception ex)
            {
                flag = false;
            }
            return flag;
        }

        /// <summary>
        /// 发送文本消息
        /// </summary>
        /// <returns></returns>
        public static bool SendTextMessage(string toUser, string toParty, string toTag, string agentId, string data)
        {
            bool flag = true;
            try
            {
                string accessToken = AccessTokenContainer.TryGetToken(appId, appSecret);
                //string accessToken = Senparc.Weixin.QY.CommonAPIs.CommonApi.GetToken(appId, appSecret).access_token;
                MassResult massRest = MassApi.SendText(accessToken, toUser, toParty, toTag, agentId, data, 0, 100000);
                if (massRest.errcode != Senparc.Weixin.ReturnCode_QY.请求成功)
                {
                    flag = false;
                }
            }
            catch (Exception ex)
            {
                flag = false;
            }
            return flag;
        }

        /// <summary>
        /// 获取成员信息
        /// </summary>
        /// <returns></returns>
        public static GetMemberResult GetUserInfo(string userId)
        {
            GetMemberResult massRest = null;
            try
            {
                string accessToken = AccessTokenContainer.TryGetToken(appId, appSecret);
                //string accessToken = Senparc.Weixin.QY.CommonAPIs.CommonApi.GetToken(appId, appSecret).access_token;
                massRest = MailListApi.GetMember(accessToken, userId);
                if (massRest.errcode != Senparc.Weixin.ReturnCode_QY.请求成功)
                {
                    massRest = null;
                }
            }
            catch (Exception ex)
            {
                massRest = null;
            }
            return massRest;
        }

        /// <summary>
        /// 获取成员信息并且判断是否关注，如果未关注邀请关注
        /// </summary>
        /// <returns></returns>
        public static bool GetUserYesOrNoFollow(string userId)
        {
            bool result = false;
            try
            {
                string accessToken = AccessTokenContainer.TryGetToken(appId, appSecret);
                //string accessToken = Senparc.Weixin.QY.CommonAPIs.CommonApi.GetToken(appId, appSecret).access_token;
                GetMemberResult massRest = MailListApi.GetMember(accessToken, userId);
                if (massRest.errcode != Senparc.Weixin.ReturnCode_QY.请求成功)
                {
                    result = false;
                    if (massRest.status == 4)
                    {
                        InviteMemberResult invite = MailListApi.InviteMember(accessToken, userId);
                        if (invite.errcode != Senparc.Weixin.ReturnCode_QY.请求成功)
                        {
                            result = false;
                        }
                    }
                }
                else
                {
                    result = true;
                }
            }
            catch (Exception ex)
            {
                result = false;
            }
            return result;
        }

        /// <summary>
        /// 获取部门列表
        /// </summary>
        /// <returns></returns>
        public static GetDepartmentListResult GetDepartmentList(int id)
        {
            GetDepartmentListResult massRest = null;
            try
            {
                string accessToken = AccessTokenContainer.TryGetToken(appId, appSecret);
                //string accessToken = Senparc.Weixin.QY.CommonAPIs.CommonApi.GetToken(appId, appSecret).access_token;
                massRest = MailListApi.GetDepartmentList(accessToken, id);
                if (massRest.errcode != Senparc.Weixin.ReturnCode_QY.请求成功)
                {
                    massRest = null;
                }
            }
            catch (Exception ex)
            {
                massRest = null;
            }
            return massRest;
        }

        /// <summary>
        /// 获取部门成员列表
        /// </summary>
        /// <returns></returns>
        public static GetDepartmentMemberInfoResult GetDepartmentMember(int departmentId, int fetchChild, int status)
        {
            GetDepartmentMemberInfoResult massRest = null;
            try
            {
                string accessToken = AccessTokenContainer.TryGetToken(appId, appSecret);
                //string accessToken = Senparc.Weixin.QY.CommonAPIs.CommonApi.GetToken(appId, appSecret).access_token;
                massRest = MailListApi.GetDepartmentMemberInfo(accessToken, departmentId, fetchChild, status);
                if (massRest.errcode != Senparc.Weixin.ReturnCode_QY.请求成功)
                {
                    massRest = null;
                }
            }
            catch (Exception ex)
            {
                massRest = null;
            }
            return massRest;
        }

        /// <summary>
        /// 获取openId转userId
        /// </summary>
        /// <returns></returns>
        public static ConvertToUserIdResult GetConvertToUserIdResult(string openId)
        {
            ConvertToUserIdResult massRest = null;
            try
            {
                string accessToken = AccessTokenContainer.TryGetToken(appId, appSecret);
                 accessToken = Senparc.Weixin.QY.CommonAPIs.CommonApi.GetToken(appId, appSecret).access_token;
                massRest = Senparc.Weixin.QY.CommonAPIs.CommonApi.ConvertToUserId(accessToken, openId);
                if (massRest.errcode != Senparc.Weixin.ReturnCode_QY.请求成功)
                {
                    massRest = null;
                }
            }
            catch (Exception ex)
            {
                massRest = null;
            }
            return massRest;
        }

    }
}