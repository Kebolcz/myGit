let initState = {
    visible: false,
    title: '出差详情',
    activeItem: 'home'
};
const panel = (state = initState, action) => {
    switch (action.type) {
        case 'CLICK_ITEM':
            var temp = {
                visible: !state.visible,
                title: action.name == 'home' ? '出差详情' : action.name == 'trips' ? '出差行程' : action.name == 'actions' ? '后续活动' : 'kebo',
                activeItem: action.name
            };
            return Object.assign({}, state, temp)
        case 'TOGGLE':
            var temp = {
                visible: !state.visible
            };
            return Object.assign({}, state, temp)
        default:
            return state
    }
}

module.exports = panel;