const fib = (n) => {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
};

const doFib = (n) => {
    let result = chronoAlgorithm(fib, n);
    logExecution(fib, n, result);
};

function chronoAlgorithm(algorithm, arg){
    let start = performance.now();
    let value = algorithm(arg);
    let end = performance.now();
    let time = end - start;
    return {time, value};
}

function logExecution(algorithm, arg, result){
    console.log(`{function: ${algorithm.name}, argument: ${arg}, time(ms): ${result.time}, return: ${result.value}}`);
}

const main =  () => {
    doFib(50);
};

main();
