// Globally define the permission carrier object
global.commandPerms = {
	0:[],
	1:[],
	2:[],
	3:[]
};
// Globally define permission levels for reasons
global.permLevels = {
	anyone: 0,
	voiced: 1,
	op: 2,
	owner: 3
};
// The object that stored the alias:function objects
global.commands = {};

exports.cli = require("./cli.js");
exports.administration = require("./administration.js");
exports.interaction = require("./interaction.js");
exports.movement = require("./movement.js");
exports.google = require("./google.js");
exports.games = require("./games.js");


// Should be an empty script unless something's actually being tested
exports.test = require("./test.js");

// TODO eventually start registering commands like listeners are registered