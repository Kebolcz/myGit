require('es6-promise').polyfill();
require('isomorphic-fetch');
require('../../../../js/app.config.js');

const selectBusinessAndSetBoOption = (code, desc, internalNo, status, projectNo) => (dispatch) => {
    dispatch(requestPosts())
    dispatch(selectBusiness(code, desc, internalNo, status, projectNo))
    ajaxRequest(configMasUrl.marketTrip, {
        "type": "GET",
        "data": {
            "action": 'get_after_data', //方法名
            "userNo": gUserInfo["userId"],
            "boCode": code
        }
        /*成功回调函数*/
    }, function (data, status, requestCode, response, xhr) {
        var json = JSON.parse(data);
        var temp = [];
        if (json.message != 'Error') {
            json = eval('({' + json.string._ + '})').Table;
            if (json.length == 0) {
                temp.push({ value: '0', text: '暂无后续活动', start: '', end: '' });
            } else {
                temp.push({ value: '0', text: '请选择', start: '', end: '' });
            }
            json.map(item => {
                temp.push({ value: item.AfterNumber, text: item.AfterDesc, start: item.BeginDate, end: item.EndDate })
            })
            dispatch(receiveAfterBoPosts(temp));
            dispatch(reInitActivityList());
        } else {
            temp.push({ value: '0', text: '暂无后续活动', start: '', end: '' });
            $toast('获取商机后续活动失败,请稍后再试', 2000);
            dispatch(receiveAfterBoPosts(temp));
            dispatch(reInitActivityList());
        }
    });
}

const receiveAfterBoPosts = (json) => ({
    type: 'RECEIVE_AFTERBO_POSTS',
    posts: json
})

const reInitActivityList = () => ({
    type: 'REINIT_ACTIVITY_LIST'
})


const selectBusiness = (code, desc, internalNo, status, projectNo) => ({
    type: 'SELECT_BUSINESS',
    code: code,
    desc: desc,
    internalNo: internalNo,
    status: status,
    projectNo: projectNo
})

const setDepart = (code, desc) => ({
    type: 'SET_DEPART',
    code: code,
    desc: desc
})

const setBusinessType = (code, desc) => ({
    type: 'SET_BTYPE',
    code: code,
    desc: desc
})

// const setBookType = (code, desc) => ({
//     type: 'SET_BOOKTYPE',
//     code: code,
//     desc: desc
// })

const changeBookType = (code, desc) => ({
    type: 'SET_BOOKTYPE',
    code: code,
    desc: desc
})

const receiveVehicleOptPosts = (json) => ({
    type: 'RECEIVE_VEHICLE_OPT_POSTS',
    posts: json
})

const receiveVehicleTempPosts = (json) => ({
    type: 'RECEIVE_VEHICLE_TEMP_POSTS',
    posts: json
})

const setBookTypeAndVT = (code, desc, arr) => (dispatch) => {
    dispatch(changeBookType(code, desc));
    if (code == '2' && arr.length <= 0) {
        fetch(configMasUrl.k2 + '?method=getTransportStore')
            .then(response => {    //=> String
                if (response.ok) {
                    response.json().then(data => {
                        let json = data.Transport;
                        let resultJson = [{ key: '0', value: '0', text: '请选择' }];
                        for (var item of json) {
                            resultJson.push({
                                key: item.Res_Code,
                                value: item.Res_Code,
                                text: item.Res_Name
                            });
                        }
                        dispatch(receiveVehicleTempPosts(resultJson));
                        dispatch(receiveVehicleOptPosts(resultJson));
                    })
                } else {
                    $toast('获取登录人部门信息失败.', 2000);
                }
            }, function (error) {
                $toast('网络请求失败,请稍后再试.', 2000); //=> String
            })
    } else if (code == '2' && arr.length > 0) {
        dispatch(receiveVehicleOptPosts(arr));
    } else if (code == '1') {
        dispatch(receiveVehicleOptPosts([
            { key: '0', value: '0', text: '请选择' },
            { key: '00008000170000200001000000000000000000000000000000', value: '00008000170000200001000000000000000000000000000000', text: '飞机' }]));
    }
}

const setBookType = (code, desc) => (dispatch, getState) => {
    return dispatch(setBookTypeAndVT(code, desc, getState().mainInfo.vehicleTemp))
}

const setResult = (code, desc) => ({
    type: 'SELECT_RESULT',
    code: code,
    desc: desc
})

const EconomyOrNot = (checked) => ({
    type: 'ECONOMY_OR_NOT',
    checked: checked
})

const setTripReason = (value) => ({
    type: 'SET_TRIP_REASON',
    value: value
})

const setNonEconReason = (value) => ({
    type: 'SET_NONECON_REASON',
    value: value
})

const searchResult = (value, isLoading, results) => ({
    type: 'SEARCH_RESULT',
    value: value,
    isLoading: isLoading,
    results: results
})


const requestPosts = () => ({
    type: 'REQUEST_POSTS'
})

const receiveDepartPosts = (json) => ({
    type: 'RECEIVE_DEPART_POSTS',
    posts: json
})

const receiveDefaultDepartPosts = (code, value) => ({
    type: 'RECEIVE_DEF_DEPART_POSTS',
    code: code,
    value: value
})

const loadDepart = () => (dispatch) => {
    dispatch(requestPosts())
    ajaxRequest(configMasUrl.k2, {
        "type": "GET",
        "data": {
            "method": 'getDepart' //方法名
        }
        /*成功回调函数*/
    }, function (data, status, requestCode, response, xhr) {
        var json = JSON.parse(data);
        json = json.data;
        var temp = [];
        json.map(item => {
            temp.push({ value: item.departCode, text: item.departName })
        })
        dispatch(receiveDepartPosts(temp))
    });
    // ajaxRequest('http://emmprd.casco.com.cn:8101/k2/k2_data_sync', {
    //     "type": "GET",
    //     "data": {
    //         "action": 'k2_staff_base_depart',
    //         'userId': gUserInfo["userId"]
    //     }
    //     /*成功回调函数*/
    // }, function (data, status, requestCode, response, xhr) {
    //     var json = JSON.parse(data);
    //     json = json.data;
    //     dispatch(receiveDefaultDepartPosts(json[0].departCode, json[0].departName))
    // });
    fetch(configMasUrl.dept + '?action=k2_staff_base_depart&userId=' + gUserInfo["userId"])
        .then(response => {    //=> String
            if (response.ok) {
                response.json().then(data => {
                    let json = data.data[0];
                    dispatch(receiveDefaultDepartPosts(json.departCode, json.departName));
                })
            } else {
                $toast('获取登录人部门信息失败.', 2000);
            }
        }, function (error) {
            $toast('网络请求失败,请稍后再试.', 2000); //=> String
        })
}

const fetchPostsIfNeeded = () => (dispatch, getState) => {
    return dispatch(loadDepart())
}


const loadBussinessData = () => (dispatch) => {
    dispatch(requestPosts())
    ajaxRequest(configMasUrl.marketTrip, {
        "type": "GET",
        "data": {
            "action": 'get_business_data', //方法名
            "userNo": gUserInfo["userId"]
        }
        /*成功回调函数*/
    }, function (data, status, requestCode, response, xhr) {
        var json = JSON.parse(data);
        dispatch(receiveBussinessPosts(eval('({' + json.string._ + '})').Table))
    }, function () {
        $toast('获取商机列表失败,请稍后再试!', 2000);
    });
}

const receiveBussinessPosts = (json) => ({
    type: 'RECEIVE_BUSINESS_POSTS',
    posts: json
})

const getBusinessData = () => (dispatch, getState) => {
    return dispatch(loadBussinessData())
}

module.exports = {
    selectBusiness, setDepart, setBusinessType, selectBusinessAndSetBoOption, searchResult, setBookType, EconomyOrNot, setTripReason,
    setNonEconReason, requestPosts, receiveDepartPosts, fetchPostsIfNeeded, getBusinessData, setResult
};