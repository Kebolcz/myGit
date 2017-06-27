var React = require('react');
var { Segment, Menu, Container } = require('semantic-ui-react');

var MainInfo = require('./MainInfo.js');
var TripInfo = require('./TripInfo.js');
var TicketInfo = require('./TicketInfo.js');

var that = null;

class ContentPanel extends React.Component {
    constructor(props) {
        super(props);
        that = this;
        this.state = {
            activeItem: 'home'
        };
    }

    render() {
        return (
            <div className="uf-f1 page-layout">
                <Menu pointing secondary>
                    <Menu.Item name='home' data-name='home' className='beCenter' color='blue' active={this.state.activeItem === 'home'} onClick={this.handleClick} >出差信息</Menu.Item>
                    <Menu.Item name='trips' data-name='trips' className='beCenter' color='olive' active={this.state.activeItem === 'trips'} onClick={this.handleClick} >行程信息</Menu.Item>
                    <Menu.Item name='tickets' data-name='tickets' className='beCenter' color='orange' active={this.state.activeItem === 'tickets'} onClick={this.handleClick} >机票信息</Menu.Item>
                </Menu>
                
                <Container fluid>
                    <Segment basic className={this.state.activeItem == 'home' ? '' : 'hidden'}>
                        <MainInfo />
                    </Segment>
                    <Segment basic style={{ margin: '0' }} className={this.state.activeItem == 'trips' ? '' : 'hidden'}>
                        <TripInfo />
                    </Segment>
                    <Segment basic style={{ margin: '0' }} className={this.state.activeItem == 'tickets' ? '' : 'hidden'}>
                        <TicketInfo />
                    </Segment>
                </Container>
            </div>
        )
    }

    handleClick(e){
        switch(e.target.dataset.name){
            case 'home':
                that.setState({
                    activeItem: 'home'
                });
                break;
            case 'trips':
                that.setState({
                    activeItem: 'trips'
                });
                break;
            case 'tickets':
                that.setState({
                    activeItem: 'tickets'
                });
                break;
        }
    }
};


module.exports = ContentPanel;