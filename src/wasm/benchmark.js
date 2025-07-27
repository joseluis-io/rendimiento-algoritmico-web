import { BENCHMARK_INPUTS } from '../shared/inputs.js';
import { Environment, exportToCSV } from '../shared/util.js';

const environment = new Environment();
environment.setFFI("WASM");

const { fib, linearSearch, binarySearch, bubbleSort, memory } =
    await environment.getWasmInstanceExports('./algorithm.wasm');

const alg = environment.getAlgorithmArg();
console.log(alg);

if (alg === "fib" || alg === "all") {
    const resultsFibonacci = benchmarkFibonacci(fib);
    await exportToCSV(resultsFibonacci, "fibonacci", environment);
}

if (alg === "lineal" || alg === "all") {
    const resultsLinearSearch = benchmarkLinearSearch(linearSearch, memory);
    await exportToCSV(resultsLinearSearch, "linearSearch", environment);
}

if (alg === "binary" || alg === "all") {
    const resultsBinarySearch = benchmarkBinarySearch(binarySearch, memory);
    await exportToCSV(resultsBinarySearch, "binarySearch", environment);
}

if (alg === "bubble" || alg === "all") {
    const resultsBubbleSort = benchmarkBubbleSort(bubbleSort, memory);
    await exportToCSV(resultsBubbleSort, "bubbleSort", environment);
}

if (alg === "queue" || alg === "all") {
    try {
        const emscriptenModule = await import('./queue.js');
        const Module = await emscriptenModule.default();
        const resultsQueue = benchmarkQueue(Module, memory);
        await exportToCSV(resultsQueue, "queue", environment);
    } catch (e) {
        console.error(`Queue benchmark in ${environment.env}/${environment.ffi} not supported: ${e.message}`)
    }
}

function benchmarkFibonacci(fibonacci) {
    const results = [];
    const inputs = BENCHMARK_INPUTS.fib;
    for (let i = 0; i <= inputs; i++) {
        const start = performance.now();
        const result = fibonacci(BigInt(i));
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
    const sizes = BENCHMARK_INPUTS.linear;
    const results = [];
    sizes.forEach(size => {
        const array = new Int32Array(memory.buffer, 0, size);
        array.forEach((val, i, arr) => arr[i] = i);
        const searchValue = size - 1;
        const start = performance.now();
        const result = linearSearch(0, array.length, searchValue);
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

function benchmarkBinarySearch(binarySearch, memory) {
    const sizes = BENCHMARK_INPUTS.binary;
    const results = [];
    sizes.forEach(size => {
        const array = new Int32Array(memory.buffer, 0, size);
        array.forEach((val, i, arr) => arr[i] = i);
        const searchValue = size - 1;
        const start = performance.now();
        const result = binarySearch(0, array.length, searchValue);
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

function benchmarkBubbleSort(bubbleSort, memory) {
    const results = [];
    const sizes = BENCHMARK_INPUTS.bubble;
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
            input: size,
            result: reversedArray,
            time: duration
        });
    });
    return results;
}

function benchmarkQueue(module, memory) {
    const results = [];
    const sizes = BENCHMARK_INPUTS.queue;
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
            input: size,
            result: queue,
            time: duration
        });
    })
    return results;
}