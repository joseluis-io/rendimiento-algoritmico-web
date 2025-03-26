import { binarySearch, bubbleSort, fibonacci, linearSearch, Queue } from './algorithm.js';

const isDeno = typeof Deno !== "undefined";
const isNode = !isDeno && typeof process !== 'undefined' && process.versions?.node != null;
const isBrowser = typeof window !== "undefined";

function getEnvironmentInfo() {
    if (isDeno) {
        return {
            runtime: "Deno",
            version: Deno.version.deno,
            os: Deno.build.os
        };
    }
    if (isNode) {
        return {
            runtime: "Node.js",
            version: process.version,
            platform: process.platform
        };
    }
    if (isBrowser) {
        return {
            runtime: "Browser",
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
        };
    }
    return { runtime: "Unknown" };
}

const environmentInfo = getEnvironmentInfo();

console.log(getEnvironmentInfo());


// import dinámico 'fs' nodejs
let writeFileSync;
async function setupFileSystem() {
    if (isNode) {
        const fs = await import('fs');
        writeFileSync = fs.writeFileSync;
    }
}

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

// formato: YYYYMMDDTHHMM
function getCurrentDateTime() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}${month}${day}T${hours}${minutes}`;
}

// TODO: autodetect browser user-agent & javascript runtime
async function exportToCSV(results, algorithmName, environment, debug = false) {
    const dateTime = getCurrentDateTime();
    const filename = `../../dataset/${algorithmName}_${environment.runtime}--${dateTime}.csv`;
    const header = 'Algorithm,Input,Time\n';
    const rows = results.map(result => `${result.algorithm},${result.input},${result.time}`).join('\n');
    const csvContent = header + rows;

    if (debug) {
        console.log(results)
        console.log(csvContent)
        return;
    }

    if (isNode) {
        await setupFileSystem();
        writeFileSync(filename, csvContent);
        console.log(`Resultados exportados al fichero: ${filename}`);
    } else if (isDeno) {
        Deno.writeTextFileSync(filename, csvContent);
        console.log(`Resultados exportados al fichero: ${filename}`);
    }
    else {
        console.log(csvContent);
    }
}

const inputs = Array.from({ length: 20 }, (_, i) => i);

const resultsFibonacci = benchmark(fibonacci, inputs);
exportToCSV(resultsFibonacci, 'fibonacci', environmentInfo);

const resultsLinearSearch = benchmarkLinearSearch(linearSearch);
exportToCSV(resultsLinearSearch, 'linearSearch', environmentInfo);

const resultsBinarySearch = benchmarkBinarySearch(binarySearch);
exportToCSV(resultsBinarySearch, 'binarySearch', environmentInfo);

const resultsBubbleSort = benchmarkBubbleSort(bubbleSort);
exportToCSV(resultsBubbleSort, 'bubbleSort', environmentInfo, true);

const resultsQueue = benchmarkQueue();
exportToCSV(resultsQueue, "queue", environmentInfo);
