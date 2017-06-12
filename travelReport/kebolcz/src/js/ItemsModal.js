var React = require('react');
var { Button, Header, Icon, Modal, List } = require('semantic-ui-react');

var _ = require('lodash');
var faker = require('faker');

const source = _.times(20, () => ({
    key: faker.random.number(),
    no: faker.finance.account(),
    start: faker.date.past().toLocaleString(),
    end: faker.date.future().toLocaleString(),
    travelType: faker.name.prefix(),
}))

var that = null;

class ItemsModal extends React.Component {
    constructor(props) {
        super(props);
        that = this;
        that.state = {
            modalOpen: true
        };
    }

    render() {
        return (
            <div>
                <Modal open={this.state.modalOpen} closeIcon='close' onClose={this.handleClose}>
                    <Header icon='archive' content='Choose Travel Info Form 选择出差任务项' />
                    <Modal.Content>
                        <List divided relaxed>
                            {source.map((elem, index) => {
                                return (
                                    <List.Item key={elem.key} onClick={this.handleClick}>
                                        <List.Content floated='right' as='button' disabled>
                                            {elem.travelType}
                                        </List.Content>
                                        <List.Content>
                                            <List.Header as='a' disabled className='font32'>
                                                {elem.no}
                                            </List.Header>
                                            <List.Content>
                                                <List.Icon name='hourglass empty' color='green' size='small' />
                                                {elem.start}
                                            </List.Content>
                                            <List.Content>
                                                <List.Icon name='hourglass full' color='red' size='small' />
                                                {elem.end}
                                            </List.Content>
                                        </List.Content>
                                    </List.Item>
                                )
                            })}
                        </List>
                    </Modal.Content>
                </Modal>
                <Button onClick={this.handleOpen} className='floatBtn' color='grey'>筛选</Button>
            </div>
        )
    }

    handleClick(e){
        that.setState({
            modalOpen: false
        });
    }

    handleOpen(e){
        that.setState({
            modalOpen: true
        });
    }

    handleClose(e){
        that.setState({
            modalOpen: false
        });
    }
};


module.exports = ItemsModal;