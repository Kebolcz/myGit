var React = require('react');
var { Header, Button, Modal, Dimmer, Loader } = require('semantic-ui-react');

var { connect } = require('react-redux');
var header = require('../actions/header');

require('../../../../js/app.config.js');

const nonEconomicArr = ['00008000170000200015000000000000000000000000000000',
  '00008000170000200001000000000000000000000000000000', '00008000170000200010000000000000000000000000000000',
  '00008000170000200012000000000000000000000000000000', '00008000170000200014000000000000000000000000000000',
  '00008000170000200007000000000000000000000000000000', '0'];

class ActionHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { finalSource, handleClick, open, title, content, action, handleModalNo, handleModalYes, loading } = this.props;

    return (
      <div>
        <Dimmer className={loading ? 'active' : ''}>
          <Loader>Loading</Loader>
        </Dimmer>
        <Button.Group id='header' color='blue' style={{ width: '100%' }}>
          <Button labelPosition='left' icon='left chevron' data-action='back' content='返回' onClick={handleClick} />
          <Button content='业务出差申请' />
          <Button labelPosition='right' icon='send outline' data-action='commit' content='提交' onClick={handleClick} />
        </Button.Group>

        <Modal size='small' open={open} onClose={this.close}>
          <Modal.Header>
            {title}
          </Modal.Header>
          <Modal.Content>
            <p>{content}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button negative onClick={handleModalNo}>
              不是
            </Button>
            <Button positive icon='checkmark' labelPosition='right' data-action={action} data-final={finalSource} content='是' onClick={handleModalYes} />
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    finalSource: state,
    open: state.header.open,
    title: state.header.title,
    content: state.header.content,
    action: state.header.action,
    loading: state.header.loading
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {

  Function.prototype.before = function (beforeFn) {
    var _self = this;
    return function () {
      if (beforeFn.apply(this, arguments) === false) {
        return;
      }
      return _self.apply(this, arguments);
    }
  };


  const timeFormat = (t) => {
    var newt = "";
    if (t.replace(/-/g, "").replace(/\s+/g, "").replace(/T/g, "").replace(/:/g, "").length == "12") {
      console.log("********^^^^^^^^^");
      //开始时间 && 结束时间
      newt = t.replace(/-/g, "").replace(/\s+/g, "").replace(/T/g, "").replace(/:/g, "") + "00";
    } else {
      //开始时间&&结束时间
      newt = t.replace(/-/g, "").replace(/\s+/g, "").replace(/T/g, "").replace(/:/g, "");
    }
    return newt;
  }

  var validate = function (finalSource) {
    if (finalSource.mainInfo.depart_code === '' || finalSource.mainInfo.depart_code === "00002000030000100000000000000000000000000000000000") {
      $toast('受益部门不能为空!', 2000);
      return false;
    }
    if (finalSource.mainInfo.business_code === '') {
      $toast('商机不能为空!', 2000);
      return false;
    }
    if (finalSource.mainInfo.btype_code === '' || finalSource.mainInfo.btype_code === '0') {
      $toast('业务板块不能为空!', 2000);
      return false;
    }
    if (finalSource.mainInfo.booktype_code === '' || finalSource.mainInfo.booktype_code === '0') {
      $toast('订票方式不能为空!', 2000);
      return false;
    }
    if (finalSource.mainInfo.tripReason === '') {
      $toast('出差事由不能为空!', 2000);
      return false;
    }

    for (var m = 0; m < finalSource.tripInfo.tripsList.length; m++) {
      if (m === finalSource.tripInfo.tripsList.length - 1) {
        if (finalSource.tripInfo.tripsList[m].startCity === '') {
          $toast('最后一条行程出发城市不能为空!', 2000);
          return false;
        }
        if (finalSource.tripInfo.tripsList[m].endCity === '') {
          $toast('最后一条行程出差地点不能为空!', 2000);
          return false;
        }
        if (finalSource.tripInfo.tripsList[m].startDate === '' || finalSource.tripInfo.tripsList[m].endDate === '') {
          $toast('最后一条行程起始时间不能为空!', 2000);
          return false;
        }
      }
      for (var n = 0; n < finalSource.tripInfo.tripsList[m].ticketsList.length; n++) {
        if (finalSource.tripInfo.tripsList[m].ticketaApply === true && n === finalSource.tripInfo.tripsList[m].ticketsList.length - 1) {
          if (finalSource.tripInfo.tripsList[m].ticketsList[n].type === '0') {
            $toast('最后一条票务的类型不能为空!', 2000);
            return false;
          }
          if (finalSource.tripInfo.tripsList[m].ticketsList[n].vehicle === '' || finalSource.tripInfo.tripsList[m].ticketsList[n].vehicle === '0') {
            $toast('最后一条票务的交通工具不能为空!', 2000);
            return false;
          }
          if (finalSource.tripInfo.tripsList[m].ticketsList[n].startTime === '') {
            $toast('最后一条票务的出发时间不能为空!', 2000);
            return false;
          }
          if (finalSource.tripInfo.tripsList[m].ticketsList[n].subStartCity === '') {
            $toast('最后一条票务的出发城市不能为空!', 2000);
            return false;
          }
          if (finalSource.tripInfo.tripsList[m].ticketsList[n].subEndCity === '') {
            $toast('最后一条票务的出差地点不能为空!', 2000);
            return false;
          }
          if (finalSource.tripInfo.tripsList[m].ticketsList[n].flight === '') {
            $toast('最后一条票务的预计航班不能为空!', 2000);
            return false;
          }
        }
        if (!(nonEconomicArr.indexOf(finalSource.tripInfo.tripsList[m].ticketsList[n].vehicle) !== -1)) {
          if (finalSource.mainInfo.nonEconReason === '') {
            $toast('订购非经济舱原因不能为空!', 2000);
            return false;
          }
        }
      }
    }

    //actionInfo
    for (var i = 0; i < finalSource.actionInfo.activityList.length; i++) {
      if (i === finalSource.actionInfo.activityList.length - 1) {
        if (finalSource.actionInfo.activityList[i].activity_code === '' || finalSource.actionInfo.activityList[i].activity_code === '0') {
          $toast('最后一条后续活动的活动记录不能为空!', 2000);
          return false;
        }
        if (finalSource.actionInfo.activityList[i].actStartTime === '') {
          $toast('最后一条后续活动的开始时间不能为空!', 2000);
          return false;
        }
        if (finalSource.actionInfo.activityList[i].actEndTime === '') {
          $toast('最后一条后续活动的结束时间不能为空!', 2000);
          return false;
        }
      }
    }
  }

  var formSubmit = function (finalSource) {
    let xmlData = '';
    //mainInfo
    xmlData += '$benefitDeptCombo_Value@' + finalSource.mainInfo.depart_code;
    xmlData += '$benefitDeptCombo_Text@' + finalSource.mainInfo.depart_desc;
    xmlData += '$businessNumberCombo@' + finalSource.mainInfo.business_code;
    xmlData += '$businessInternalNo@' + finalSource.mainInfo.internalNo;
    xmlData += '$businessStatus@' + finalSource.mainInfo.status;
    xmlData += '$businessProjectNo@' + (finalSource.mainInfo.projectNo === null ? '' : finalSource.mainInfo.projectNo);
    xmlData += '$businessCombo_Value@' + finalSource.mainInfo.btype_code;
    xmlData += '$businessCombo_Text@' + finalSource.mainInfo.btype_desc;
    xmlData += '$travelReasonArea@' + finalSource.mainInfo.tripReason;
    let ticketApplication = finalSource.tripInfo.tripsList.some((item) => {
      return item.ticketaApply === true;
    })
    if (ticketApplication) {
      xmlData += '$ticketApplication@true';
    } else {
      xmlData += '$ticketApplication@false';
    }
    xmlData += '$orderTypeCombo_Value@' + finalSource.mainInfo.booktype_code;
    xmlData += '$isNeedOrderDiseconomy@' + finalSource.mainInfo.economy;
    xmlData += '$diseconomyReason@' + finalSource.mainInfo.nonEconReason;
    //tripInfo
    for (var item of finalSource.tripInfo.tripsList) {
      xmlData += '&ITEM';
      xmlData += '$businessNumber@' + finalSource.mainInfo.business_code;
      xmlData += '$businessStatus@' + finalSource.mainInfo.status;
      xmlData += '$businessInternalNo@' + finalSource.mainInfo.internalNo;
      xmlData += '$businessProjectNo@' + (finalSource.mainInfo.projectNo === null ? '' : finalSource.mainInfo.projectNo);
      xmlData += '$travelFromCode@' + item.startCity_code;
      xmlData += '$travelFrom@' + item.startCity;
      xmlData += '$travelSitesCode@' + item.endCity_code;
      xmlData += '$travelSites@' + item.endCity;
      xmlData += '$tb_startDate@' + timeFormat(item.startDate.replace(/T/, ' ')).slice(0, 14);
      xmlData += '$tb_arriveDate@' + timeFormat(item.endDate.replace(/T/, ' ')).slice(0, 14);
    }
    //ticketInfo
    for (var i = 0; i < finalSource.tripInfo.tripsList.length; i++) {
      if (finalSource.tripInfo.tripsList[i].ticketaApply) {
        for (var item of finalSource.tripInfo.tripsList[i].ticketsList) {
          xmlData += '&ITEM';
          xmlData += '$itineraryCodeOrder@' + (i + 1);
          xmlData += '$transportCodeOrder@' + item.vehicle;
          for (var elem of finalSource.mainInfo.vehicleTemp) {
            if (elem.value === item.vehicle) {
              xmlData += '$transportOrder@' + elem.text;
            }
          }
          xmlData += '$typeOrder@' + item.type;
          xmlData += '$remarkOrder@' + item.remark;
          xmlData += '$expectedFlightOrder@' + item.flight;
          xmlData += '$travelFromOrder@' + item.subStartCity;
          xmlData += '$travelSitesOrder@' + item.subEndCity;
          xmlData += '$tb_startDateOrder@' + item.startTime.replace(/T/, ' ').slice(0, 10).replace(/-/g, '/');
          xmlData += '$planTimeOrder@' + item.startTime.replace(/T/, ' ').slice(11);
        }
      }
    }
    //BoInfo
    for (var item of finalSource.actionInfo.activityList) {
      xmlData += '&ITEM';
      xmlData += '$BoNumber@' + finalSource.mainInfo.business_code;
      xmlData += '$BoDesc@' + finalSource.mainInfo.business_desc;
      xmlData += '$AfterDesc@' + item.activity_desc;
      xmlData += '$AfterNumber@' + item.activity_code;
      xmlData += '$jh_startDate@' + new Date(item.actStartTime).format('yyyy/MM/dd');
      xmlData += '$jh_endDate@' + new Date(item.actEndTime).format('yyyy/MM/dd');
    }
    console.log(xmlData);
    dispatch(header.toggleToast());
    ajaxRequest(configMasUrl.marketTrip, {
      "type": "GET",
      "data": {
        "action": 'startTravelTaskBusiness', //方法名
        "userNo": gUserInfo["userId"],
        'xmlData': xmlData
      }
      /*成功回调函数*/
    }, function (data, status, requestCode, response, xhr) {
      console.log(data);
      dispatch(header.toggleToast());
      var json = JSON.parse(data);
      if (json.string.Success != "0") {
        //成功
        //appLog的count+1
        ajaxRequest(configMasUrl.marketTrip, {
          "type": "GET",
          "data": {
            "action": 'countAddOne', //方法名
            "appid": 'aaali10031',
            'ident': 'marketTrip'
          }
          /*成功回调函数*/
        }, function (data, status, requestCode, response, xhr) {
          console.log(data);
          //回退到上一页
          appcan.window.alert('提示', json.string.Message);
          appcan.window.close(-1);
        });

      } else if (json.string.Success == "0") {
        //失败
        appcan.window.alert('提示', json.string.Message);
      }
    }, function () {
      dispatch(header.toggleToast());
      $toast("数据加载失败,请稍后再试.", 5000);
    });
  }

  formSubmit = formSubmit.before(validate);

  return {
    handleClick: (e, data) => {
      if (data['data-action'] === 'back') {
        dispatch(header.handleClick('back', '返回', '返回操作将丢失本页数据,确定吗?'));
      } else if (data['data-action'] === 'commit') {
        dispatch(header.handleClick('commit', '提交', '提交操作将提交表单,确定吗?'));
      }
    },
    handleModalNo: (e, data) => {
      dispatch(header.closeModal());
    },
    handleModalYes: (e, data) => {
      if (data['data-action'] === 'back') {
        dispatch(header.closeModal());
        appcan.window.close(-1);
      } else if (data['data-action'] === 'commit') {
        dispatch(header.closeModal());
        let finalSource = data['data-final'];
        if (true) {
          formSubmit(finalSource);
        }
      }
    }
  };
}


module.exports = connect(mapStateToProps, mapDispatchToProps)(ActionHeader);