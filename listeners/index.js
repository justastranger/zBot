var command = require("./command.js");
var error = require("./error.js");
var lewd = require("./lewd.js");
var log = require("./log.js");
var seen = require("./seen.js");
var tell = require("./tell.js");

global.bot.addListener("message#", lewd.listener);
global.bot.addListener("message#", tell.listener);
global.bot.addListener("message#", seen.listener);
global.bot.addListener("message#", log.listener);
global.bot.addListener("message#", command.listener);
global.bot.addListener("error", error.listener);
global.bot.addListener("invite", function(channel, from, message){
	bot.join(channel);
	bot.say(channel, "Hello!")
});

exports.command = command;
exports.error = error;
exports.lewd = lewd;
exports.log = log;
exports.seen = seen;
exports.tell = tell;