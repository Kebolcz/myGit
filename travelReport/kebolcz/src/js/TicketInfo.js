var React = require('react');
var { Segment, Input, Checkbox, TextArea, Icon } = require('semantic-ui-react');


var that = null;

class TicketInfo extends React.Component {
    constructor(props) {
        super(props);
        that = this;
        that.state = {
            archiveData: false
        };
    }

    render() {
        return (
            <Segment.Group>
                <Segment><Icon name='ticket' color='orange' />请选择实际发生的机票</Segment>
                <Segment.Group>
                    <Segment>
                        <Checkbox toggle label='机票信息1' />
                    </Segment>
                    <Segment>
                        <label>交通工具</label>
                        <Input fluid placeholder='交通工具' icon='settings' disabled />
                    </Segment>
                    <Segment>
                        <label>出发日期</label>
                        <Input fluid placeholder='出发日期' icon='settings' disabled />
                    </Segment>
                    <Segment>
                        <label>出发城市</label>
                        <Input fluid placeholder='出发城市' icon='settings' disabled />
                    </Segment>
                    <Segment>
                        <label>到达城市</label>
                        <Input fluid placeholder='到达城市' icon='settings' disabled />
                    </Segment>
                    <Segment>
                        <label>出发时间</label>
                        <Input fluid placeholder='出发时间' icon='settings' disabled />
                    </Segment>
                    <Segment>
                        <label>到达日期</label>
                        <Input fluid placeholder='到达日期' icon='write' />
                    </Segment>
                    <Segment>
                        <label>到达时间</label>
                        <Input fluid placeholder='到达时间' icon='write' />
                    </Segment>
                    <Segment>
                        <label>预期航班(火车)</label>
                        <Input fluid placeholder='预期航班' value='1234qwe' icon='settings' disabled />
                    </Segment>
                    <Segment>
                        <label>航班(火车)信息</label>
                        <Input fluid placeholder='航班信息' icon='settings' disabled />
                    </Segment>
                    <Segment>
                        <label>航站楼(火车站)</label>
                        <Input fluid placeholder='航站楼(火车站)' icon='settings' disabled />
                    </Segment>
                    <Segment>
                        <label>价格</label>
                        <Input fluid placeholder='价格' icon='settings' disabled />
                    </Segment>
                    <Segment>
                        <label>订票费</label>
                        <Input fluid placeholder='订票费' icon='settings' disabled />
                    </Segment>
                    <Segment>
                        <label>类型</label>
                        <Input fluid placeholder='类型' icon='write' />
                    </Segment>
                    <Segment>
                        <label>电子客票号</label>
                        <Input fluid placeholder='电子客票号' icon='write' />
                    </Segment>
                </Segment.Group>
            </Segment.Group>
        )
    }

    toggleHanler(e) {
        that.setState({
            archiveData: !that.state.archiveData
        });
    }
};


module.exports = TicketInfo;