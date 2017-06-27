var React = require('react');
var { Form, Input, TextArea } = require('semantic-ui-react');


var that = null;

class MainInfo extends React.Component {
    constructor(props) {
        super(props);
        that = this;
    }

    render() {
        return (
            <Form>
                <Form.Field>
                    <label>出差任务项</label>
                    <Input fluid placeholder='出差任务项' icon='travel' disabled />
                </Form.Field>
                <Form.Field>
                    <label>出差类型</label>
                    <Input fluid placeholder='出差类型' icon='world' disabled />
                </Form.Field>
                <Form.Field>
                    <label>受益部门</label>
                    <Input fluid placeholder='受益部门' icon='tumblr' disabled />
                </Form.Field>
                <Form.Field>
                    <label>服务订单号</label>
                    <Input fluid placeholder='服务订单号' icon='inr' disabled />
                </Form.Field>
                <Form.Field>
                    <label>商机号</label>
                    <Input fluid placeholder='商机号' icon='superpowers' disabled />
                </Form.Field>
                <Form.Field>
                    <label>业务板块</label>
                    <Input fluid placeholder='业务板块' icon='yelp' disabled />
                </Form.Field>
                <Form.Field>
                    <label>项目描述</label>
                    <TextArea placeholder='项目描述' autoHeight disabled />
                </Form.Field>
            </Form>
        )
    }
};


module.exports = MainInfo;