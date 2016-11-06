const assert = require("assert");
const util = require("./util");

describe("Test util functions", function() {
    function timesTwo(number) {
        return new Promise(function(fullfill, reject) {
            fullfill(number * 2);
        });
    }
    it("test the mapping of promises functions to items and their execution in order", function() {
        return util.executePromisesInOrder([1, 2, 3], timesTwo).then(function(results) {
            assert.equal(3, results.length);
            assert.equal(2, results[0]);
            assert.equal(4, results[1]);
            assert.equal(6, results[2]);
        });
    });
    it("test executePromisesInOrder with an empty array", function() {
        return util.executePromisesInOrder([], timesTwo).then(function(results) {
            assert.equal(results.length, 0);
        });
    });
    it("test read file promise", function() {
        return util.readFilePromise("test/readFilePromise.txt").then(function(text) {
            assert.equal("" + text, "Some text here\n");
        });
    });
});
