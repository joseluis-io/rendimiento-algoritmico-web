const { fibonacci, linearSearch, binarySearch, bubbleSort, Queue } = require("./lib/binding.js");
const { Environment, exportToCSV } = require('../shared/util.js');
const { BENCHMARK_INPUTS } = require("../shared/inputs.js");

function benchmark(algorithm) {
    const results = [];
    const inputs = Array.from({ length: BENCHMARK_INPUTS.fib + 1 }, (_, i) => i);
    for (const input of inputs) {
        const start = performance.now();
        const result = algorithm(input);
        const end = performance.now();
        results.push({
            algorithm: "fibonacci",
            input: input,
            result,
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
        const result = linearSearch(array.buffer, searchValue);
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
        const result = binarySearch(array.buffer, searchValue);
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
        bubbleSort(reversedArray.buffer);
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
environment.setFFI("C++");

const alg = environment.getAlgorithmArg();
console.log(alg);

if (alg === "fib" || alg === "all") {
    const results = benchmark(fibonacci);
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