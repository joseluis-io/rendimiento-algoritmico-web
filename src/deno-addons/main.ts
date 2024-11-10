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

const inputs = Array.from({ length: 48 }, (_, i) => i);

const results = benchmark(fib, inputs);

exportToCSV(results, 'fibonacci', "deno-rust");