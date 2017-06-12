const handleItemClick = (name) => ({
    type: 'CLICK_ITEM',
    name: name
})

const validator = (name) => (dispatch, getstate) => {
    if (name != 'home' && getstate().mainInfo.business_code === '') {
        $toast('请先选择商机编号!', 2000);
        return;
    }
    return dispatch(handleItemClick(name));
}

const toggleVisibility = () => ({
    type: 'TOGGLE'
})

module.exports = { validator, toggleVisibility };