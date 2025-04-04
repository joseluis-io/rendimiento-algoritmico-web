import { binarySearch, bubbleSort, fibonacci, linearSearch, Queue } from './algorithm.js';
import { Environment, exportToCSV } from '../shared/util.js';

const environment = new Environment();

function benchmark(algorithm, inputs) {
    const results = [];
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

function benchmarkLinearSearch(linearSearch) {
    const sizes = [100, 1000, 5000, 10000, 100000, 1000000, 10000000];
    const results = [];
    sizes.forEach(size => {
        const array = Array.from({ length: size }, (_, i) => i + 1);
        const searchValue = size;
        const start = performance.now();
        const result = linearSearch(array, searchValue);
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

function benchmarkBinarySearch(binarySearch) {
    const results = [];
    const sizes = [100, 1000, 5000, 10000, 100000, 1000000, 10000000];
    sizes.forEach(size => {
        const array = Array.from({ length: size }, (_, i) => i + 1)
        const searchValue = size;
        const start = performance.now();
        const result = binarySearch(array, searchValue);
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

function benchmarkBubbleSort(bubbleSort) {
    const results = [];
    const sizes = [100, 1000, 5000, 10000, 100000];
    sizes.forEach(size => {
        const reversedArray = Array.from({ length: size }, (_, i) => i).reverse();
        const start = performance.now();
        bubbleSort(reversedArray);
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

function benchmarkQueue() {
    const queue = new Queue();
    const sizes = [100, 1000, 5000, 10000, 100000, 1000000, 10000000];
    const results = [];
    sizes.forEach(size => {
        const start = performance.now();
        for (let i = 0; i < size; i++) {
            queue.push(i);
        }
        const end = performance.now();
        const duration = end - start;
        results.push({
            algorithm: "Queue.push",
            input: `size[${size}]`,
            time: duration
        });
    });
    return results;
}

const inputs = Array.from({ length: 20 }, (_, i) => i);

const resultsFibonacci = benchmark(fibonacci, inputs);
await exportToCSV(resultsFibonacci, 'fibonacci', environment);

const resultsLinearSearch = benchmarkLinearSearch(linearSearch);
await exportToCSV(resultsLinearSearch, 'linearSearch', environment);

const resultsBinarySearch = benchmarkBinarySearch(binarySearch);
await exportToCSV(resultsBinarySearch, 'binarySearch', environment);

const resultsBubbleSort = benchmarkBubbleSort(bubbleSort);
await exportToCSV(resultsBubbleSort, 'bubbleSort', environment);

const resultsQueue = benchmarkQueue();
await exportToCSV(resultsQueue, "queue", environment);
