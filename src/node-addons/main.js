const { fibonacci, linearSearch, binarySearch, bubbleSort, Queue } = require("./lib/binding.js");
const fs = require('fs');

function benchmark(algorithm, inputs) {
    const results = [];
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
    const sizes = [100, 1000, 5000, 10000, 100000, 1000000, 10000000];
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
        const array = generateInt32Array(size);
        const searchValue = size;
        const start = performance.now();
        const result = binarySearch(array.buffer, searchValue);
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
        const reversedArray = generateInt32Array(size).reverse();
        const start = performance.now();
        bubbleSort(reversedArray.buffer);
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

function exportToCSV(results, algorithmName, environment, debug=false) {
    const dateTime = getCurrentDateTime();
    const filename = `../../dataset/${algorithmName}_${environment}--${dateTime}.csv`;
    const header = 'Algorithm,Input,Time\n';
    const rows = results.map(result => `${algorithmName},${result.input},${result.time}`).join('\n');
    const csvContent = header + rows;

    console.log(results);
    console.log(csvContent);

    if (!debug) {
        fs.writeFileSync(filename, csvContent);
        console.log(`Resultados exportados al fichero: ${filename}`);
    }

}

const inputs = Array.from({ length: 20 }, (_, i) => i);

// const results = benchmark(fibonacci, inputs);

// exportToCSV(results, 'fibonacci', "Node-CPP");

// console.log(benchmark(fibonacci, inputs));
// console.log(benchmarkLinearSearch(linearSearch));
// console.log(benchmarkBinarySearch(binarySearch));
// console.log(benchmarkBubbleSort(bubbleSort));
// console.log(benchmarkQueue());

// const results = benchmark(fibonacci, inputs);
// exportToCSV(results, 'fibonacci', "node-cpp");

// const resultsLinearSearch = benchmarkLinearSearch(linearSearch);
// exportToCSV(resultsLinearSearch, 'linearSearch', "node-cpp");

// const resultsBinarySearch = benchmarkBinarySearch(binarySearch);
// exportToCSV(resultsBinarySearch, 'binarySearch', "node-cpp");

const resultsBubbleSort = benchmarkBubbleSort(bubbleSort);
exportToCSV(resultsBubbleSort, 'bubbleSort', "node-cpp", true);

// const resultsQueue = benchmarkQueue();
// exportToCSV(resultsQueue, "queue", "node-cpp");