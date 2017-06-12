let initState = {
    business_code: '',
    business_desc: '',
    internalNo: '',
    status: '',
    projectNo: '',
    booktype_code: '',
    booktype_desc: '',
    depart_code: "00002000030000100000000000000000000000000000000000",
    depart_desc: "卡斯柯信号有限公司",
    btype_code: '',
    btype_desc: '',
    economy: false,
    tripReason: '',
    nonEconReason: '',
    isLoading: false,
    results: [],
    value: '',
    departList: [],
    businessData: [],
    actionsOptions: [],
    vehicleOptions: [],
    vehicleTemp: []
};
const mainInfo = (state = initState, action) => {
    switch (action.type) {
        case 'SELECT_BUSINESS':
            var temp = {
                value: action.desc,
                business_code: action.code,
                business_desc: action.desc,
                internalNo: action.internalNo,
                status: action.status,
                projectNo: action.projectNo
            };
            return Object.assign({}, state, temp)
        case 'SET_DEPART':
            var temp = {
                depart_code: action.code,
                depart_desc: action.desc
            };
            return Object.assign({}, state, temp)
        case 'SET_BTYPE':
            var temp = {
                btype_code: action.code,
                btype_desc: action.desc
            };
            return Object.assign({}, state, temp)
        case 'SET_BOOKTYPE':
            var temp = {
                booktype_code: action.code,
                booktype_desc: action.desc
            };
            return Object.assign({}, state, temp)
        case 'ECONOMY_OR_NOT':
            var temp = {
                economy: action.checked
            };
            return Object.assign({}, state, temp)
        case 'SET_TRIP_REASON':
            var temp = {
                tripReason: action.value
            };
            return Object.assign({}, state, temp)
        case 'SET_NONECON_REASON':
            var temp = {
                nonEconReason: action.value
            };
            return Object.assign({}, state, temp)
        case 'SELECT_RESULT':
            var temp = {
                value: action.desc,
                business_code: action.code,
                business_desc: action.desc
            };
            return Object.assign({}, state, temp)
        case 'SEARCH_RESULT':
            var temp = {
                value: action.value,
                isLoading: action.isLoading,
                results: action.results
            };
            return Object.assign({}, state, temp)
        case 'REQUEST_POSTS':
            var temp = {
                isFetching: true,
                didInvalidate: false
            };
            return Object.assign({}, state, temp)
        case 'RECEIVE_DEPART_POSTS':
            var temp = {
                isFetching: false,
                didInvalidate: false,
                departList: action.posts
            };
            return Object.assign({}, state, temp)
        case 'RECEIVE_DEF_DEPART_POSTS':
            var temp = {
                isFetching: false,
                didInvalidate: false,
                depart_code: action.code,
                depart_desc: action.value
            };
            return Object.assign({}, state, temp)
        case 'RECEIVE_BUSINESS_POSTS':
            var temp = {
                isFetching: false,
                didInvalidate: false,
                businessData: action.posts
            };
            return Object.assign({}, state, temp)
        case 'RECEIVE_AFTERBO_POSTS':
            var temp = {
                isFetching: false,
                didInvalidate: false,
                actionsOptions: action.posts
            };
            return Object.assign({}, state, temp)
        case 'RECEIVE_VEHICLE_OPT_POSTS':
            var temp = {
                isFetching: false,
                didInvalidate: false,
                vehicleOptions: action.posts
            };
            return Object.assign({}, state, temp)
        case 'RECEIVE_VEHICLE_TEMP_POSTS':
            var temp = {
                isFetching: false,
                didInvalidate: false,
                vehicleTemp: action.posts
            };
            return Object.assign({}, state, temp)
        default:
            return state
    }
}

module.exports = mainInfo;