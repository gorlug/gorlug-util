const assert = require("assert");
const util = require("./util");
const fs = require("fs");

describe("Util functions", function() {
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
    it("test write file promise", function() {
        var text = "random text here";
        var file = "test/writeFilePromise.txt";
        return util.promise(fs.writeFile, file, text).then(function() {
            return util.promise(fs.readFile, file, "utf8");
        }).then(function(text) {
            assert.equal(text, text);
        });
    });
    it("test write file promise fail", function() {
        var text = "should not be written";
        var file = "does_not_exist/writeFilePromise.txt";
        return util.promise(fs.writeFile, file, text).catch(function(error) {
            var expected = "ENOENT: no such file or directory, open 'does_not_exist/writeFilePromise.txt'";
            assert.equal(error.message, expected);
        });
    });
});
