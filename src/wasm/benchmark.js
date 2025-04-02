import { Environment, exportToCSV } from '../shared/util.js';

const environment = new Environment();
environment.setFFI("WASM");

WebAssembly.instantiateStreaming(fetch("./algorithm.wasm")).then(
    (res) => {
        const { fib, linearSearch, binarySearch, bubbleSort, memory } =
            res.instance.exports;

        const resultsFibonacci = benchmarkFibonacci(fib, 20);
        exportToCSV(resultsFibonacci, "fibonacci", environment);

        const resultsLinearSearch = benchmarkLinearSearch(linearSearch, memory);
        exportToCSV(resultsLinearSearch, "linearSearch", environment);

        const resultsBinarySearch = benchmarkBinarySearch(binarySearch, memory);
        exportToCSV(resultsBinarySearch, "binarySearch", environment);

        const resultsBubbleSort = benchmarkBubbleSort(bubbleSort, memory);
        exportToCSV(resultsBubbleSort, "bubbleSort", environment);

        const resultsQueue = benchmarkQueue(memory);
        exportToCSV(resultsQueue, "queue", environment);
    },
);

function benchmarkFibonacci(fibonacci, inputs) {
    const results = [];
    for (let i = 0; i <= inputs; i++) {
        const start = performance.now();
        const result = fibonacci(i);
        const end = performance.now();
        results.push({
            algorithm: "fibonacci",
            input: i,
            result,
            time: end - start
        });
    }
    return results;
}

function benchmarkLinearSearch(linearSearch, memory) {
    const sizes = [100, 1000, 5000, 10000, 100000, 1000000];
    const results = [];
    sizes.forEach(size => {
        const array = new Int32Array(memory.buffer, 0, size);
        array.forEach((val, i, arr) => arr[i] = i);
        const searchValue = size - 1;
        const start = performance.now();
        const result = linearSearch(array, array.length, searchValue);
        const end = performance.now();
        const duration = end - start;
        results.push({
            algorithm: "linearSearch",
            input: `LinearSearch(Array[${size}])`,
            result: result,
            time: duration
        });
    });
    return results;
}

function benchmarkBinarySearch(binarySearch, memory) {
    const sizes = [100, 1000, 5000, 10000, 100000, 1000000];
    const results = [];
    sizes.forEach(size => {
        const array = new Int32Array(memory.buffer, 0, size);
        array.forEach((val, i, arr) => arr[i] = i);
        const searchValue = size - 1;
        const start = performance.now();
        const result = binarySearch(array, array.length, searchValue);
        const end = performance.now();
        const duration = end - start;
        results.push({
            algorithm: "binarySearch",
            input: `binarySearch(Array[${size}])`,
            result: result,
            time: duration
        });
    });
    return results;
}

function benchmarkBubbleSort(bubbleSort, memory) {
    const results = [];
    const sizes = [100, 1000, 5000, 10000, 100000];
    sizes.forEach(size => {
        const reversedArray = new Int32Array(memory.buffer, 0, size);
        reversedArray.forEach((val, i, arr) => arr[i] = i);
        reversedArray.reverse();
        const start = performance.now();
        bubbleSort(reversedArray, reversedArray.length);
        const end = performance.now();
        const duration = end - start;
        results.push({
            algorithm: "bubbleSort",
            input: `bubbleSort(Array[${size}])`,
            result: reversedArray,
            time: duration
        });
    });
    return results;
}

function benchmarkQueue(memory) {
    const results = [];
    const sizes = [100, 1000, 5000, 10000, 100000, 1000000];

    sizes.forEach(size => {

        const array = new Int32Array(memory.buffer, 0, size);
        array.forEach((val, i, arr) => arr[i] = i);

        const start = performance.now();
        const queue = new Module.Queue();
        array.forEach(val => queue.push(val));
        while (!queue.isEmpty()) {
            queue.pop();
        }
        const end = performance.now();

        const duration = end - start;
        results.push({
            algorithm: "Queue",
            input: `Queue.push/pop(Array[${size}])`,
            result: queue,
            time: duration
        });
    })
    return results;
}