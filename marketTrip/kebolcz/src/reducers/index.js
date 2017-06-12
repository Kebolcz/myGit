var { combineReducers } = require('redux');
var mainInfo = require('./mainInfo');
var tripInfo = require('./tripInfo');
var panel = require('./panel');
var actionInfo = require('./actionInfo');
var header = require('./header');

const marketTrip = combineReducers({
  header,
  mainInfo,
  tripInfo,
  panel,
  actionInfo
})

module.exports = marketTrip;