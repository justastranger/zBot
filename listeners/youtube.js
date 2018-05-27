var fetchYoutubeInfo = require("youtube-info");

// Look for youtube links and send info about them to the channel the link was posted to
function listener(from, channel, message){
	// callback to handle the data returned by youtube-info
	function callback(err, data){
		// if there's an error, most likely from a malformed id or one that doesn't exist, apologize and abort
		if (err) {
			global.bot.say(channel, "I don't know what video that is, sorry!");
			return;
		}
		// Otherwise, start constructing the response
		// youtube-info returns the entirety of the description in HTML, so we'll trancute it to the first 50 characters to keep it brief
		// youtube-info returns data.duration in seconds, so we'll convert to hh:mm:ss
		// stole this bit from https://stackoverflow.com/questions/1322732/convert-seconds-to-hh-mm-ss-with-javascript#comment57297644_25279340
		var message = data.title + " | " + data.description.substr(0, 75) + " | " + data.views + " views | " + new Date(data.duration*1000).toISOString().substr(11,8);
		// Emit it to the channel that the message came from
		global.bot.say(channel, message);
	}
	// Check to see if there are youtube/youtu.be links in a message using regex, should not match if "youtube" is only in the path
	if(/\b(?:https?:\/\/)?(?:\S+\.)?youtu(?:\.be|be\.com)\S+\b/gi.test(message)) {
		// Extract all youtube urls in message
		// Matches youtube.com, www.youtube.com, and youtu.be links, with our without ssl
		// Matches until the ampersand, if present, excluding any meteadata
		var urls = message.match(/\b(?:https?:\/\/)?(?:\S+\.)?youtu(?:\.be|be\.com)\/(?:[^\&\s])+\b/gi);
		// Loop through each captured URL, might limit it to first one to prevent spam
		urls.forEach(function (url){
			// Check for a =, if it doesn't exist, we're handling a youtu.be link which needs to be split differently
			if (~url.indexOf("=")){
				// Break the URL apart, the ID is always after the first = when youtube.com
				// Otherwise, youtu.be links need to be broken at a /
				var id = url.split("=")[1];
			} else {
				// "https://youtu.be/nah07N01UF0".split("/") -> ["https:", "", "youtu.be", "nah07N01UF0"]
				// So the ID will be the third string in the Array
				var id = url.split("/")[3];
			}
			// Finally, pass on the ID to youtube-info and process whatever it returns
			fetchYoutubeInfo(id, callback);
		});
	}
}

exports.type = "message#";
exports.listener = listener;