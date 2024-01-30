const { fibonacci, linearSearch, binarySearch } = require("../lib/binding.js");
const assert = require("assert");

function testFibonacci() {
  assert(fibonacci(0) == 0);
  assert(fibonacci(1) == 1);
  assert(fibonacci(2) == 1);
  assert(fibonacci(3) == 2);
  assert(fibonacci(4) == 3);
  assert(fibonacci(5) == 5);
  assert(fibonacci(10) == 55);
  console.log("Fibonacci tests passed");
}

function testLinearSearch() {
  const array = new Int32Array([1, 2, 3, 4, 5, 6, 7, 8]);
  assert(linearSearch(array.buffer, 7) == 6);
  assert(linearSearch(array.buffer, 33) == -1);
  console.log("LinearSearch tests passed");
}

function testBinarySearch() {
  const sortedArray = new Int32Array([1, 2, 3, 4, 5, 6, 7, 8]);
  assert(binarySearch(sortedArray.buffer, 7) == 6);
  assert(binarySearch(sortedArray.buffer, 33) == -1);
  console.log("BinarySearch tests passed");
}

function main() {
  testFibonacci();
  testLinearSearch();
  testBinarySearch();
  console.log("Tests passed- everything looks OK!");
}

main();
