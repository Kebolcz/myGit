var React = require('react');
// var ReactDOM = require('react-dom');
var { Container, Dimmer, Header, Icon } = require('semantic-ui-react');

var ActionHeader = require('./Header.js');
var ContentPanel = require('./ContentPanel.js');
var ItemsModal = require('./ItemsModal.js');

class ContainerWraper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
            count: ''
        };
    }

    componentWillMount() {
        var that = this;
        ajaxRequest(configMasUrl.marketTrip, {
            "type": "GET",
            "data": {
                "action": 'getCount', //方法名
                "appid": 'aaali10031',
                'ident': 'marketTrip'
            }
            /*成功回调函数*/
        }, function (data, status, requestCode, response, xhr) {
            console.log(data);
            var json = JSON.parse(data);
            if (json[0].status === 1) {
                that.setState({
                    count: json[0].count
                });
            } else if (json.string.Success == "0") {
                that.setState({
                    count: 'NAN'
                });
            }
        }, function () {
            $toast("数据加载失败,请稍后再试.", 5000);
        });
    }

    render() {
        return (
            <Container fluid>
                <ActionHeader />
                <ContentPanel />
                <ItemsModal />
                <Dimmer
                    active={this.state.active}
                    page
                >
                    <Header as='h2' icon inverted>
                        <Icon name='heart' color='red' />
                        {gUserInfo["userId"]}
                        <Header.Subheader>{this.state.count ? '您是本应用的第' + this.state.count + '位使用者!' : '拉取使用日志失败.'}</Header.Subheader>
                    </Header>
                </Dimmer>
            </Container>
        )
    }

    componentDidMount() {
        var that = this;
        function hideDimmer() {
            that.setState({
                active: false
            });
        }
        setTimeout(hideDimmer, 3000);
    }
}

module.exports = ContainerWraper;