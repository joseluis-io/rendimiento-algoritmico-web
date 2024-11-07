const libQueue = `./libqueue.so`;

const queuelib = Deno.dlopen(
    libQueue,
    {
        "queue_new": { parameters: [], result: "pointer" },
        "queue_push": { parameters: ["pointer", "i32"], result: "i32" },
        "queue_pop": { parameters: ["pointer"], result: "i32" },
        "queue_peek": { parameters: ["pointer"], result: "i32" },
        "queue_is_empty": { parameters: ["pointer"], result: "bool" },
    }
);

export class Queue {
    constructor() {
        this.ptr = queuelib.symbols.queue_new();
    }

    push(item) {
        return queuelib.symbols.queue_push(this.ptr, item);
    }

    pop() {
        return queuelib.symbols.queue_pop(this.ptr);
    }

    peek() {
        return queuelib.symbols.queue_peek(this.ptr);
    }

    isEmpty() {
        return queuelib.symbols.queue_is_empty(this.ptr);
    }

}