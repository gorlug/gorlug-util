const logger = require("./logging");
const fs = require("fs-extra");
const default_config = "config/config.json.template";

function init(config_file, callback) {
    fs.exists(config_file, checkIfConfigFileExists);
    function checkIfConfigFileExists(exists) {
        if(exists) {
            loadTheConfigFile();
        }
        else {
            copyConfigTemplate(loadTheConfigFile);
        }
    }
    function copyConfigTemplate(callback) {
        fs.copy(default_config, config_file, loadTheConfigFile);
    }
    function loadTheConfigFile(err) {
        if(err) {
            callback(err);
        }
        fs.readJson(config_file, callInitialCallback);
    }
    function callInitialCallback(err, config) {
        if(err) {
            logger.error(err);
            return callback(new Error("Error while opening the config file"), undefined);
        }
        logger.info("successfully loaded the config file");
        callback(undefined, config);
    }
}

function initPromise(config_file) {
    return new Promise(function(fullfill, reject) {
        init(config_file, function(err, config) {
            if(err) {
                return reject(err);
            }
            fullfill(config);
        });
    });
}

module.exports = {
    init: init,
    initPromise: initPromise
};
