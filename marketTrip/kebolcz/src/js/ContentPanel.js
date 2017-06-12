var React = require('react');
var SemanticTouch = require('semantic-ui-react');

var Segment = SemanticTouch.Segment;
var Menu = SemanticTouch.Menu;
var Container = SemanticTouch.Container;

var FormHome = require('./FormHome.js');
var TableTrip = require('./TableTrip.js');
var TableAction = require('./TableAction.js');

var { connect } = require('react-redux');
var panel = require('../actions/panel');

class ContentPanel extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { visible, activeItem, title, handleItemClick, toggleVisibility } = this.props
        return (
            <div className="uf-f1 page-layout">
                <Menu pointing>
                    <Menu.Item name='home' className='beCenter' color='blue' active={activeItem === 'home'} onClick={handleItemClick}>出差详情</Menu.Item>
                    <Menu.Item name='trips' className='beCenter' color='olive' active={activeItem === 'trips'} onClick={handleItemClick}>出差行程</Menu.Item>
                    <Menu.Item name='actions' className='beCenter' color='orange' active={activeItem === 'actions'} onClick={handleItemClick}>后续活动</Menu.Item>
                </Menu>
                <Container fluid>
                    <Segment basic className={activeItem == 'home' ? '' : 'hidden'}>
                        <FormHome />
                    </Segment>
                    <Segment basic style={{ margin: '0' }} className={activeItem == 'trips' ? '' : 'hidden'}>
                        <TableTrip />
                    </Segment>
                    <Segment basic style={{ margin: '0' }} className={activeItem == 'actions' ? '' : 'hidden'}>
                        <TableAction />
                    </Segment>
                </Container>
            </div>
        )
    }
};


const mapStateToProps = (state, ownProps) => {
    return state.panel
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        handleItemClick: (e, data) => {
            dispatch(panel.validator(data.name));
        },
        toggleVisibility: () => {
            dispatch(panel.toggleVisibility());
        }
    };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(ContentPanel);