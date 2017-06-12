require('../../../../js/app.config.js');

const AddOneTrip = () => ({
    type: 'ADD_ONE_TRIP',
    item: {
        startDate: '',
        endDate: '',
        startCity: '',
        endCity: '',
        ticketaApply: false,
        ticketsList: [
            {
                type: '0',
                vehicle: '0',
                startTime: '',
                subStartCity: '',
                subEndCity: '',
                flight: '',
                remark: ''
            }
        ]
    }
})

const AddOneTicketFunc = (index) => ({
    type: 'ADD_ONE_TICKET',
    index: index,
    item: {
        type: '0',
        vehicle: '0',
        startTime: '',
        subStartCity: '',
        subEndCity: '',
        flight: '',
        remark: ''
    }
})

const AddOneTicket = (index) => (dispatch, getstate) => {
    let len = getstate().tripInfo.tripsList[index].ticketsList.length;
    if (getstate().tripInfo.tripsList[index].ticketsList[len - 1].type === '0' || getstate().tripInfo.tripsList[index].ticketsList[len - 1].vehicle === '0'
        || getstate().tripInfo.tripsList[index].ticketsList[len - 1].startTime === '' || getstate().tripInfo.tripsList[index].ticketsList[len - 1].subStartCity === ''
        || getstate().tripInfo.tripsList[index].ticketsList[len - 1].subEndCity === '' || getstate().tripInfo.tripsList[index].ticketsList[len - 1].flight === '') {
        $toast('请先完善本条票务信息', 2000);
        return;
    }
    return dispatch(AddOneTicketFunc(index));
}

const DeleteOneTrip = (index) => ({
    type: 'DELETE_ONE_TRIP',
    index: index
})

const DeleteOneTicket = (index, i) => ({
    type: 'DELETE_ONE_TICKET',
    index: index,
    i: i
})

const ApplyOrNotFunc = (index, checked) => ({
    type: 'APPLY_OR_NOT',
    index: index,
    checked: checked
})


const ApplyOrNot = (index, checked) => (dispatch, getstate) => {
    if (getstate().tripInfo.tripsList[index].startDate === '' || getstate().tripInfo.tripsList[index].endDate === ''
        || getstate().tripInfo.tripsList[index].startCity === '' || getstate().tripInfo.tripsList[index].endCity === '') {
        $toast('请先完善对应的行程信息', 2000);
        return;
    }
    return dispatch(ApplyOrNotFunc(index, checked));
}

const SetTripStart = (index, value) => ({
    type: 'SET_TRIP_START',
    index: index,
    value: value
})

const SetTripEndFunc = (index, value) => ({
    type: 'SET_TRIP_END',
    index: index,
    value: value
})

const SetTripEnd = (index, value) => (dispatch, getstate) => {
    let startTime = new Date(getstate().tripInfo.tripsList[index].startDate);
    if (getstate().tripInfo.tripsList[index].startDate === '' || startTime >= new Date(value)) {
        $toast('出差行程的起始时间不能晚于截止时间', 2000);
        return;
    }
    dispatch(SetTripEndFunc(index, value));
}

const PositionClick = (index, i, mytype) => ({
    type: 'POSITION_CLICK',
    index: index,
    i: i,
    mytype: mytype
})

const HandleSubFunc = (index, i, mytype, value) => ({
    type: 'HANDLE_SUB',
    index: index,
    i: i,
    mytype: mytype,
    value: value
})

const HandleSubTypeGO = (index, i, json) => ({
    type: 'HANDLE_SUB_GO',
    index: index,
    i: i,
    startTime: json.startDate,
    startCity: json.startCity,
    endCity: json.endCity,
    startCity_code: json.startCity_code,
    endCity_code: json.endCity_code
})

const HandleSubTypeBACK = (index, i, json) => ({
    type: 'HANDLE_SUB_GO',
    index: index,
    i: i,
    startTime: json.endDate,
    startCity: json.endCity,
    endCity: json.startCity,
    startCity_code: json.startCity_code,
    endCity_code: json.endCity_code
})

const HandleSub = (index, i, mytype, value) => (dispatch, getstate) => {
    if (mytype === 'type' && value === '1') {
        dispatch(HandleSubFunc(index, i, mytype, value));
        dispatch(HandleSubTypeGO(index, i, getstate().tripInfo.tripsList[index]));
    } else if (mytype === 'type' && value === '3') {
        dispatch(HandleSubFunc(index, i, mytype, value));
        dispatch(HandleSubTypeBACK(index, i, getstate().tripInfo.tripsList[index]));
    } else if (mytype === 'startTime') {
        let planTime = new Date(value);
        let sTime = new Date(getstate().tripInfo.tripsList[index].startDate);
        let eTime = new Date(getstate().tripInfo.tripsList[index].endDate);
        if (!(sTime <= planTime && eTime >= planTime)) {
            $toast('票务申请的计划时间不在行程安排时间范围内', 2000);
            return;
        }
        dispatch(HandleSubFunc(index, i, mytype, value));
    } else {
        dispatch(HandleSubFunc(index, i, mytype, value));
    }
}

const SetResult = (code, desc) => ({
    type: 'SELECT_CITY_RESULT',
    code: code,
    desc: desc
})

const SearchResult = (value, isLoading, results, index, i, mytype) => ({
    type: 'SEARCH_CITY_RESULT',
    value: value,
    isLoading: isLoading,
    results: results,
    index: index,
    i: i,
    mytype: mytype
})



const requestTripPosts = () => ({
    type: 'REQUEST_TRIP_POSTS'
})

const receiveCitiesPosts = (json) => ({
    type: 'RECEIVE_CITIES_POSTS',
    posts: json
})

const loadCitiesData = () => (dispatch) => {
    dispatch(requestTripPosts())
    ajaxRequest(configMasUrl.k2, {
        "type": "GET",
        "data": {
            "method": 'getCity', //方法名
            "pageindex": '1',
            "pageSize": "100000",
            "cityName": ''
        }
        /*成功回调函数*/
    }, function (data, status, requestCode, response, xhr) {
        dispatch(receiveCitiesPosts(JSON.parse(data).data));
    });
}

const fetchCitiesIfNeeded = () => (dispatch, getstate) => {
    return dispatch(loadCitiesData())
}

module.exports = {
    AddOneTrip, AddOneTicket, DeleteOneTrip, DeleteOneTicket, ApplyOrNot, SetTripStart, SetTripEnd, PositionClick, HandleSub,
    SetResult, SearchResult, fetchCitiesIfNeeded
};