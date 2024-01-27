#[no_mangle]
pub extern "C" fn add(a: isize, b: isize) -> isize {
    a + b
}

#[no_mangle]
pub extern "C" fn sub(a: isize, b: isize) -> isize {
    a - b
}

#[no_mangle]
pub extern "C" fn fib(n: u64) -> u64 {
    match n {
        0 | 1 => n,
        _ => fib(n - 1) + fib(n - 2),
    }
}

#[no_mangle]
pub extern "C" fn linearSearch(array: *const i32, length: usize, search: i32) -> i32{
    let slice = unsafe { std::slice::from_raw_parts(array, length) };
    for i in 0..length{
	if slice[i] == search{
	    return i as i32
	}
    }
    -1
}
