#[no_mangle]
pub extern "C" fn add(a: isize, b: isize) -> isize {
    a + b
}

#[no_mangle]
pub extern "C" fn sub(a: isize, b: isize) -> isize {
    a - b
}

#[no_mangle]
pub extern "C" fn fib(n: isize) -> isize {
    match n {
        0 | 1 => n,
        _ => fib(n - 1) + fib(n - 2),
    }
}
