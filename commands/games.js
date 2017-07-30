var fs = require("fs");

function roll(from, username, channel, args){
	var reg = new RegExp("(\\d+)d(\\d+)");
	if (!reg.test(args)){
		global.bot.say(channel, "That isn't a dice roll...");
		return;
	}
	var result = (function(args){
		var result = args.match(reg);
		var amount = Number(result[1]);
		var kind = Number(result[2]);
		var total = 0;
		var rolls = [];
		var roll;
		for (var i = 0; i < amount; i++){
			roll = Math.ceil(Math.random() * kind);
			total += roll;
			rolls.push(roll);
		}
		return [total, rolls];
	})(args);
	global.bot.say(channel, "Rolled "+args+", got: "+result[0] + " with "+ result[1].join(" "));
}

function skye(from, username, channel, args){
	var users = global.bot.chanData(channel).users;
	var userArray = [];
	for (var a in users){
		userArray.push(a.toLowerCase());
	}
	if(~userArray.indexOf("skye")) global.bot.say(channel, "Hi Skye!");
	else global.bot.say(channel, "Where's Skye?");
}

function idleRPG(from, username, channel, args){

    var now = Date.now();
    var tmpIdler = global.idleRPG[username];
    var levels = (function (){
                     	var levelArray = [],
                     	points = 0;

                     	for (lvl = 1; lvl <= 200; lvl++) {
                     	    // If we go back to using the line below, it will show the total amount of points per level
                     		//points += Math.floor(lvl + 300 * Math.pow(2, lvl / 7.));
                     		// Otherwise, if we skip the += thing, we get the differences between levels, which is much more useful
                     		levelArray[lvl+1] = Math.floor(Math.floor(lvl + 300 * Math.pow(2, lvl / 7.))/4);
                     	}
                     	return levelArray;
                     })();

    function save(){
        fs.writeFileSync("idleRPG.json", JSON.stringify(global.idleRPG)); // Save IdleRPG stuff to file so it persists in a way that hopefully works?
    }

    if(tmpIdler!=undefined){ // If this person exists in our database of idlers
        if(now >= tmpIdler.nextLevel){
            tmpIdler.level += 1; // increment their level
            tmpIdler.nextLevel = now+(levels[tmpIdler.level+1]*1000) // move to the next time increment in the array and add onto the current time
                                                                     // Start counting from the time they level up
            global.idleRPG[from.toLowerCase()] = tmpIdler; // Make sure to save their progress to memory
            global.bot.say(channel, "Congratulations "+from+"! You have reached level " + tmpIdler.level + "!");
            global.bot.notice(from, "Only " + levels[tmpIdler.level+1] + "xp until your next level!");
            save();
            console.log(global.idleRPG[from.toLowerCase()]);
        } else {
            global.bot.notice(from, "Only " + Math.floor((tmpIdler.nextLevel-now)/1000) +
                                        "xp until your next level! You currently have " +
                                         Math.floor((now-tmpIdler.start)/1000) + "xp out of " +
                                         Math.floor((tmpIdler.nextLevel-tmpIdler.start)/1000) + "xp.");
            console.log(global.idleRPG[username]);
        }
    } else { // If they haven't started before, start them now
        global.idleRPG[username] = {
            start: now,
            level: 1,
            nextLevel: now+(levels[2]*1000)
        };
        global.bot.notice(from, "You are now registered for IdleRPG! Only " + levels[2] + "xp until you level up!")
        save();
        console.log(global.idleRPG[username]);
    }


}

// Declare all aliases of the command
global.declareCommand(roll, ["roll", "die", "d"], "anyone");
global.declareCommand(skye, ["skye"], "anyone");
global.declareCommand(idleRPG, ["level"], "anyone");

var BlackJack = require("./blackjack.js");
global.bjo = new BlackJack();

function bj(from, username, channel, args){
	var subcommand = args.split(" ")[0];
	if(global.bjo.commands[subcommand] != undefined) global.bjo.commands[subcommand](from, channel, args);
	else global.bjo.commands.help(from, channel, args);
}
global.declareCommand(bj, ["blackjack", "bj"], "anyone");