use std::collections::VecDeque;
use std::ffi::c_void;
use std::os::raw::c_int;
use std::ptr;

#[repr(C)]
pub struct Queue {
    queue: VecDeque<i32>,
}

#[no_mangle]
pub extern "C" fn queue_new() -> *mut Queue {
    let fifo = Box::new(Queue {
        queue: VecDeque::new(),
    });
    Box::into_raw(fifo)
}

#[no_mangle]
pub extern "C" fn queue_push(fifo: *mut Queue, value: c_int) -> c_int {
    unsafe {
        if let Some(fifo) = fifo.as_mut() {
            fifo.queue.push_back(value);
            return fifo.queue.len() as c_int - 1;
        }
    }
    -1
}

#[no_mangle]
pub extern "C" fn queue_pop(fifo: *mut Queue) -> c_int {
    unsafe {
        if let Some(fifo) = fifo.as_mut() {
            return fifo.queue.pop_front().unwrap_or(-1)
        } else {
            -1
        }
    }
}

#[no_mangle]
pub extern "C" fn queue_peek(fifo: *const Queue) -> c_int {
    unsafe {
        if let Some(fifo) = fifo.as_ref() {
            *fifo.queue.front().unwrap_or(&-1)
        } else {
            -1
        }
    }
}

#[no_mangle]
pub extern "C" fn queue_is_empty(fifo: *const Queue) -> bool {
    unsafe {
        if let Some(fifo) = fifo.as_ref() {
            fifo.queue.is_empty()
        } else {
            true
        }
    }
}