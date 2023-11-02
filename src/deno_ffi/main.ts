const libName = `./libalgorithm.so`;

// Open library and define exported symbols
const dylib = Deno.dlopen(
  libName,
  {
      "add": { parameters: ["isize", "isize"], result: "isize" },
      "sub": { parameters: ["isize", "isize"], result: "isize" },
      "fib": { parameters: ["isize"], result: "isize" },
  } as const,
);

// Call the symbol `add`
const result = dylib.symbols.add(35, 34); // 69
const subResult = dylib.symbols.sub(4, 2); // 2
let fib = parseInt(Deno.args[0], 10);
const fibResult = dylib.symbols.fib(fib);

console.log(`Result from external addition of 35 and 34: ${result}`);
console.log(`Resta externa de 4 y 2: ${subResult}`);
console.log(`fib(${fib})=${fibResult}`);
