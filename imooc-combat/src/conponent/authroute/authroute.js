import React, {Component} from 'react';
import axios from 'axios';
/*
 * 验证路由，本身不是一个路由，引用router 4的withRouter，获得路由信息
 * You can get access to the history object’s properties and the closest <Route>'s match via the withRouter higher-order component. 
 * withRouter will re-render its component every time the route changes with the same props as <Route> render props: { match, location, history }. 
 */
import { withRouter } from 'react-router';


class AuthRoute extends Component{
    componentDidMount(){
        const publicList = ['/login','/register'];
        const pathname = this.props.location.pathname;
        if(publicList.indexOf(pathname) > -1){
            return null;
        }
        //get user info
        axios.get('/user/info').then(res => {
            if(res.status === 200){
                if(res.data.code === 0){
                    //有登陆信息，跳转到对应页面
                }else{
                    this.props.history.push('/login');
                }
            }
        });
        /* 是否登陆
         * 现在的url
         * 
        */
    }

    render(){
        return null;
    }
}

AuthRoute = withRouter(AuthRoute);

export default AuthRoute;