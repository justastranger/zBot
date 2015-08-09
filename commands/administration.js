function kick(from, channel, args){
	var names = args.split(" ");
	for(var i = 0; i < names.length; i++) global.bot.kick(channel, names[i]);
}
function ban(from, channel, args){
	var names = args.split(" ");
	for(var i = 0; i < names.length; i++) global.bot.ban(channel, names[i]);
}
function unban(from, channel, args){
	var names = args.split(" ");
	for(var i = 0; i < names.length; i++) global.bot.unban(channel, names[i]);
}
function kickban(from, channel, args){
	kick(from, channel, args);
	ban(from, channel, args);
}
function perm(from, channel, args){
	global.permProcess(args, from, channel);
}

global.declareCommand(kick, ["kick"], "op");
global.declareCommand(ban, ["ban"], "op");
global.declareCommand(unban, ["unban"], "op");
global.declareCommand(kickban, ["kickban", "kb"], "op");
// Permissions require better checking when assigning/removing, so it gets done elsewhere.
global.declareCommand(perm, ["perm"], "anyone");