const libName = `./libalgorithm.so`;
import assert from "node:assert";

// Open library and define exported symbols
const dylib = Deno.dlopen(
  libName,
  {
    "fib": { parameters: ["u64"], result: "u64" },
    "linearSearch": { parameters: ["buffer", "usize", "isize"], result: "i32" },
    "binarySearch": { parameters: ["buffer", "usize", "isize"], result: "i32" },
  } as const,
);

const { fib, linearSearch, binarySearch } = dylib.symbols;

function testFibonacci() {
  assert(fib(0) == 0);
  assert(fib(1) == 1);
  assert(fib(2) == 1);
  assert(fib(3) == 2);
  assert(fib(4) == 3);
  assert(fib(5) == 5);
  assert(fib(10) == 55);
  console.log("Fibonacci tests passed");
}

function testLinearSearch() {
  const array = new Int32Array([1, 2, 3, 4, 5, 6, 7, 8]);
  assert(linearSearch(array, array.length, 7) == 6);
  assert(linearSearch(array, array.length, 33) == -1);
  console.log("LinearSearch tests passed");
}

function testBinarySearch() {
  const sortedArray = new Int32Array([1, 2, 3, 4, 5, 6, 7, 8]);
  assert(binarySearch(sortedArray, sortedArray.length, 7) == 6);
  assert(binarySearch(sortedArray, sortedArray.length, 33) == -1);
  console.log("BinarySearch tests passed");
}

function main() {
  testFibonacci();
  testLinearSearch();
  testBinarySearch();
  console.log("Tests passed- everything looks OK!");
}

main();
