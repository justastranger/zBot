var googleSearch = require("google");
var googleImages = require("google-images");
var youtubeSearch = require("youtube-search");
var privateStuff = require("../private.js");

function google(from, username, channel, args){
	if(args == "") {
		global.bot.say(channel, "Google for what?");
		return;
	}
	googleSearch(args, function(err, next, links){
		if (err) {
			global.bot.say(channel, err);
			return;
		}
		if(links.length > 0) global.bot.say(channel, (links[0].title + " - " + links[0].link + " - " + links[0].description.replace("\n","")));
		else global.bot.say(channel, "There's nothing there.");
	})
}

function gis(from, username, channel, args){
	if(args == ""){
		global.bot.say(channel, "Search for what?");
		return;
	}
	googleImages.search(args, function(err, images){
		if (err) {
			global.bot.say(channel, err);
			return;
		}
		if(images.length > 0) global.bot.say(channel, images[0].unescapedUrl);
		else global.bot.say(channel, "There's nothing there.");
	})
}

function youtube(from, username, channel, args){
	if(args == ""){
		global.bot.say(channel, "Search for what?");
		return;
	}
	var opts = {
		maxResults: 1,
		key: privateStuff.googleAPIKey
	};
	youtubeSearch(args, opts, function(err, result){
		if (err) {
			global.bot.say(channel, err);
			return;
		}
		if (result.length > 0) global.bot.say(channel, result[0].title + " - " + result[0].link + " - " + result[0].description);
		else global.bot.say(channel, "There's nothing there.");
	})
	
}

global.declareCommand(google, ["g", "google"], "anyone");
global.declareCommand(gis, ["gis"], "anyone");
global.declareCommand(youtube, ["yt", "youtube"], "anyone");
