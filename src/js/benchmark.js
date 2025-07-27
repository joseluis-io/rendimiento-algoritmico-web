import { binarySearch, bubbleSort, fibonacci, linearSearch, Queue } from './algorithm.js';
import { Environment, exportToCSV } from '../shared/util.js';
import { BENCHMARK_INPUTS } from '../shared/inputs.js';

const environment = new Environment();

function benchmark(algorithm) {
    const results = [];
    const inputs = Array.from({ length: BENCHMARK_INPUTS.fib + 1 }, (_, i) => i);
    for (const input of inputs) {
        const start = performance.now();
        algorithm(input);
        const end = performance.now();
        results.push({
            algorithm: algorithm.name,
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
        const result = linearSearch(array, searchValue);
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
        const result = binarySearch(array, searchValue);
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
        bubbleSort(reversedArray);
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

const alg = environment.getAlgorithmArg();
console.log(alg);

if (alg === "fib" || alg === "all") {
    const resultsFibonacci = benchmark(fibonacci);
    await exportToCSV(resultsFibonacci, 'fibonacci', environment);
}

if (alg === "lineal" || alg === "all") {
    const resultsLinearSearch = benchmarkLinearSearch(linearSearch);
    await exportToCSV(resultsLinearSearch, 'linearSearch', environment);
}

if (alg === "binary" || alg === "all") {
    const resultsBinarySearch = benchmarkBinarySearch(binarySearch);
    await exportToCSV(resultsBinarySearch, 'binarySearch', environment);
}

if (alg === "bubble" || alg === "all") {
    const resultsBubbleSort = benchmarkBubbleSort(bubbleSort);
    await exportToCSV(resultsBubbleSort, 'bubbleSort', environment);
}

if (alg === "queue" || alg === "all") {
    const resultsQueue = benchmarkQueue();
    await exportToCSV(resultsQueue, "queue", environment);
}
