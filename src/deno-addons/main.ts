const libName = `./libalgorithm.so`;

// Open library and define exported symbols
const dylib = Deno.dlopen(
  libName,
  {
      "add": { parameters: ["isize", "isize"], result: "isize" },
      "sub": { parameters: ["isize", "isize"], result: "isize" },
      "fib": { parameters: ["u64"], result: "u64" },
      "linearSearch": {parameters: ["buffer", "usize", "isize"], result: "i32"},
  } as const,
);

// FIB: Coge valor fib de argumentos CLI
let fib = parseInt(Deno.args[0], 10);
const fibResult = dylib.symbols.fib(fib);
console.log(`fib(${fib})=${fibResult}`);

// Linear Search
const array = Int32Array.from([1,2,3,8,5]);
console.log(dylib.symbols.linearSearch(array, array.length, 8));
