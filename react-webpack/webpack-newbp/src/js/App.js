var React = require('react');
var { Container } = require('semantic-ui-react');

var ActionHeader = require('./Header.js');
var ContentPanel = require('./ContentPanel.js');
var ItemsModal = require('./ItemsModal.js');

class ContainerWraper extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container fluid>
                <ActionHeader />
                <ContentPanel />
                <ItemsModal />
            </Container>
        )
    }
}

module.exports = ContainerWraper;