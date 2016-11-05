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
    return new Promise(function (fullfill, reject) {
        fs.readJson(file, function(err, json) {
            if(err) {
                return reject(err);
            }
            fullfill(json);
        });
    });
}

function readFilePromise(file) {
    return new Promise(function(fullfill, reject) {
        fs.readFile(file, function(err, data) {
            if(err) {
                return reject(err);
            }
            fullfill(data);
        });
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
    executePromisesInOrder: executePromisesInOrder
}
