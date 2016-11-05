const file_logger = require("tracer").dailyfile({ stackIndex: 2, root: "logs", maxLogFiles: 10, allLogsFileName: "app" });
const console_logger = require("tracer").colorConsole( { stackIndex: 2, dateformat : "yyyy-mm-dd HH:MM:ss.l" } );

function log(level, log_arguments) {
    file_logger[level].apply(this, log_arguments);
    if(process.env.NODE_ENV != "test") {
        console_logger[level].apply(this, log_arguments);
    }
}

function logFunction(level) {
    return function(message) {
        log(level, arguments);
    }
}

module.exports = {
    trace: logFunction("trace"),
    debug: logFunction("debug"),
    info: logFunction("info"),
    warn: logFunction("warn"),
    error: logFunction("error")
}
