"use strict"; // strict mode is enabled

class Main {
    #args;
    constructor(...args) {
        [...this.#args] = args;
    }
    get Args() {
        return this.#args;
    }
    set Args(value) {
        this.#args = value;
    }
    output() {
        return {
            "args": [...this.#args],
        };
    }
}