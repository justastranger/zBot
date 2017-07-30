// each sub-require should export a listener and a type
// listener would be a function that can be passed directly to bot.addListener
// type would be a string that can also be passed directly to bot.addListener

exports.command = require("./command.js");
exports.error = require("./error.js");
exports.invite = require("./invite.js");
exports.lewd = require("./lewd.js");
exports.log = require("./log.js");
exports.seen = require("./seen.js");
exports.tell = require("./tell.js");