const logger = require("./logging");
const fs = require("fs-extra");

function createError(message, cause) {
    var error = new Error(message);
    var stack_split = error.stack.split("\n");
    stack_split.splice(1, 1);
    var stack = stack_split.join("\n");
    if(cause) {
        stack += "\nCaused by: " + cause.stack;
    }
    error.stack = stack;
    return error;
}

function readJsonPromise(file) {
    return promise(fs.readJson, file);
}

function readFilePromise(file) {
    return promise(fs.readFile, file);
}

function promise(func) {
    var args = Array.from(arguments);
    args.splice(0, 1);
    return new Promise(function(fullfill, reject) {
        function callback() {
            var args = Array.from(arguments);
            var err = args.splice(0, 1)[0];
            if(err) {
                return reject(err);
            }
            fullfill.apply(fullfill, args);
        }
        args.push(callback);
        func.apply(func, args);
    });
}

function innerPromiseOrderExecution(items, promiseFunction, results) {
    var item = items.shift();
    if(items.length > 0) {
        return promiseFunction(item).then(function(result) {
            results.push(result);
            return innerPromiseOrderExecution(items, promiseFunction, results);
        });
    }
    return promiseFunction(item).then(function(result) {
        results.push(result);
        return Promise.resolve(results);
    });
}

function executePromisesInOrder(items, promiseFunction) {
    if(items.length == 0) {
        return Promise.resolve([]);
    }
    return innerPromiseOrderExecution(items, promiseFunction, []);
}

module.exports = {
    createError: createError,
    readJsonPromise: readJsonPromise,
    readFilePromise: readFilePromise,
    executePromisesInOrder: executePromisesInOrder,
    promise: promise
}
