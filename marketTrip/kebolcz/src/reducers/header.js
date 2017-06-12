let initState = {
    open: false,
    title: 'Do Action',
    content: 'Are you sure you want to do this action?',
    action: '',
    loading: false
};
const header = (state = initState, action) => {
    switch (action.type) {
        case 'SHOW_MODAL':
            var temp = state;
            temp.open = !state.open;
            temp.title = action.title;
            temp.content = action.content;
            temp.action = action.action;
            return Object.assign({}, state, temp)
        case 'CLOSE_MODAL':
            var temp = state;
            temp.open = !state.open;
            temp.action = '';
            return Object.assign({}, state, temp)
        case 'TOGGLE_TOAST':
            var temp = state;
            temp.loading = !state.loading;
            return Object.assign({}, state, temp)
        default:
            return state
    }
}

module.exports = header;