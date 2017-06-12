var React = require('react');
var SemanticTouch = require('semantic-ui-react');

var _ = require('lodash');

var { connect } = require('react-redux');
var mainInfo = require('../actions/mainInfo');

var { Search, TextArea, Form, Select, Card, Icon, Checkbox } = require('semantic-ui-react');

var source = [];

const businessOptions = [
    { value: '0', text: '请选择' },
    { value: '00008000170000100001000000000000000000000000000000', text: '城轨-上海' },
    { value: '00008000170000100002000000000000000000000000000000', text: '城轨-北京' },
    { value: '00008000170000100003000000000000000000000000000000', text: '国铁-上海南方' },
    { value: '00008000170000100004000000000000000000000000000000', text: '国铁-北京' },
    { value: '00008000170000100005000000000000000000000000000000', text: '国铁-上海北方' },
    { value: '00008000170000100006000000000000000000000000000000', text: '商务-上海' },
    { value: '00008000170000100007000000000000000000000000000000', text: '商务-北京' },
    { value: '00008000170000100008000000000000000000000000000000', text: '公共关系' },
    { value: '00008000170000100009000000000000000000000000000000', text: '海外' }
]
const bookTypeOptions = [
    { value: '0', text: '请选择' },
    { value: '1', text: '公司统一订票' },
    { value: '2', text: '个人自购' }
]

var obj = null;

const resultRenderer = ({ Data01, Data04, Data05, Data07 }) => (
    <Card key={Data01}>
        <Card.Content>
            <Card.Header>{Data07}</Card.Header>
            <Card.Meta>商机编号:{Data01}</Card.Meta>
            <Card.Description>项目编号:{(Data04 == '' || Data04 == null) ? '暂无项目编号' : Data04}</Card.Description>
        </Card.Content>
        <Card.Content extra>
            <Icon name='share alternate square' />
            内部订单号:{(Data05 == '' || Data05 == null) ? '暂无内部订单号' : Data05}
        </Card.Content>
    </Card>
)


class mainInfoPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        }
        obj = this;
    }

    componentWillMount() {
        this.props.getDept();
        this.props.getBusinessData();
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            value: nextProps.value
        })
    }

    render() {
        const { isLoading, value, results, business_code, business_desc, depart_code, economy, depart_desc, btype_code, btype_desc, setBType, setDepart,
            handleResultSelect, handleSearchChange, setBookType, economyOrNot, setTripReason, setNonEconReason, departList, businessData } = this.props
        source = { businessData }
        return (

            <Form>
                <Form.Field>
                    <label>商机</label>
                    <Search
                        loading={isLoading}
                        onResultSelect={handleResultSelect}
                        onSearchChange={this.handleSearchInput}
                        noResultsDescription='只支持对商机描述进行模糊查询'
                        placeholder='请输入关键字进行检索'
                        results={results}
                        value={this.state.value}
                        resultRenderer={resultRenderer}
                        fluid
                    />
                </Form.Field>
                <Form.Field>
                    <label>受益部门</label>
                    <Select placeholder='Select your department' data-desc={depart_desc} value={depart_code} options={departList} onChange={setDepart} />
                </Form.Field>
                <Form.Field>
                    <label>业务板块</label>
                    <Select placeholder='Select business type' data-desc={btype_desc} value={btype_code} options={businessOptions} onChange={setBType} />
                </Form.Field>
                <Form.Field>
                    <label>订票方式</label>
                    <Select placeholder='Select book type' options={bookTypeOptions} onChange={setBookType} />
                </Form.Field>
                <Form.Field>
                    <label>出差事由</label>
                    <TextArea placeholder='请填写出差事由' autoHeight onChange={setTripReason} />
                </Form.Field>
                <Form.Field>
                    <Checkbox label='需订购非经济舱' onChange={economyOrNot} checked={economy} />
                    <TextArea placeholder='请填写订购非经济舱原因' className={economy ? '' : 'hidden'} autoHeight onChange={setNonEconReason} />
                </Form.Field>
            </Form>
        )
    }

    handleSearchInput(e, value){
        obj.setState({
            value: e.target.value
        });
        obj.props.handleSearchChange(e, value);
    }
}


const mapStateToProps = (state, ownProps) => {
    return {
        business_code: state.mainInfo.business_code,
        business_desc: state.mainInfo.business_desc,
        depart_code: state.mainInfo.depart_code,
        depart_desc: state.mainInfo.depart_desc,
        btype_code: state.mainInfo.btype_code,
        btype_desc: state.mainInfo.btype_desc,
        isLoading: state.mainInfo.isLoading,
        results: state.mainInfo.results,
        value: state.mainInfo.value,
        economy: state.mainInfo.economy,
        departList: state.mainInfo.departList,
        businessData: state.mainInfo.businessData
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    
    var synchronousFile = function (value) {
        if (value.length < 1) {
            dispatch(mainInfo.setResult('', ''));
        }

        const re = new RegExp(_.escapeRegExp(value), 'i')
        const isMatch = (result) => re.test(result.Data07)

        let temp = _.filter(source.businessData, isMatch);
        dispatch(mainInfo.searchResult(value, false, temp));
    }

    var synchronousInput = function (value) {
        dispatch(mainInfo.setTripReason(value));
    }

    var synchronousText = function (value) {
        dispatch(mainInfo.setNonEconReason(value));
    }

    var proxySynchronousFile = (function () {
        var cache, timer;

        return function (type,value) {
            cache = value;
            if (timer) {
                return
            }

            timer = setTimeout(function () {
                switch(type){
                    case 'searchChange':
                        synchronousFile(cache);
                        break;
                    case 'tripReason':
                        synchronousInput(cache);
                        break;
                    case 'nonEconomy':
                        synchronousText(cache);
                        break;
                }
                clearTimeout(timer);
                timer = null;
                cache = null;
            }, 1500)
        }
    })();

    return {
        setBType: (e, data) => {
            dispatch(mainInfo.setBusinessType(data.value, e.target.innerText.split(/\n/)[0]));
        },
        setDepart: (e, data) => {
            dispatch(mainInfo.setDepart(data.value, e.target.innerText.split(/\n/)[0]));
        },
        setBookType: (e, data) => {
            dispatch(mainInfo.setBookType(data.value, e.target.innerText.split(/\n/)[0]));
        },
        handleResultSelect: (e, result) => {
            dispatch(mainInfo.selectBusinessAndSetBoOption(result.Data01, result.Data07, result.Data05, result.Data03, result.Data04));
        },
        economyOrNot: (e, data) => {
            dispatch(mainInfo.EconomyOrNot(data.checked));
            if (!data.checked) {
                dispatch(mainInfo.setNonEconReason(''));
            }
        },
        setTripReason: (e, data) => {
            proxySynchronousFile('tripReason',data.value);
        },
        setNonEconReason: (e, data) => {
            proxySynchronousFile('nonEconomy',data.value)
        },
        handleSearchChange: (e, value) => {
            // dispatch(mainInfo.searchResult(value, true, []));
            proxySynchronousFile('searchChange',value);
        },
        getDept: () => {
            dispatch(mainInfo.fetchPostsIfNeeded());
        },
        getBusinessData: () => {
            dispatch(mainInfo.getBusinessData());
        }
    };
}



module.exports = connect(mapStateToProps, mapDispatchToProps)(mainInfoPanel);