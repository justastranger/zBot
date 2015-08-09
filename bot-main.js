var irc = require("irc");
var fs = require("fs");
var wait = require("wait.for");

var permFile = "permissions.json";
var permissions = {};
// TODO base permissions on username, not nick
if(fs.existsSync(permFile)){ // Check for the file, if it exists, parse it. We don't expect any other process to ever access/change the file.
	permissions = (JSON.parse(fs.readFileSync(permFile).toString()));
	console.log(permissions); // Log known permissions on load
}

var prefix = ","; // This is the command prefix: ",kick" and ",ban"
var nick = "z"; // The default nick to use
				// TODO add a command to change nicks and remember the new nick(?)
var server = "irc.esper.net"; // Server to connect to
var options = {
	userName: "zBot", // username for the bot
	password: global.password, // Password to auth with, ssshhhhh
	realName: "justastranger's bot", // Name to show in the whois
	messageSplit: 512, // need moar chars
	channels: ["#dirtylaundry"] // Default to my personal channel
};
global.tells = {};

var bot = new irc.Client(server, nick, options);
// The IRC package I'm using doesn't come with fucntions for kicking, banning, or unbanning

bot.addListener("message#", function(from, channel, message){
	console.log(channel + "=>" + from + ": " + message);
	if(global.tells[from.toLowerCase()] != undefined){
		for(var a in global.tells[from]){
			bot.say(channel, global.tells[from][a].sender+"=>"+from+": "+global.tells[from][a].message);
		}
		delete global.tells[from];
	}
	if(message.indexOf(prefix) == 0){
		var args = message.substr(message.indexOf(" ")+1 ? message.indexOf(" ")+1 : message.length);
		var command = message.substr(prefix.length, message.indexOf(" ")-prefix.length >= prefix.length ? message.indexOf(" ")-prefix.length : message.length - prefix.length);
		wait.launchFiber(processCommand, command, from, channel, args);
	}
});

bot.addListener("invite", function(channel, from, message){
	bot.join(channel);
});
global.bot = bot; // Globally define the bot so that it can be affected from the commands that are in different files


global.permProcess = function(args, from, channel){
	var argArray = args.split(" ");
	from = typeof from == "string" ? from.toLowerCase() : from;
	var command = typeof argArray[0] == "string" ? argArray[0].toLowerCase() : null;
	var target = typeof argArray[1] == "string" ? argArray[1].toLowerCase() : null;
	switch (command){
		case "set":
			// Try to identify the permission level you're trying to set, first by casting to a number, then checking to see if, as a string, the entry exists inside the permLevels object
			var arg = typeof Number(argArray[2]) == "number" ? Number(argArray[2]) : global.permLevels[argArray[2].toLowerCase()];
			if(isNaN(arg)) { // Cry about it if we can't figure it out
				global.bot.say(channel, "Unknown permissions level.");
				break;
			}
			// Only allow people to set someone's permission level to below their own, but don't let them modify it if it's already above or equal to theirs
			if(permissions[from] <= arg || permissions[from] <= permissions[target] != undefined ? permissions[target] : 0) global.bot.say(channel, "You do not have the necessary permissions to do that.");
			else {
				permissions[target] = arg;
				global.bot.action(channel, "will remember this.");
			}
			break;
		case "remove":
			if(permissions[from] <= permissions[target]) global.bot.say(channel, "You do not have the necessary permissions to do that.");
			else {
				delete permissions[target];
				global.bot.action(channel, "deletes "+target);
			}
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
	var arg = global.permLevels[level.toLowerCase()];
	if (isNaN(arg)) { // Cry about it if we can't figure it out
		console.log("Unknown permissions level.");
		return;
	}
	for(var i = 0; i < names.length; i++){
		global.commandPerms[arg].push(names[i]); // Set the permission levels for the command aliases
		global.commands[names[i]] = command; // Associate the aliases with the actual command
	}
};

var com = require("./commands");

// Checks the permission levels for the existence of an alias, if it finds one at or below the permission level of the nick sending the command, it returns true
// Otherwise, it returns false, if either the command doesn't exist or the command sender doesn't have permission
function checkPermissions(who, command){
	// If who is undefined, meaning they aren't registered or authenticated with NickServ, we give them the lowest permission level.
	var p = who != undefined && permissions[who.toLowerCase()] != undefined ? permissions[who.toLowerCase()] : 0;
	for (var i = 0; i <= p; i++){
		if (global.commandPerms[i].indexOf(command) > -1) return true;
	}
	return false;
}


// All processed commands should have a function that takes arguments as (from, channel, args)
function processCommand(command, from, channel, args){
	var name;
	// Query the server for who a person is so we don't have to rely on nicks that can change
	global.bot.whois(from, function(data){
		name = data.account;
	});
	// This is essentially sleep(250);
	// It's because the whois is asynchronous, so we have to wait for it to execute the callback.
	// 250ms is generally a long enough wait.
	setTimeout(function(){
		//console.log(name + "->" + from) // debug line so we can see who the nick resolves to.
		if (checkPermissions(name, command)){
			global.commands[command](from, channel, args);
		} else {
			global.bot.say(channel, from + ": You do not have permission to do that.");
		}
	}, 250);
}