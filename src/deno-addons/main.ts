const libName = `./libalgorithm.so`;

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
import { Queue } from './queue.js';

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
      const array = generateInt32Array(sizes);
      const searchValue = size;
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

function benchmarkBinarySearch(binarySearch) {
  const results = [];
  const sizes = [100, 1000, 5000, 10000, 100000, 1000000, 10000000];
  sizes.forEach(size => {
      const array = generateInt32Array(sizes);
      const searchValue = size;
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

function benchmarkBubbleSort(bubbleSort) {
  const results = [];
  const sizes = [100, 1000, 5000, 10000, 100000];
  sizes.forEach(size => {
      const array = generateInt32Array(size);
      const start = performance.now();
      bubbleSort(array, array.length);
      const end = performance.now();
      const duration = end - start;
      results.push({
          algorithm: "bubbleSort",
          input: `bubbleSort(Array[${size}])`,
          result: array,
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

async function exportToCSV(results, algorithmName, environment) {
  const dateTime = getCurrentDateTime();
  const filename = `../../dataset/${algorithmName}_${environment}--${dateTime}.csv`;
  const header = 'Algorithm,Input,Time\n';
  const rows = results.map(result => `${algorithmName},${result.input},${result.time}`).join('\n');
  const csvContent = header + rows;

  try {
    await Deno.writeTextFile(filename, csvContent);
    console.log(`Benchmark completado y resultados exportados a ${filename}`);
  } catch (err) {
    console.error(`Error al escribir el archivo ${filename}:`, err);
  }
}

const inputs = Array.from({ length: 20 }, (_, i) => i);

// const results = benchmark(fib, inputs);

console.log(benchmark(fib, inputs));
console.log(benchmarkLinearSearch(linearSearch));
console.log(benchmarkBinarySearch(binarySearch));
console.log(benchmarkBubbleSort(bubbleSort));
console.log(benchmarkQueue());

// exportToCSV(results, 'fibonacci', "deno-rust");