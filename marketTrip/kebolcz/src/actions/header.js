const handleClick = (action, title, content) => ({
    type: 'SHOW_MODAL',
    title: title,
    content: content,
    action: action
})

const closeModal = () => ({
    type: 'CLOSE_MODAL'
})

const toggleToast = () => ({
    type: 'TOGGLE_TOAST'
})

module.exports = { handleClick, closeModal, toggleToast };