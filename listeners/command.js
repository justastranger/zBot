// This should all work being in this file since it relies on the global namespace to work with the bot


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
	if(global.commands[command] == undefined){
		global.bot.say(channel, "That command does not exist.");
		return;
	}
	// Turn the bot.whois function into a promise so we can wait for the account name
	function whois(who){
		return new Promise(function(resolve, reject){
			global.bot.whois(who, resolve)
		})
	}
	whois(from).then(function(data){
		var nameTmp = data.account;
		//console.log(nameTmp + ":" + from);
		if (checkPermissions(nameTmp, command)){
			global.commands[command](from, channel, args);
		} else {
			global.bot.say(channel, from+": You do not have permission to do that.");
		}
	});
}

function listener(from, channel, message){
	// Only do something if it's a .command
	if(message.indexOf(prefix) == 0){
		var args = message.substr(message.indexOf(" ")+1 ? message.indexOf(" ")+1 : message.length);
		var command = message.substr(prefix.length, message.indexOf(" ")-prefix.length >= prefix.length ? message.indexOf(" ")-prefix.length : message.length - prefix.length);
		processCommand(command, from, channel, args)
	}
}

exports.listener = listener;