const fib = (n) => {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
};

const doFib = (n) => new Promise(() => {
    let result = chronoAlgorithm(fib, n);
    logExecution(fib, n, result);
});

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

const main = async () => {
    doFib(0);
    doFib(1);
    doFib(2);
    doFib(10);
    doFib(20);
    doFib(30);
    doFib(40);
};

main();
