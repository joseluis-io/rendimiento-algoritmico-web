import { Environment, exportToCSV } from '../shared/util.js';

const environment = new Environment();
environment.setFFI("WASM");

const { fib, linearSearch, binarySearch, bubbleSort, memory } =
    await environment.getWasmInstanceExports('./algorithm.wasm');

const resultsFibonacci = benchmarkFibonacci(fib, 20);
await exportToCSV(resultsFibonacci, "fibonacci", environment);

const resultsLinearSearch = benchmarkLinearSearch(linearSearch, memory);
await exportToCSV(resultsLinearSearch, "linearSearch", environment);

const resultsBinarySearch = benchmarkBinarySearch(binarySearch, memory);
await exportToCSV(resultsBinarySearch, "binarySearch", environment);

const resultsBubbleSort = benchmarkBubbleSort(bubbleSort, memory);
await exportToCSV(resultsBubbleSort, "bubbleSort", environment);

try {
    const emscriptenModule = await import('./queue.js');
    const Module = await emscriptenModule.default();
    const resultsQueue = benchmarkQueue(Module, memory);
    await exportToCSV(resultsQueue, "queue", environment);
} catch (e) {
    console.error(`Queue benchmark in ${environment.env}/${environment.ffi} not supported: ${e.message}`)
}

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

function benchmarkQueue(module, memory) {
    const results = [];
    const sizes = [100, 1000, 5000, 10000, 100000, 1000000];
    sizes.forEach(size => {

        const array = new Int32Array(memory.buffer, 0, size);
        array.forEach((val, i, arr) => arr[i] = i);

        const start = performance.now();
        const queue = new module.Queue();
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