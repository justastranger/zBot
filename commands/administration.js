function kick(from, username, channel, args){
	global.bot.kick(channel, args);
}

function ban(from, username, channel, args){
	global.bot.ban(channel, args);
}

function unban(from, username, channel, args){
	global.bot.unban(channel, args);
}

function kickban(from, username, channel, args){
	kick(from, channel, args);
	ban(from, channel, args);
}

function quiet(from, username, channel, args){
	global.bot.quiet(channel, args);
}

function unquiet(from, username, channel, args){
	global.bot.unquiet(channel, args);
}

function op(from, username, channel, args){
	global.bot.op(channel, args);
}

function deop(from, username, channel, args){
	global.bot.deop(channel, args);
}

function voice(from, username, channel, args){
	global.bot.voice(channel, args);
}

function devoice(from, username, channel, args){
	global.bot.devoice(channel, args);
}

function perm(from, username, channel, args){
	global.permProcess(args, from, channel);
}

global.declareCommand(kick, ["kick"], "op");
global.declareCommand(ban, ["ban"], "op");
global.declareCommand(unban, ["unban"], "op");
global.declareCommand(kickban, ["kickban", "kb"], "op");
// Permissions require better checking when assigning/removing, so it gets done within the actual command.
global.declareCommand(perm, ["perm"], "anyone");
global.declareCommand(quiet, ["quiet", "silence"], "op");
global.declareCommand(unquiet, ["unquiet", "unsilence"], "op");
global.declareCommand(op, ["op"], "op");
global.declareCommand(deop, ["deop"], "op");
global.declareCommand(voice, ["voice"], "op");
global.declareCommand(devoice, ["devoice"], "op");
global.declareCommand(devoice, ["devoice"], "op");