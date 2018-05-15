export function getRedirectPath({type, avator}){
    /**
     * @param:user.type  
     * @param:user.avator
     * 根据用户信息 返回跳转地址
     */
    let url = (type === 'boss') ? '/boss' : '/genius';
    if(avator) {
        url += 'info';
    }
    return url;
}