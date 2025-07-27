const libName = `./libalgorithm.so`;

// Open library and define exported symbols
const dylib = Deno.dlopen(
  libName,
  {
    "fib": { parameters: ["u64"], result: "u64" },
    "linearSearch": { parameters: ["buffer", "usize", "isize"], result: "i32" },
    "binarySearch": { parameters: ["buffer", "usize", "isize"], result: "i32" },
    "bubbleSort": { parameters: ["buffer", "usize"], result: "void" },
  },
);

const { fib, linearSearch, binarySearch, bubbleSort } = dylib.symbols;
import { Queue } from './queue.js';
import { Environment, exportToCSV } from '../shared/util.js';
import { BENCHMARK_INPUTS } from '../shared/inputs.js';

function benchmark(algorithm) {
  const results = [];
  const inputs = Array.from({ length: BENCHMARK_INPUTS.fib + 1 }, (_, i) => i);
  for (const input of inputs) {
    const start = performance.now();
    algorithm(input);
    const end = performance.now();
    results.push({
      algorithm: "fibonacci",
      input: input,
      time: end - start
    });
  }
  return results;
}

function generateInt32Array(size) {
  const array = new Int32Array(size);
  for (let i = 0; i < size; i++) {
    array[i] = i + 1;
  }
  return array;
}

function benchmarkLinearSearch(linearSearch) {
  const sizes = BENCHMARK_INPUTS.linear;
  const results = [];
  sizes.forEach(size => {
    const array = generateInt32Array(size);
    const searchValue = size;
    const start = performance.now();
    const result = linearSearch(array, array.length, searchValue);
    const end = performance.now();
    const duration = end - start;
    results.push({
      algorithm: "linearSearch",
      input: size,
      result: result,
      time: duration
    });
  });
  return results;
}

function benchmarkBinarySearch(binarySearch) {
  const results = [];
  const sizes = BENCHMARK_INPUTS.binary;
  sizes.forEach(size => {
    const array = generateInt32Array(size);
    const searchValue = size;
    const start = performance.now();
    const result = binarySearch(array, array.length, searchValue);
    const end = performance.now();
    const duration = end - start;
    results.push({
      algorithm: "binarySearch",
      input: size,
      result: result,
      time: duration
    });
  });
  return results;
}

function benchmarkBubbleSort(bubbleSort) {
  const results = [];
  const sizes = BENCHMARK_INPUTS.bubble;
  sizes.forEach(size => {
    const reversedArray = generateInt32Array(size).reverse();
    const start = performance.now();
    bubbleSort(reversedArray, reversedArray.length);
    const end = performance.now();
    const duration = end - start;
    results.push({
      algorithm: "bubbleSort",
      input: size,
      result: reversedArray,
      time: duration
    });
  });
  return results;
}

function benchmarkQueue() {
  const queue = new Queue();
  const sizes = BENCHMARK_INPUTS.queue;
  const results = [];
  sizes.forEach(size => {
    const start = performance.now();
    for (let i = 0; i < size; i++) {
      queue.push(i);
    }
    while (!queue.isEmpty()) {
      queue.pop();
    }
    const end = performance.now();
    const duration = end - start;
    results.push({
      algorithm: "Queue",
      input: size,
      time: duration
    });
  });
  return results;
}

const environment = new Environment();
environment.setFFI("Rust");

const alg = environment.getAlgorithmArg();
console.log(alg);

if (alg === "fib" || alg === "all") {
  const results = benchmark(fib);
  exportToCSV(results, 'fibonacci', environment);
}

if (alg === "lineal" || alg === "all") {
  const resultsLinearSearch = benchmarkLinearSearch(linearSearch);
  exportToCSV(resultsLinearSearch, 'linearSearch', environment);
}

if (alg === "binary" || alg === "all") {
  const resultsBinarySearch = benchmarkBinarySearch(binarySearch);
  exportToCSV(resultsBinarySearch, 'binarySearch', environment);
}

if (alg === "bubble" || alg === "all") {
  const resultsBubbleSort = benchmarkBubbleSort(bubbleSort);
  exportToCSV(resultsBubbleSort, 'bubbleSort', environment);
}

if (alg === "queue" || alg === "all") {
  const resultsQueue = benchmarkQueue();
  exportToCSV(resultsQueue, "queue", environment);
}