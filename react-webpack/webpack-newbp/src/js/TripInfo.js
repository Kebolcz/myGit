var React = require('react');
var { Segment, Input, Checkbox, TextArea, Icon } = require('semantic-ui-react');


var that = null;

class TripInfo extends React.Component {
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
                <Segment><Icon name='compass' color='olive' />出差行程</Segment>
                <Segment.Group>
                    <Segment inverted color='red'>行程1</Segment>
                    <Segment>
                        <label>起始时间</label>
                        <Input fluid placeholder='起始时间' icon='hourglass empty' disabled />
                    </Segment>
                    <Segment>
                        <label>截止时间</label>
                        <Input fluid placeholder='截止时间' icon='hourglass full' disabled />
                    </Segment>
                    <Segment>
                        <label>出发城市</label>
                        <Input fluid placeholder='出发城市' icon='settings' disabled />
                    </Segment>
                    <Segment>
                        <label>出差地点</label>
                        <Input fluid placeholder='出差地点' icon='settings' disabled />
                    </Segment>
                </Segment.Group>
                <Segment.Group>
                    <Segment inverted color='green'>行程2</Segment>
                    <Segment>
                        <label>起始时间</label>
                        <Input fluid placeholder='起始时间' icon='hourglass empty' disabled />
                    </Segment>
                    <Segment>
                        <label>截止时间</label>
                        <Input fluid placeholder='截止时间' icon='hourglass full' disabled />
                    </Segment>
                    <Segment>
                        <label>出发城市</label>
                        <Input fluid placeholder='出发城市' icon='settings' disabled />
                    </Segment>
                    <Segment>
                        <label>出差地点</label>
                        <Input fluid placeholder='出差地点' icon='settings' disabled />
                    </Segment>
                </Segment.Group>
                <Segment secondary>
                    <label>起始时间</label>
                    <Input fluid placeholder='起始时间' icon='hourglass empty' disabled />
                </Segment>
                <Segment secondary>
                    <label>截止时间</label>
                    <Input fluid placeholder='截止时间' icon='hourglass full' disabled />
                </Segment>
                <Segment secondary>
                    <label>出差天数</label>
                    <Input fluid placeholder='出差天数' icon='settings' disabled />
                </Segment>
                <Segment secondary>
                    <label>出差事由</label>
                    <Input fluid placeholder='出差事由' icon='write' />
                </Segment>
                <Segment secondary>
                    <label>出差总结</label>
                    <Input fluid placeholder='出差总结' icon='write' />
                </Segment>
                <Segment secondary>
                    <Checkbox toggle label='归档资料' onChange={this.toggleHanler} />
                    <TextArea autoHeight placeholder='归档资料' className={this.state.archiveData ? '' : 'hidden'} />
                </Segment>
            </Segment.Group>
        )
    }

    toggleHanler(e){
        that.setState({
            archiveData: !that.state.archiveData
        });
    }
};


module.exports = TripInfo;