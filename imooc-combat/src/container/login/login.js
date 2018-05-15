import React from 'react';
import Logo from '../../conponent/logo/logo';
import { List, InputItem, WingBlank, WhiteSpace, Button } from 'antd-mobile';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { login } from '../../redux/user.redux';

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: '',
			pwd: ''
		};
		this.register = this.register.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
	}
	
	handleChange(key, val) {
		this.setState({
			[key]: val
		});
	}

	handleLogin(){
		this.props.login(this.state);
	}

	register() {
		this.props.history.push('/register');
	}

	render() {
		return (
			<div>
				{ this.props.state.redirectTo ? <Redirect to={this.props.state.redirectTo}/> : null }
				<Logo />
				<WingBlank>
					{this.props.state.msg ? <p className="error-msg">{this.props.state.msg}</p> : null}
					<List>
						<InputItem onChange={(v) => { this.handleChange('user', v); }}>user</InputItem>
						<WhiteSpace />
						<InputItem onChange={(v) => { this.handleChange('pwd', v); }}>psd</InputItem>
					</List>
					<Button onClick={this.handleLogin} type="primary">登陆</Button>
					<WhiteSpace />
					<Button onClick={this.register} type="primary">
						注册
					</Button>
				</WingBlank>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		state: state.user
	};
};
  
const actionCreator = { login };
  
Login = connect(mapStateToProps, actionCreator)(Login);

export default Login;
