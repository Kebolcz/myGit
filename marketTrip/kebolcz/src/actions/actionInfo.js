const AddOneActivityFunc = () => ({
    type: 'ADD_ONE_ACTIVITY',
    item: {
        activity_code: '',
        activity_desc: '',
        actStartTime: '',
        actEndTime: ''
    }
})

const AddOneActivity = () => (dispatch, getstate) => {
    let len = getstate().actionInfo.activityList.length;
    if (len != 0 && (getstate().actionInfo.activityList[len - 1].activity_code === '' || getstate().actionInfo.activityList[len - 1].actStartTime === ''
        || getstate().actionInfo.activityList[len - 1].actEndTime === '')) {
        $toast('请先完善本条后续活动记录!', 2000);
        return;
    }
    dispatch(AddOneActivityFunc());
}

const DeleteOneActivity = (index) => ({
    type: 'DELETE_ONE_ACTIVITY',
    index: index
})

const SetActivity = (index, code, desc, start, end) => (dispatch, getState) => {
    dispatch(GoActivity(index, code, desc, start, end))
}


const GoActivity = (index, code, desc, startTime, endTime) => ({
    type: 'SET_ACTIVITY',
    index: index,
    code: code,
    desc: desc,
    startTime: startTime,
    endTime: endTime
})

const SetActStartTime = (index, value) => ({
    type: 'SET_ACT_STARTTIME',
    index: index,
    value: value
})

const SetActEndTimeFunc = (index, value) => ({
    type: 'SET_ACT_ENDTIME',
    index: index,
    value: value
})

const SetActEndTime = (index, value) => (dispatch, getstate) => {
    let startTime = new Date(getstate().actionInfo.activityList[index].actStartTime);
    if (getstate().actionInfo.activityList[index].actStartTime === '' || startTime >= new Date(value)) {
        $toast('后续活动的起始时间不能晚于截止时间', 2000);
        return;
    }
    dispatch(SetActEndTimeFunc(index, value));
}

const requestPosts = () => ({
    type: 'REQUEST_POSTS'
})

module.exports = { AddOneActivity, DeleteOneActivity, SetActivity, SetActStartTime, SetActEndTime };