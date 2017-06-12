﻿//------------------------------------------------------------------------------
// <auto-generated>
//     此代码由工具生成。
//     运行时版本:4.0.30319.18444
//
//     对此文件的更改可能会导致不正确的行为，并且如果
//     重新生成代码，这些更改将会丢失。
// </auto-generated>
//------------------------------------------------------------------------------

// 
// 此源代码是由 Microsoft.VSDesigner 4.0.30319.18444 版自动生成。
// 
#pragma warning disable 1591

namespace WechatApp.MossAnnouncement {
    using System;
    using System.Web.Services;
    using System.Diagnostics;
    using System.Web.Services.Protocols;
    using System.Xml.Serialization;
    using System.ComponentModel;
    
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.0.30319.18408")]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Web.Services.WebServiceBindingAttribute(Name="ServiceSoap", Namespace="http://tempuri.org/")]
    public partial class Service : System.Web.Services.Protocols.SoapHttpClientProtocol {
        
        private System.Threading.SendOrPostCallback GetListDataOperationCompleted;
        
        private System.Threading.SendOrPostCallback GetDetailsDataOperationCompleted;
        
        private bool useDefaultCredentialsSetExplicitly;
        
        /// <remarks/>
        public Service() {
            this.Url = global::WechatApp.Properties.Settings.Default.WechatApp_MossAnnouncement_Service;
            if ((this.IsLocalFileSystemWebService(this.Url) == true)) {
                this.UseDefaultCredentials = true;
                this.useDefaultCredentialsSetExplicitly = false;
            }
            else {
                this.useDefaultCredentialsSetExplicitly = true;
            }
        }
        
        public new string Url {
            get {
                return base.Url;
            }
            set {
                if ((((this.IsLocalFileSystemWebService(base.Url) == true) 
                            && (this.useDefaultCredentialsSetExplicitly == false)) 
                            && (this.IsLocalFileSystemWebService(value) == false))) {
                    base.UseDefaultCredentials = false;
                }
                base.Url = value;
            }
        }
        
        public new bool UseDefaultCredentials {
            get {
                return base.UseDefaultCredentials;
            }
            set {
                base.UseDefaultCredentials = value;
                this.useDefaultCredentialsSetExplicitly = true;
            }
        }
        
        /// <remarks/>
        public event GetListDataCompletedEventHandler GetListDataCompleted;
        
        /// <remarks/>
        public event GetDetailsDataCompletedEventHandler GetDetailsDataCompleted;
        
        /// <remarks/>
        [System.Web.Services.Protocols.SoapDocumentMethodAttribute("http://tempuri.org/GetListData", RequestNamespace="http://tempuri.org/", ResponseNamespace="http://tempuri.org/", Use=System.Web.Services.Description.SoapBindingUse.Literal, ParameterStyle=System.Web.Services.Protocols.SoapParameterStyle.Wrapped)]
        public HomePageCenterEntity[] GetListData(int ShowNum, int LatelyForAFewDays) {
            object[] results = this.Invoke("GetListData", new object[] {
                        ShowNum,
                        LatelyForAFewDays});
            return ((HomePageCenterEntity[])(results[0]));
        }
        
        /// <remarks/>
        public void GetListDataAsync(int ShowNum, int LatelyForAFewDays) {
            this.GetListDataAsync(ShowNum, LatelyForAFewDays, null);
        }
        
        /// <remarks/>
        public void GetListDataAsync(int ShowNum, int LatelyForAFewDays, object userState) {
            if ((this.GetListDataOperationCompleted == null)) {
                this.GetListDataOperationCompleted = new System.Threading.SendOrPostCallback(this.OnGetListDataOperationCompleted);
            }
            this.InvokeAsync("GetListData", new object[] {
                        ShowNum,
                        LatelyForAFewDays}, this.GetListDataOperationCompleted, userState);
        }
        
        private void OnGetListDataOperationCompleted(object arg) {
            if ((this.GetListDataCompleted != null)) {
                System.Web.Services.Protocols.InvokeCompletedEventArgs invokeArgs = ((System.Web.Services.Protocols.InvokeCompletedEventArgs)(arg));
                this.GetListDataCompleted(this, new GetListDataCompletedEventArgs(invokeArgs.Results, invokeArgs.Error, invokeArgs.Cancelled, invokeArgs.UserState));
            }
        }
        
        /// <remarks/>
        [System.Web.Services.Protocols.SoapDocumentMethodAttribute("http://tempuri.org/GetDetailsData", RequestNamespace="http://tempuri.org/", ResponseNamespace="http://tempuri.org/", Use=System.Web.Services.Description.SoapBindingUse.Literal, ParameterStyle=System.Web.Services.Protocols.SoapParameterStyle.Wrapped)]
        public DetailsEntity GetDetailsData(int ID) {
            object[] results = this.Invoke("GetDetailsData", new object[] {
                        ID});
            return ((DetailsEntity)(results[0]));
        }
        
        /// <remarks/>
        public void GetDetailsDataAsync(int ID) {
            this.GetDetailsDataAsync(ID, null);
        }
        
        /// <remarks/>
        public void GetDetailsDataAsync(int ID, object userState) {
            if ((this.GetDetailsDataOperationCompleted == null)) {
                this.GetDetailsDataOperationCompleted = new System.Threading.SendOrPostCallback(this.OnGetDetailsDataOperationCompleted);
            }
            this.InvokeAsync("GetDetailsData", new object[] {
                        ID}, this.GetDetailsDataOperationCompleted, userState);
        }
        
        private void OnGetDetailsDataOperationCompleted(object arg) {
            if ((this.GetDetailsDataCompleted != null)) {
                System.Web.Services.Protocols.InvokeCompletedEventArgs invokeArgs = ((System.Web.Services.Protocols.InvokeCompletedEventArgs)(arg));
                this.GetDetailsDataCompleted(this, new GetDetailsDataCompletedEventArgs(invokeArgs.Results, invokeArgs.Error, invokeArgs.Cancelled, invokeArgs.UserState));
            }
        }
        
        /// <remarks/>
        public new void CancelAsync(object userState) {
            base.CancelAsync(userState);
        }
        
        private bool IsLocalFileSystemWebService(string url) {
            if (((url == null) 
                        || (url == string.Empty))) {
                return false;
            }
            System.Uri wsUri = new System.Uri(url);
            if (((wsUri.Port >= 1024) 
                        && (string.Compare(wsUri.Host, "localHost", System.StringComparison.OrdinalIgnoreCase) == 0))) {
                return true;
            }
            return false;
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.34234")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://tempuri.org/")]
    public partial class HomePageCenterEntity {
        
        private string listTitleField;
        
        private string listUrlField;
        
        private string listDateField;
        
        private string listNumField;
        
        private int titleLengthField;
        
        private int listDayField;
        
        private string detailUrlField;
        
        private string itemUrlField;
        
        private string titleColorField;
        
        private string issuedByField;
        
        private int itemIDField;
        
        /// <remarks/>
        public string ListTitle {
            get {
                return this.listTitleField;
            }
            set {
                this.listTitleField = value;
            }
        }
        
        /// <remarks/>
        public string ListUrl {
            get {
                return this.listUrlField;
            }
            set {
                this.listUrlField = value;
            }
        }
        
        /// <remarks/>
        public string ListDate {
            get {
                return this.listDateField;
            }
            set {
                this.listDateField = value;
            }
        }
        
        /// <remarks/>
        public string ListNum {
            get {
                return this.listNumField;
            }
            set {
                this.listNumField = value;
            }
        }
        
        /// <remarks/>
        public int TitleLength {
            get {
                return this.titleLengthField;
            }
            set {
                this.titleLengthField = value;
            }
        }
        
        /// <remarks/>
        public int ListDay {
            get {
                return this.listDayField;
            }
            set {
                this.listDayField = value;
            }
        }
        
        /// <remarks/>
        public string DetailUrl {
            get {
                return this.detailUrlField;
            }
            set {
                this.detailUrlField = value;
            }
        }
        
        /// <remarks/>
        public string ItemUrl {
            get {
                return this.itemUrlField;
            }
            set {
                this.itemUrlField = value;
            }
        }
        
        /// <remarks/>
        public string TitleColor {
            get {
                return this.titleColorField;
            }
            set {
                this.titleColorField = value;
            }
        }
        
        /// <remarks/>
        public string IssuedBy {
            get {
                return this.issuedByField;
            }
            set {
                this.issuedByField = value;
            }
        }
        
        /// <remarks/>
        public int ItemID {
            get {
                return this.itemIDField;
            }
            set {
                this.itemIDField = value;
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.34234")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://tempuri.org/")]
    public partial class PolicyAttachment {
        
        private string nameField;
        
        private string fileNameField;
        
        private string attachmentUrlField;
        
        /// <remarks/>
        public string Name {
            get {
                return this.nameField;
            }
            set {
                this.nameField = value;
            }
        }
        
        /// <remarks/>
        public string FileName {
            get {
                return this.fileNameField;
            }
            set {
                this.fileNameField = value;
            }
        }
        
        /// <remarks/>
        public string AttachmentUrl {
            get {
                return this.attachmentUrlField;
            }
            set {
                this.attachmentUrlField = value;
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.34234")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://tempuri.org/")]
    public partial class DetailsEntity {
        
        private string titleField;
        
        private string issuedDateField;
        
        private string authorField;
        
        private string typeField;
        
        private string imageUrlField;
        
        private string imageField;
        
        private string contentField;
        
        private string attachmentField;
        
        private PolicyAttachment[] attachmentMoreField;
        
        /// <remarks/>
        public string Title {
            get {
                return this.titleField;
            }
            set {
                this.titleField = value;
            }
        }
        
        /// <remarks/>
        public string IssuedDate {
            get {
                return this.issuedDateField;
            }
            set {
                this.issuedDateField = value;
            }
        }
        
        /// <remarks/>
        public string Author {
            get {
                return this.authorField;
            }
            set {
                this.authorField = value;
            }
        }
        
        /// <remarks/>
        public string Type {
            get {
                return this.typeField;
            }
            set {
                this.typeField = value;
            }
        }
        
        /// <remarks/>
        public string ImageUrl {
            get {
                return this.imageUrlField;
            }
            set {
                this.imageUrlField = value;
            }
        }
        
        /// <remarks/>
        public string Image {
            get {
                return this.imageField;
            }
            set {
                this.imageField = value;
            }
        }
        
        /// <remarks/>
        public string Content {
            get {
                return this.contentField;
            }
            set {
                this.contentField = value;
            }
        }
        
        /// <remarks/>
        public string Attachment {
            get {
                return this.attachmentField;
            }
            set {
                this.attachmentField = value;
            }
        }
        
        /// <remarks/>
        public PolicyAttachment[] AttachmentMore {
            get {
                return this.attachmentMoreField;
            }
            set {
                this.attachmentMoreField = value;
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.0.30319.18408")]
    public delegate void GetListDataCompletedEventHandler(object sender, GetListDataCompletedEventArgs e);
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.0.30319.18408")]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    public partial class GetListDataCompletedEventArgs : System.ComponentModel.AsyncCompletedEventArgs {
        
        private object[] results;
        
        internal GetListDataCompletedEventArgs(object[] results, System.Exception exception, bool cancelled, object userState) : 
                base(exception, cancelled, userState) {
            this.results = results;
        }
        
        /// <remarks/>
        public HomePageCenterEntity[] Result {
            get {
                this.RaiseExceptionIfNecessary();
                return ((HomePageCenterEntity[])(this.results[0]));
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.0.30319.18408")]
    public delegate void GetDetailsDataCompletedEventHandler(object sender, GetDetailsDataCompletedEventArgs e);
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.0.30319.18408")]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    public partial class GetDetailsDataCompletedEventArgs : System.ComponentModel.AsyncCompletedEventArgs {
        
        private object[] results;
        
        internal GetDetailsDataCompletedEventArgs(object[] results, System.Exception exception, bool cancelled, object userState) : 
                base(exception, cancelled, userState) {
            this.results = results;
        }
        
        /// <remarks/>
        public DetailsEntity Result {
            get {
                this.RaiseExceptionIfNecessary();
                return ((DetailsEntity)(this.results[0]));
            }
        }
    }
}

#pragma warning restore 1591