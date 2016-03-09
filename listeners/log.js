function listener(from, channel, message){
	console.log(channel + "=>" + from + ": " + message);
}

exports.listener = listener;