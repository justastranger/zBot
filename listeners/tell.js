global.tells = {};

function listener(from, channel, message){
	var fromLower = from.toLowerCase();
	// Check to see if a person has tells
	if(global.tells[fromLower] != undefined){
		// Log them all for debug purposes
		console.log(global.tells[fromLower]);
		// Loop through and spam them into chat
		for(var a in global.tells[fromLower]){
			global.bot.say(channel, global.tells[fromLower][a].sender+"=>"+from+": "+global.tells[fromLower][a].message);
		}
		// Delete their tell entry so that we don't think they have tells
		delete global.tells[fromLower];
	}
}

exports.type = "message#";
exports.listener = listener;