let initState = {
    isLoading: false,
    value: '',
    results: [],
    citiesData: [],
    mytype: '',
    tripsList: [{
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
    }]
};
const tripInfo = (state = initState, action) => {
    switch (action.type) {
        case 'ADD_ONE_TRIP':
            var temp = {
                tripsList: state.tripsList.concat(action.item)
            };
            return Object.assign({}, state, temp)
        case 'ADD_ONE_TICKET':
            var temp = state;
            temp.tripsList[action.index].ticketsList.push(action.item);
            return Object.assign({}, state, temp)
        case 'DELETE_ONE_TRIP':
            var temp = state;
            temp.tripsList.splice(action.index, 1);
            return Object.assign({}, state, temp)
        case 'DELETE_ONE_TICKET':
            var temp = state;
            temp.tripsList[action.index].ticketsList.splice(action.i, 1);
            return Object.assign({}, state, temp)
        case 'APPLY_OR_NOT':
            var temp = state;
            temp.tripsList[action.index].ticketaApply = action.checked;
            return Object.assign({}, state, temp)
        case 'SET_TRIP_START':
            var temp = state;
            temp.tripsList[action.index].startDate = action.value;
            return Object.assign({}, state, temp)
        case 'SET_TRIP_END':
            var temp = state;
            temp.tripsList[action.index].endDate = action.value;
            return Object.assign({}, state, temp)
        case 'POSITION_CLICK':
            var temp = {
                index: action.index,
                i: action.i,
                mytype: action.mytype
            };
            return Object.assign({}, state, temp)
        case 'HANDLE_SUB':
            var temp = state;
            temp.tripsList[action.index].ticketsList[action.i][action.mytype] = action.value;
            return Object.assign({}, state, temp)
        case 'SELECT_CITY_RESULT':
            var temp = state;
            if(state.i === '' || state.i === undefined){
                temp.tripsList[state.index][state.mytype] = action.desc;
                temp.tripsList[state.index][state.mytype+'_code'] = action.code;
                temp.value = '';
            }else{
                temp.tripsList[state.index].ticketsList[state.i][state.mytype] = action.desc;
                temp.tripsList[state.index].ticketsList[state.i][state.mytype+'_code'] = action.code;
                temp.value = '';
            }
            return Object.assign({}, state, temp)
        case 'SEARCH_CITY_RESULT':
            var temp = {
                value: action.value,
                isLoading: action.isLoading,
                results: action.results,
                index: action.index,
                i: action.i,
                mytype: action.mytype
            };
            return Object.assign({}, state, temp)
        case 'REQUEST_TRIP_POSTS':
            var temp = {
                isFetching: true,
                didInvalidate: false
            };
            return Object.assign({}, state, temp)
        case 'RECEIVE_CITIES_POSTS':
            var temp = {
                isFetching: false,
                didInvalidate: false,
                citiesData: action.posts
            };
            return Object.assign({}, state, temp)
        case 'HANDLE_SUB_GO':
            var temp = state;
            temp.tripsList[action.index].ticketsList[action.i].startTime = action.startTime;
            temp.tripsList[action.index].ticketsList[action.i].subStartCity = action.startCity;
            temp.tripsList[action.index].ticketsList[action.i].subEndCity = action.endCity;
            temp.tripsList[action.index].ticketsList[action.i].subStartCity_code = action.startCity_code;
            temp.tripsList[action.index].ticketsList[action.i].subEndCity_code = action.endCity_code;
            return Object.assign({}, state, temp)
        default:
            return state
    }
}

module.exports = tripInfo;