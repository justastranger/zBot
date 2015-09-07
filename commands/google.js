var googleSearch = require("google");
var googleImages = require("google-images");
var youtubeSearch = require("youtube-search");
var priv = require("../private.js");

function google(from, channel, args){
	if(args == "") {
		global.bot.say(channel, "Google for what?");
		return;
	}
	googleSearch(args, function(err, next, links){
		if (err) {
			global.bot.say(channel, err);
			return;
		}
		global.bot.say(channel, (links[0].title + " - " + links[0].link + " - " + links[0].description.replace("\n","")));
	})
}

function gis(from, channel, args){
	if(args == ""){
		global.bot.say(channel, "Search for what?");
		return;
	}
	googleImages.search(args, function(err, images){
		if (err) {
			global.bot.say(channel, err);
			return;
		}
		global.bot.say(channel, images[0].unescapedUrl);
	})
}

function youtube(from, channel, args){
	if(args == ""){
		global.bot.say(channel, "Search for what?");
		return;
	}
	var opts = {
		maxResults: 1,
		key: priv.googleAPIKey
	};
	youtubeSearch(args, opts, function(err, result){
		if (err) {
			global.bot.say(channel, err);
			return;
		}
		global.bot.say(channel, result[0].title + " - " + result[0].link + " - " + result[0].description);
	})
	
}

global.declareCommand(google, ["g", "google"], "anyone");
global.declareCommand(gis, ["gis"], "anyone");
global.declareCommand(youtube, ["yt", "youtube"], "anyone");
