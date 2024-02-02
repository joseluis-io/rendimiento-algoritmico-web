#[no_mangle]
pub extern "C" fn fib(n: u64) -> u64 {
    match n {
        0 | 1 => n,
        _ => fib(n - 1) + fib(n - 2),
    }
}

#[no_mangle]
pub extern "C" fn linearSearch(array: *const i32, length: usize, search: i32) -> i32 {
    let slice = unsafe { std::slice::from_raw_parts(array, length) };
    for i in 0..length {
        if slice[i] == search {
            return i as i32;
        }
    }
    -1
}

#[no_mangle]
pub extern "C" fn binarySearch(array: *const i32, length: usize, search: i32) -> i32 {
    let sorted_array = unsafe { std::slice::from_raw_parts(array, length) };
    let mut l = 0;
    let mut r = length - 1;
    while l <= r {
        let m = (l + r) / 2;
        if sorted_array[m] < search {
            l = m + 1;
        } else if sorted_array[m] > search {
            r = m - 1;
        } else {
            return m as i32;
        }
    }
    -1
}

#[no_mangle]
pub extern "C" fn bubbleSort(array: *mut i32, length: usize) {
    let slice = unsafe { std::slice::from_raw_parts_mut(array, length) };
    let mut swapped;
    for i in 0..length - 1 {
        swapped = false;
        for j in 0..length - i - 1 {
            if slice[j] > slice[j + 1] {
                slice.swap(j, j + 1);
                swapped = true;
            }
        }
        if !swapped {
            break;
        }
    }
}
