let irc = require("irc");
let fs = require("fs");
let privateStuff = require("./private.js");
let Promise = require("bluebird");

let permFile = "permissions.json";
let permissions = {};
// TODO base permissions on username, not nick
if(fs.existsSync(permFile)){ // Check for the file, if it exists, parse it. We don't expect any other process to ever access/change the file.
	permissions = (JSON.parse(fs.readFileSync(permFile).toString()));
	console.log("I remember permissions!");
	console.log(permissions); // Log known permissions on load
}
global.permissions = permissions;

let idleFile = "idleRPG.json";
let idleRPG = {};
if(fs.existsSync(idleFile)){ // Check for the file, if it exists, parse it. We don't expect any other process to ever access/change the file.
	idleRPG = (JSON.parse(fs.readFileSync(idleFile).toString()));
	console.log("I remember the idlers!");
	console.log(idleRPG); // Log known idlers on load
}
global.idleRPG = idleRPG;

let nick = "[princealbert]"; // The default nick to use
let server = "irc.esper.net"; // Server to connect to
let options = {
	userName: "justabot", // username for the bot
	password: privateStuff.password, // Password to auth with, ssshhhhh
	realName: "justastranger's bot", // Name to show in the whois
	messageSplit: 512, // need moar chars
	channels: ["#`"], // Default to my personal channel
	floodProtection: true,
	stripColors: true
};

let bot = new irc.Client(server, nick, options);
bot.prefix = "."; // This is the command prefix: ".kick" and ".ban", it's a variable so it can be changed in case of conflict.
// The IRC package I'm using doesn't come with functions for kicking, banning, or unbanning
global.bot = bot; // Globally define the bot so that it can be affected from the commands that are in different files


// TODO temporarily assign permissions to people based on if they're voiced/op in a channel, on a channel-by-channel basis
global.checkPermLevel = function(who, level){
  if(global.permLevels[who] >= level) return true;
  else return false;
};

global.permProcess = function(args, from, channel){
	let argArray = args.split(" ");
	from = typeof from === "string" ? from.toLowerCase() : from;
	let command = typeof argArray[0] === "string" ? argArray[0].toLowerCase() : null;
	let target = typeof argArray[1] === "string" ? argArray[1].toLowerCase() : null;
	switch (command){
		case "add":
		case "set":
			// Try to identify the permission level you're trying to set, first by casting to a number, then checking to see if, as a string, the entry exists inside the permLevels object
			let arg = !isNaN(Number(argArray[2])) ? Number(argArray[2]) : global.permLevels[(argArray[2]).toLowerCase()];
			if(isNaN(arg)) { // Cry about it if we can't figure it out
				global.bot.say(channel, "Unknown permissions level.");
				break;
			}
			// Only allow people to set someone's permission level to below their own, but don't let them modify it if it's already above or equal to theirs
			if(permissions[from] <= arg || permissions[from] <= (permissions[target] !== undefined ? permissions[target] : 0)) global.bot.say(channel, "You do not have the necessary permissions to do that.");
			else {
				permissions[target] = arg;
				global.bot.action(channel, "will remember this.");
			}
			console.log(permissions);
			break;
		case "remove":
		case "delete":
		case "unset":
			if(permissions[from] <= permissions[target]) global.bot.say(channel, "You do not have the necessary permissions to do that.");
			else {
				delete permissions[target];
				global.bot.action(channel, "deletes "+target);
			}
			console.log(permissions);
			break;
		case "list":
			// Lists who has what permissions
			global.bot.say(channel, JSON.stringify(permissions));
			break;
		case "commands":
			// Lists the names of the commands registered (including their aliases)
			global.bot.say(channel, Object.keys(global.commands));
			break;
	}
	fs.writeFileSync(permFile, JSON.stringify(permissions)); // Save permissions
};

// global.declareCommand(command, ["aliases", "for", "the", "command"], "owner/op/voiced/anyone")
// level can be a number (0-3) or the name of the permission level
// command is a reference to the function to be called when processing the command
// Names should be an array of strings that you want to use as the commands to be typed by the user
global.declareCommand = function(command, names, level){
	if (!names instanceof Array) names = [names]; // turn it into an array because I don't want to bother
	let arg = global.permLevels[level.toLowerCase()];
	if (isNaN(arg)) { // Cry about it if we can't figure it out
		console.log("Unknown permissions level.");
		return;
	}
	for(let i = 0; i < names.length; i++){
		global.commandPerms[arg].push(names[i]); // Set the permission levels for the command aliases
		global.commands[names[i]] = command; // Associate the aliases with the actual command
	}
};

let listeners = require("./listeners");

for (let listener in listeners) {
	if(listeners.hasOwnProperty(listener)) bot.addListener(listeners[listener].type, listeners[listener].listener);
}

let com = require("./commands");
