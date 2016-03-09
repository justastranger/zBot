global.seen = {};

function listener(from, channel, message){
	global.seen[from] = new Date().toString();
}

exports.listener = listener;