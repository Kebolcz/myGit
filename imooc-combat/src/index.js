import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
/**
 *  redux 异步 action 中间件,中间件redux-thunk进行异步处理
 */
import thunk from 'redux-thunk';
/**
 * react-redux主要做了两件事：
 * 1. 提供了Provider - 直接从’react-redux’中导入{Provider}即可。Provider包裹最顶层的应用组件，当组件需要使用该store时，即可直接通过 this.props.store 的方式获取
 * 2. 之前的代码中有很多组件都存在大量的重复代码(subscribe/onChange/getOwnState)，通过react-redux的connect可以避免这种方式
 */
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Login from './container/login/login';
import Register from './container/register/register';
import AuthRoute from './conponent/authroute/authroute';
import reducers from './reducer';
import './config';
import registerServiceWorker from './registerServiceWorker';

import './index.css';

/**
 * 创建Store,Store用于存储数据
 * store是一个全局对象，将action和reducer以及state联系在一起，主要职责: 
 * 1. 维护应用的state
 * 2. 提供getState()方法获取state
 * 3. 提供dispatch(action)方法更新state
 * 4. 通过subscribe(方法)注册监听器
 */
const store = createStore(
	reducers,
	compose(applyMiddleware(thunk), window.devToolsExtension ? window.devToolsExtension() : (f) => f)
);

function Boss(){
	return <h2>boss</h2>
}

function Genius(){
	return <h2>Genius</h2>
}

ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			{/* <Switch> */}
			<div>
				<AuthRoute />
				<Route path="/login" component={Login} />
				<Route path="/register" component={Register} />
				<Route path="/boss" component={Boss} />
				<Route path="/genius" component={Genius} />
			</div>
			{/* </Switch> */}
		</BrowserRouter>
	</Provider>,
	document.getElementById('root')
);
registerServiceWorker();
