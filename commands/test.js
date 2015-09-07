function test(from, channel, args){
	console.log(global.bot);
}
global.declareCommand(test, ["test"], "anyone");