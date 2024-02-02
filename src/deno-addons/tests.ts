const libName = `./libalgorithm.so`;
import assert from "node:assert";

// Open library and define exported symbols
const dylib = Deno.dlopen(
  libName,
  {
    "fib": { parameters: ["u64"], result: "u64" },
    "linearSearch": { parameters: ["buffer", "usize", "isize"], result: "i32" },
    "binarySearch": { parameters: ["buffer", "usize", "isize"], result: "i32" },
    "bubbleSort": { parameters: ["buffer", "usize"], result: "void" },
  } as const,
);

const { fib, linearSearch, binarySearch, bubbleSort } = dylib.symbols;

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

function cmpArrays(x, y) {
  if (x.length !== y.length) {
    return false;
  } else {
    for (let i = 0; i < x.length; i++) {
      if (x[i] !== y[i]) {
        return false;
      }
    }
    return true;
  }
}

function testBubbleSort() {
  const unsortedArray = new Int32Array([3, 9, 10, 8, 7, 5, 2, 6, 1, 4]);
  const sortedArray = new Int32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const anotherSortedArray = new Int32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  bubbleSort(unsortedArray, unsortedArray.length);
  assert(cmpArrays(unsortedArray, sortedArray), "bubbleSort(unsortedArray)");
  bubbleSort(anotherSortedArray, unsortedArray.length);
  assert(
    cmpArrays(anotherSortedArray, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    "bubbleSort(sortedArray)",
  );
  const sameNumbers = new Int32Array([3, 3, 3, 3]);
  bubbleSort(sameNumbers, sameNumbers.length);
  assert(
    cmpArrays(sameNumbers, [3, 3, 3, 3]),
    "bubbleSort(bubbleSort(sameNumbers))",
  );
  console.log("BubbleSort tests passed");
}

function main() {
  testFibonacci();
  testLinearSearch();
  testBinarySearch();
  testBubbleSort();
  console.log("Tests passed- everything looks OK!");
}

main();
