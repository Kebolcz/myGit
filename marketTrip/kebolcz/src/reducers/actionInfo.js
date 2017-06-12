let initState = {
    activityList: [
        {
            activity_code: '',
            activity_desc: '',
            actStartTime: '',
            actEndTime: ''
        }
    ]
};

const actionInfo = (state = initState, action) => {
    switch (action.type) {
        case 'ADD_ONE_ACTIVITY':
            var temp = state;
            temp.activityList.push(action.item);
            return Object.assign({}, state, temp)
        case 'DELETE_ONE_ACTIVITY':
            var temp = state;
            temp.activityList.splice(action.index, 1);
            return Object.assign({}, state, temp)
        case 'SET_ACTIVITY':
            var temp = state;
            temp.activityList[action.index].activity_code = action.code;
            temp.activityList[action.index].activity_desc = action.desc;
            temp.activityList[action.index].actStartTime = action.startTime;
            temp.activityList[action.index].actEndTime = action.endTime;
            return Object.assign({}, state, temp)
        case 'SET_ACT_STARTTIME':
            var temp = state;
            temp.activityList[action.index].actStartTime = action.value;
            return Object.assign({}, state, temp)
        case 'SET_ACT_ENDTIME':
            var temp = state;
            temp.activityList[action.index].actEndTime = action.value;
            return Object.assign({}, state, temp)
        case 'REINIT_ACTIVITY_LIST':
            var temp = state;
            temp.activityList = [
                {
                    activity_code: '',
                    activity_desc: '',
                    actStartTime: '',
                    actEndTime: ''
                }
            ]
            return Object.assign({}, state, temp)
        default:
            return state
    }
}

module.exports = actionInfo;