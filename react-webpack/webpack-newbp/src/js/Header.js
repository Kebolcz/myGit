var React = require('react');
var { Header, Button, Modal, Dimmer, Loader } = require('semantic-ui-react');

var { connect } = require('react-redux');
var header = require('../actions/header');

class ActionHeader extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { finalSource, handleClick, open, title, content, action, handleModalNo, handleModalYes, loading } = this.props;
        return (
            <div>
                <Dimmer className={loading ? 'active' : ''}>
                    <Loader>Loading</Loader>
                </Dimmer>

                <Button.Group id='header' color='blue' style={{ width: '100%' }}>
                    <Button labelPosition='left' icon='left chevron' data-action='back' content='返回' onClick={handleClick} />
                    <Button content='出差确认' />
                    <Button labelPosition='right' icon='send outline' data-action='commit' content='提交' onClick={handleClick} />
                </Button.Group>

                <Modal size='small' open={open} onClose={this.close}>
                    <Modal.Header>
                        {title}
                    </Modal.Header>
                    <Modal.Content>
                        <p>{content}</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button negative onClick={handleModalNo}>
                            不是
                        </Button>
                        <Button positive icon='checkmark' labelPosition='right' data-action={action} data-final={finalSource} content='是' onClick={handleModalYes} />
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        finalSource: state,
        open: state.header.open,
        title: state.header.title,
        content: state.header.content,
        action: state.header.action,
        loading: state.header.loading
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    //前置装饰模式,提交表单前进行验证操作.分离表单验证和表单提交
    Function.prototype.before = function (beforeFn) {
        var _self = this;
        return function () {
            if (beforeFn.apply(this, arguments) === false) {
                return;
            }
            return _self.apply(this, arguments);
        }
    };
    //表单验证Func
    var validate = function (finalSource) {

    }
    //表单提交Func
    var formSubmit = function (finalSource) {
        dispatch(header.toggleToast());


        setTimeout(test, 2000);
    }
    function test() {
        dispatch(header.toggleToast());
        appcan.window.close(-1);
    }
    //提交表单前进行验证操作
    formSubmit = formSubmit.before(validate);

    return {
        handleClick: (e, data) => {
            if (data['data-action'] === 'back') {
                dispatch(header.handleClick('back', '返回', '返回操作将丢失本页数据,确定吗?'));
            } else if (data['data-action'] === 'commit') {
                dispatch(header.handleClick('commit', '提交', '提交操作将提交表单,确定吗?'));
            }
        },
        handleModalNo: (e, data) => {
            dispatch(header.closeModal());
        },
        handleModalYes: (e, data) => {
            if (data['data-action'] === 'back') {
                dispatch(header.closeModal());
                appcan.window.close(-1);
            } else if (data['data-action'] === 'commit') {
                dispatch(header.closeModal());
                let finalSource = data['data-final'];
                if (true) {
                    formSubmit(finalSource);
                }
            }
        }
    };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(ActionHeader);