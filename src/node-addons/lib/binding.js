const addon = require("../build/Release/node-addons-native");

module.exports.fibonacci = addon.Fibonacci;
module.exports.linearSearch = addon.LinearSearch;
module.exports.binarySearch = addon.BinarySearch;
module.exports.bubbleSort = addon.BubbleSort;

function Queue(name) {
  this.push = function (item) {
    return _addonInstance.push(item);
  };
  this.pop = function () {
    return _addonInstance.pop();
  };
  this.peek = function () {
    return _addonInstance.peek();
  };
  this.isEmpty = function () {
    return _addonInstance.isEmpty();
  };

  var _addonInstance = new addon.Queue(name);
}

module.exports.Queue = Queue;
