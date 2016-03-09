function kick(from, channel, args){
	global.bot.kick(channel, args);
}

function ban(from, channel, args){
	global.bot.ban(channel, names[i]);
}

function unban(from, channel, args){
	global.bot.unban(channel, names[i]);
}

function kickban(from, channel, args){
	kick(from, channel, args);
	ban(from, channel, args);
}

function quiet(from, channel, args){
	global.bot.quiet(channel, args);
}

function unquiet(from, channel, args){
	global.bot.unquiet(channel, args);
}

function op(from, channel, args){
	global.bot.op(channel, args);
}

function deop(from, channel, args){
	global.bot.deop(channel, args);
}

function voice(from, channel, args){
	global.bot.voice(channel, args);
}

function devoice(from, channel, args){
	global.bot.devoice(channel, args);
}

function perm(from, channel, args){
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