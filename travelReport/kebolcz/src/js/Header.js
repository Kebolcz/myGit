var React = require('react');
// var ReactDOM = require('react-dom');
var { Button } = require('semantic-ui-react');

class ActionHeader extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <Button.Group id='header' color='blue' style={{ width: '100%' }}>
                    <Button labelPosition='left' icon='left chevron' data-action='back' content='返回' />
                    <Button content='出差确认' />
                    <Button labelPosition='right' icon='send outline' data-action='commit' content='提交' />
                </Button.Group>
            </div>
        )
    }
}

module.exports = ActionHeader;