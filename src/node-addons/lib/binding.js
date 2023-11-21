const addon = require('../build/Release/node-addons-native');

module.exports.fibonacci = addon.Fibonacci
module.exports.linearSearch = addon.LinearSearch
