import axios from 'axios';
import { getRedirectPath } from '../util';

const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
const ERROR_MSG = 'ERROR_MSG';
const LOAD_DATA = 'LOAD_DATA';


const initState = {
	user: '',
	type: '',
	isAuth: false,
	msg: '',
	redirectTo: ''
};

/**
 * Reducer - 数据的改变通过纯函数Reducer完成,Reducer用于定义对数据的处理方式
 * @param {*} state 
 * @param {*} action 
 * 复习一下reduce函数: [1,2,3,4].reduce(function(sum, item){return sum + item;}, 0)
 * 其中sum是上次操作的结果，item是本次操作的对象。
 * 也就是说根据action和state状态,通过Reducer直接返回一个新的state
 */
export function user(state = initState, action) {
	switch (action.type) {
		case REGISTER_SUCCESS:
			return { ...state, msg: '', redirectTo: getRedirectPath(action.payload), isAuth: true, ...action.payload };
		case LOGIN_SUCCESS:
			return { ...state, msg: '', redirectTo: getRedirectPath(action.payload), isAuth: true, ...action.payload };
		case ERROR_MSG:
			return { ...state, msg: action.msg, isAuth: false};
		case LOAD_DATA:
			return {...state, ...action.payload };
		default:
			return state;
	}
}

/**
 * Action就是一个对象，必须带key为type的对象
 * 
 * ActionCreator 返回一个 Action对象
 * 使用的时候直接store.dispatch(errorMsg(msg));就可以
 * Action创建函数的意义: 
 * 1. Action创建函数表面是返回一个对象
 * 2. 真正的意义在于逻辑的封装
 * @param {*} data 
 */
function registerSuccess(data) {
	return { type: REGISTER_SUCCESS, payload: data };
}

function loginSuccess(data) {
	return { type: LOGIN_SUCCESS, payload: data};
}

function errorMsg(msg) {
	return { msg, type: ERROR_MSG };
}

export function register({ user, pwd, repeatpwd, type }) {
	if (!user || !pwd || !type) {
		return errorMsg('user pwd is required!');
	}

	if (pwd !== repeatpwd) {
		return errorMsg('pwd is not the same!');
	}
	return (dispatch) => {
		var params = new URLSearchParams();
		params.append('user', user);
		params.append('repeatpwd', repeatpwd);
		params.append('type', type);
		params.append('pwd', pwd);
		axios.post('/user/register', params).then((res) => {
			if (res.status === 200 && res.data.code === 0) {
				dispatch(registerSuccess({ user, pwd, type }));
			} else {
				dispatch(errorMsg(res.data.msg));
			}
		});
	};
}

export function login({ user, pwd}) {
	if(!user || !pwd){
		return errorMsg('用户名和密码必须输入！');
	}

	/**
	 * redux-thunk中间件可以让ActionCreator创建函数先不返回一个action对象，
	 * 而是返回一个函数，函数传递两个参数(dispatch,getState),在函数体内进行业务逻辑的封装
	 * 通过getState()获取state，通过dispatch(errorMsg('err'))分发一个任务
	 */

	return (dispatch, getState) => {
		var params = new URLSearchParams();
		params.append('user', user);
		params.append('pwd', pwd);
		axios.post('/user/login', params).then((res) => {
			if (res.status === 200 && res.data.code === 0) {
				dispatch(loginSuccess(res.data.data));
			} else {
				dispatch(errorMsg(res.data.msg));
			}
		});
	};
}

export function loadData(userinfo) {
	return {type: LOAD_DATA, payload: userinfo};
}