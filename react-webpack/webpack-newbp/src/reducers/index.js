var { combineReducers } = require('redux');
var header = require('./header');

const travelConfirm = combineReducers({
    header
})

module.exports = travelConfirm;