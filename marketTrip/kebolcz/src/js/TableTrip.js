var React = require('react');

var { Accordion, List, Label, Segment, Input, Select, Button, Icon, Checkbox, Search } = require('semantic-ui-react');

var { connect } = require('react-redux');
var tripInfo = require('../actions/tripInfo');

const typeOptions = [
    { key: '0', value: '0', text: '请选择' },
    { key: '1', value: '1', text: '去程' },
    { key: '2', value: '2', text: '中转' },
    { key: '3', value: '3', text: '返程' }
]
var vehicleSource = [{ key: '0', value: '0', text: '请选择' }];

var _ = require('lodash');

var source = [];
var that = null;

const resultRenderer = ({ cityCode, cityName }) => (
    <Label content={cityName} />
)
class TableTrip extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        }
        that = this;
    }

    componentWillMount() {
        this.props.getCity();
    }

    //行程panel
    panels() {
        const { tripInfo, deleteTripBtn, handleAddTicket, setTripStart, setTripEnd, handleResultSelect, applyOrNot } = this.props;
        source = tripInfo.citiesData;
        return tripInfo.tripsList.map((elem, index) => ({
            key: index,
            title: <Label style={{ width: '14rem' }} color='blue' content={(Number(index) + 1) + '.【行程】' + elem.startCity + (elem.startCity ? '→' : '') + elem.endCity} />,
            content: (
                <List divided className='tripList'>
                    <div className='deleteTripBtn' data-index={index} data-length={tripInfo.tripsList.length} onClick={deleteTripBtn}>
                        <Icon name='shutdown' size='large' color='red' />
                    </div>
                    <List.Item>
                        <label>起始时间</label>
                        <Input className='inputRight' data-index={index} value={elem.startDate} type='datetime-local' onChange={setTripStart} />
                    </List.Item>
                    <List.Item>
                        <label>截止时间</label>
                        <Input className='inputRight' data-index={index} value={elem.endDate} type='datetime-local' onChange={setTripEnd} />
                    </List.Item>
                    <List.Item>
                        <label>出发城市</label>
                        <Search
                            data-index={index}
                            data-mytype='startCity'
                            className='inputRight'
                            loading={tripInfo.isLoading}
                            onResultSelect={handleResultSelect}
                            onSearchChange={this.handleSearchInput}
                            results={tripInfo.results}
                            value={that.state.mytype === 'startCity' && that.state.value != '' ? that.state.value : elem.startCity}
                            resultRenderer={resultRenderer}
                            noResultsDescription='支持对城市名称进行模糊查询'
                            fluid
                        />
                    </List.Item>
                    <List.Item>
                        <label>出差地点</label>
                        <Search
                            data-index={index}
                            data-mytype='endCity'
                            className='inputRight'
                            loading={tripInfo.isLoading}
                            onResultSelect={handleResultSelect}
                            onSearchChange={this.handleSearchInput}
                            results={tripInfo.results}
                            value={that.state.mytype === 'endCity' && that.state.value != '' ? that.state.value : elem.endCity}
                            resultRenderer={resultRenderer}
                            noResultsDescription='支持对城市名称进行模糊查询'
                            fluid
                        />
                    </List.Item>
                    <List.Item className='beCenter' style={{ position: 'relative' }}>
                        <Checkbox toggle label="申请机票(火车票)" data-index={index} checked={elem.ticketaApply} onChange={applyOrNot} />
                        <div style={{ position: 'absolute', right: '0' }} className={elem.ticketaApply ? '' : 'hidden'} data-index={index} onClick={handleAddTicket}>
                            <Icon name='add' size='large' color='green' />
                        </div>
                    </List.Item>
                    <List.Item>
                        <Accordion className={elem.ticketaApply ? '' : 'hidden'} panels={this.ticketPanels(index, elem.ticketsList)} />
                    </List.Item>
                </List>
            )
        }));
    }

    //票务panel
    ticketPanels(index, tickets) {
        const { tripInfo, vehicleOptions, deleteTicketBtn, handleSub, handleSubAsyn, handleResultSelect, handleSearchChangeAsyn } = this.props;
        vehicleSource = vehicleOptions;
        return tickets.map((elem, i) => ({
            key: i,
            title: <Label style={{ width: '12rem' }} color='green' content={(Number(index) + 1) + '.' + (Number(i) + 1) + '.【票务】' + elem.subStartCity + (elem.subStartCity ? '→' : '') + elem.subEndCity} />,
            content: (
                <List divided className='tripList'>
                    <div className='deleteTripBtn' data-index={index} data-i={i} data-length={tripInfo.tripsList[index].ticketsList.length} onClick={deleteTicketBtn}>
                        <Icon name='shutdown' size='large' color='red' />
                    </div>
                    <List.Item>
                        <label>类型</label>
                        <Select className='subInputRight' placeholder='Select the type' data-index={index} data-i={i} data-mytype='type' value={elem.type} options={typeOptions} onChange={handleSub} />
                    </List.Item>
                    <List.Item>
                        <label>交通工具</label>
                        <Select className='subInputRight' placeholder='Select vehicle' data-index={index} data-i={i} data-mytype='vehicle' value={elem.vehicle} options={vehicleSource} onChange={handleSub} />
                    </List.Item>
                    <List.Item>
                        <label>出发时间</label>
                        <Input className='subInputRight' value={elem.startTime} type='datetime-local' data-index={index} data-i={i} data-mytype='startTime' onChange={handleSub} />
                    </List.Item>
                    <List.Item>
                        <label>出发城市</label>
                        <Search
                            data-index={index}
                            data-i={i}
                            data-mytype='subStartCity'
                            className='subInputRight'
                            loading={tripInfo.isLoading}
                            onResultSelect={handleResultSelect}
                            onSearchChange={this.handleSearchInput}
                            results={tripInfo.results}
                            value={that.state.mytype === 'subStartCity' && that.state.value != '' ? that.state.value : elem.subStartCity}
                            resultRenderer={resultRenderer}
                            noResultsDescription='支持对城市名称进行模糊查询'
                            fluid
                        />
                    </List.Item>
                    <List.Item>
                        <label>出差地点</label>
                        <Search
                            data-index={index}
                            data-i={i}
                            data-mytype='subEndCity'
                            className='subInputRight'
                            loading={tripInfo.isLoading}
                            onResultSelect={handleResultSelect}
                            onSearchChange={this.handleSearchInput}
                            results={tripInfo.results}
                            value={that.state.mytype === 'subEndCity' && that.state.value != '' ? that.state.value : elem.subEndCity}
                            resultRenderer={resultRenderer}
                            noResultsDescription='支持对城市名称进行模糊查询'
                            fluid
                        />
                    </List.Item>
                    <List.Item>
                        <label>预计航班</label>
                        <Input className='subInputRight' data-index={index} data-i={i} data-mytype='flight' onChange={handleSubAsyn} />
                    </List.Item>
                    <List.Item>
                        <label>备注</label>
                        <Input className='subInputRight' data-index={index} data-i={i} data-mytype='remark' onChange={handleSubAsyn} />
                    </List.Item>
                </List>
            )
        }))
    }

    render() {
        const { handleAddTrip } = this.props
        return (
            <div>
                <Accordion panels={this.panels()} fluid styled />
                <Button color='olive' fluid className='addTripBtn' onClick={handleAddTrip}>添加行程</Button>
            </div>
        )
    }

    handleSearchInput(e, value) {
        that.setState({
            value: e.target.value,
            mytype: e.target.parentElement.parentElement.dataset.mytype
        });
        that.props.handleSearchChangeAsyn(e, value);
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        tripInfo: state.tripInfo,
        vehicleOptions: state.mainInfo.vehicleOptions
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {

    var synchronousFile = function (index, i, mytype, value) {
        if (value.length < 1) {
            dispatch(tripInfo.SetResult('', ''));
        }

        const re = new RegExp(_.escapeRegExp(value), 'i')
        const isMatch = (result) => re.test(result.cityName)

        let temp = _.filter(source, isMatch);
        dispatch(tripInfo.SearchResult(value, false, temp, index, i, mytype));
    }

    var proxySynchronousFile = (function () {
        var data1, data2, data3, data4, timer;

        return function (index, i, mytype, value) {
            data1 = index;
            data2 = i;
            data3 = mytype;
            data4 = value;
            if (timer) {
                return
            }

            timer = setTimeout(function () {
                synchronousFile(data1, data2, data3, data4);
                clearTimeout(timer);
                timer = null;
                data1 = null;
                data2 = null;
                data3 = null;
                data4 = null;
            }, 0)
        }
    })();

    var synchronousInput = function (data1, data2, data3, data4) {
        dispatch(tripInfo.HandleSub(data1, data2, data3, data4));
    }

    var proxySynchronousInput = (function () {
        var data1, data2, data3, data4, timer;

        return function (index, i, mytype, value) {
            data1 = index;
            data2 = i;
            data3 = mytype;
            data4 = value;
            if (timer) {
                return
            }

            timer = setTimeout(function () {
                synchronousInput(data1, data2, data3, data4);
                clearTimeout(timer);
                timer = null;
                data1 = null;
                data2 = null;
                data3 = null;
                data4 = null;
            }, 1500)
        }
    })();

    return {
        handleAddTrip: () => {
            dispatch(tripInfo.AddOneTrip());
        },
        handleAddTicket: (e) => {
            dispatch(tripInfo.AddOneTicket(e.currentTarget.dataset.index));
        },
        deleteTripBtn: (e) => {
            if (e.currentTarget.dataset.length <= 1) {
                $toast('至少有一条出差行程!', 2000);
                return;
            }
            dispatch(tripInfo.DeleteOneTrip(e.currentTarget.dataset.index));
        },
        deleteTicketBtn: (e) => {
            var index = e.currentTarget.dataset.index;
            var i = e.currentTarget.dataset.i;
            if (e.currentTarget.dataset.length <= 1) {
                $toast('至少有一条票务申请!', 2000);
                return;
            }
            dispatch(tripInfo.DeleteOneTicket(index, i));
        },
        setTripStart: (event, data) => {
            dispatch(tripInfo.SetTripStart(data['data-index'], data.value));
        },
        setTripEnd: (event, data) => {
            dispatch(tripInfo.SetTripEnd(data['data-index'], data.value));
        },
        // positionClick: (event, data) => {
        //     dispatch(tripInfo.PositionClick(data['data-index'], typeof (data['data-i']) == 'undefined' ? '' : data['data-i'], data['data-mytype']));
        // },
        handleResultSelect: (e, result) => {
            that.setState({
                value: result.cityName
            });
            dispatch(tripInfo.SetResult(result.cityCode, result.cityName));
        },
        handleSearchChangeAsyn: (e, value) => {
            // dispatch(tripInfo.SearchResult(value, true, []));
            var obj = e.target.parentElement.parentElement.dataset;
            proxySynchronousFile(obj.index, obj.i, obj.mytype, value);
        },
        handleSearchChange: (e, value) => {
            dispatch(tripInfo.SearchResult(value, true, []));
        },
        applyOrNot: (e, data) => {
            dispatch(tripInfo.ApplyOrNot(e.currentTarget.dataset.index, data.checked));
        },
        handleSubAsyn: (e, data) => {
            proxySynchronousInput(data['data-index'], data['data-i'], data['data-mytype'], data.value);
        },
        handleSub: (e, data) => {
            dispatch(tripInfo.HandleSub(data['data-index'], data['data-i'], data['data-mytype'], data.value));
        },
        getCity: () => {
            dispatch(tripInfo.fetchCitiesIfNeeded());
        },
    };
}


module.exports = connect(mapStateToProps, mapDispatchToProps)(TableTrip);