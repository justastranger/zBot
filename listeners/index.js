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

// TODO move this part somewhere else
// since the exports are brought together, do a for (var listener in listeners) bot.addListener(listener.type, listener.listener);???
//
// global.bot.addListener(lewd.type, lewd.listener);
// global.bot.addListener(tell.type, tell.listener);
// global.bot.addListener(seen.type, seen.listener);
// global.bot.addListener(log.type, log.listener);
// global.bot.addListener(command.type, command.listener);
// global.bot.addListener(error.type, error.listener);
// global.bot.addListener(invite.type, invite.listener);

// exports.command = command;
// exports.error = error;
// exports.invite = invite;
// exports.lewd = lewd;
// exports.log = log;
// exports.seen = seen;
// exports.tell = tell;