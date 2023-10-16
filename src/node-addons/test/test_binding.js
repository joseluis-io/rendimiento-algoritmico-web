const NodeAddons = require("../lib/binding.js");
const assert = require("assert");

assert(NodeAddons, "The expected function is undefined");

function testBasic()
{
    const result =  NodeAddons("hello");
    assert.strictEqual(result, "world", "Unexpected value returned");
}

assert.doesNotThrow(testBasic, undefined, "testBasic threw an expection");

console.log("Tests passed- everything looks OK!");