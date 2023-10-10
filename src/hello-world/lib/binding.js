const addon = require('../build/Release/hello-world-native');

module.exports.helloWorld = addon.HelloWorld
module.exports.byeWorld = addon.ByeWorld
module.exports.multiplyBy10 = addon.MultiplyBy10
