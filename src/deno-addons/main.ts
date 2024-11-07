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

import {Queue} from './queue.js';

let cola = new Queue();
cola.push(3);
console.log(cola.peek() === 3);
console.log(cola.isEmpty());