var React = require('react');

var { Menu, Button, Input, Select, Icon } = require('semantic-ui-react');


var { connect } = require('react-redux');
var actionInfo = require('../actions/actionInfo');

class TableAction extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { actionList, addOneActivity, deleteOneActivity, setActivity, setActStartTime, setActEndTime, actionsOptions } = this.props

        return (
            <Menu vertical fluid className='tableaction'>

                {actionList.activityList.map((elem, index) => (
                    <Menu.Item key={index} >
                        <Menu.Header className='titleEllipsis'>
                            {index + 1}.{elem.activity_desc}
                            <Icon data-index={index} onClick={deleteOneActivity} data-length={actionList.activityList.length} style={{ position: 'absolute', right: '1rem' }} size='large' loading name='delete' color='red' />
                        </Menu.Header>

                        <Menu.Menu>
                            <Menu.Item>
                                <Select placeholder='选择后续活动' data-index={index} value={elem.activity_code} style={{ width: '100%' }} options={actionsOptions} onChange={setActivity} />
                            </Menu.Item>
                            <Menu.Item>
                                <Input icon='hourglass empty' data-index={index} value={elem.actStartTime} type='date' onChange={setActStartTime} />
                            </Menu.Item>
                            <Menu.Item>
                                <Input icon='hourglass full' data-index={index} value={elem.actEndTime} type='date' onChange={setActEndTime} />
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu.Item>
                ))}

                <Menu.Item>
                    <Button color='orange' floated='right' size='tiny' onClick={addOneActivity} >ADD</Button>
                </Menu.Item>

            </Menu>
        )
    }
}


const mapStateToProps = (state, ownProps) => {
    return {
        actionList: state.actionInfo,
        bussiness_code: state.mainInfo.business_code,
        actionsOptions: state.mainInfo.actionsOptions
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        addOneActivity: () => {
            dispatch(actionInfo.AddOneActivity());
        },
        deleteOneActivity: (e) => {
            if (e.currentTarget.dataset.length <= 1) {
                $toast('至少有一条后续活动信息!', 2000);
                return;
            }
            dispatch(actionInfo.DeleteOneActivity(e.currentTarget.dataset.index));
        },
        setActivity: (e, data) => {
            var start = '', end = '';
            data.options.map((item) => {
                if (item.value === data.value) {
                    start = item.start;
                    end = item.end;
                }
            });
            dispatch(actionInfo.SetActivity(data['data-index'], data.value, e.target.innerText.split(/\n/)[0], start, end));
        },
        setActStartTime: (e, data) => {
            dispatch(actionInfo.SetActStartTime(data['data-index'], data.value));
        },
        setActEndTime: (e, data) => {
            dispatch(actionInfo.SetActEndTime(data['data-index'], data.value));
        },
        getAfterBO: (code) => {
            dispatch(actionInfo.getAfterBo(code));
        }
    }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(TableAction);