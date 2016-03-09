global.seen = {};

function listener(from, channel, message){
	global.seen[from] = new Date().toString();
}

exports.type = "message#"; // Maybe be "message" instead, to include whispers?
exports.listener = listener;