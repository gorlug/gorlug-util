const assert = require("assert");
const config = require("./config");
const fs = require("fs-extra");
const test_folder = "test/config";
const config_file = test_folder + "/config.json";

describe("Test the config module", function() {
    beforeEach(function(done) {
        fs.mkdir(test_folder, startTestInTestFolder);
        function startTestInTestFolder(err) {
            if(err) {
                console.log(err);
                assert.ifError(err);
            }
            done();
        }
    });
    
    afterEach(function(done) {
        fs.exists(test_folder, function(exists) {
           if(exists) {
               fs.remove(test_folder, function(err) {
                   assert.ifError(err);
                   done();
               });
           } 
        });
    });

    it("should create a new config.json from the template file if it doesn't exist yet", function(done) {
        config.init(config_file, afterConfigInit);
        function afterConfigInit(err, config) {
            assert.ifError(err);
            fs.exists(config_file, checkIfConfigFileExists.bind({config: config }));
        }
        function checkIfConfigFileExists(exists) {
            assert.ok(exists);
            assert.equal(this.config.gitlab.url, "http://localhost");
            assert.equal(this.config.gitlab.token, "abcdefghij123456");
            done();
        }
    });
    
    it("check that an existing config is not overwritten", function(done) {
        const json_config = {
            gitlab: {
                url: "some gitlab url",
                token: "some gitlab token"
            }
        };
        fs.writeJson(config_file, json_config, initConfig);
        function initConfig(err) {
            assert.ifError(err);
            config.init(config_file, afterConfigInit);
        }
        function afterConfigInit(err, config) {
            assert.ifError(err);
            assert.equal(config.gitlab.url, json_config.gitlab.url);
            assert.equal(config.gitlab.token, json_config.gitlab.token);
            done();
        }
    });
    it("test the promise init function", function() {
        return config.initPromise(config_file).then(onSuccess);
        function onSuccess(config) {
            assert.equal(config.gitlab.url, "http://localhost");
        }
    });
});
