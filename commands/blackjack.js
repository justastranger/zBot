function BlackJack() {
	this.games = [];
	this.cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10];

	this.start = function(from, channel, args) {
		// Bot should only start blackjack in its own channel!
		//if (!args[0] || args[0].length < 2 ||args[0][0] !== "#") {
		//	global.bot.say(from, "You have to provide a channel as first argument.");
		//	return;
		//}
		for (var key = 0; key < this.games.length; key++) {
			if (this.games[key].playIn === channel) {
				global.bot.say(from, "There is already a game going on in " + channel);
				return;
			}
		}
		//global.bot.join(args[0]);
		this.games.push({
			owner: from,
			players: {},
			playIn: channel,
			started: Date.now()
		});
		this.games[this.games.length - 1].players[from] = {
			cards: [this.cards[Math.floor(Math.random() * this.cards.length)], this.cards[Math.floor(Math.random() * this.cards.length)]]
		};
		global.bot.say(channel, "### A blackjack game has been started in this channel by '" + from + "' ###");
		global.bot.say(channel, "### If you want to join say ',blackjack join' further instructions will be send as private message ###");
		global.bot.say(channel, from +" currently has the following cards: " + this.games[this.games.length - 1].players[from].cards.join(", ") + " which gives you a total of " + this.sum(this.games[this.games.length - 1].players[from].cards));
	};

	this.commands = {};

	this.commands.start = function(from, channel, args, command) {
		this.start(from, channel);
	}.bind(this);

	this.commands.join = function(from, channel, args) {
		for (var key = 0; key < this.games.length; key++) {
			if (this.games[key].playIn === channel) {
				if (this.games[key].players[from]) {
					global.bot.say(this.games[key].playIn, from + ", you already joined this game, say 'blackjack card' to get another card or 'blackjack done' if you are ready.");
					return;
				} else {
					this.games[key].players[from] = {
						cards: [this.cards[Math.floor(Math.random() * this.cards.length)], this.cards[Math.floor(Math.random() * this.cards.length)]]
					};
					global.bot.say(this.games[key].playIn, from + " joined " + this.games[key].owner + "s game.");
					var tmp = from+ " currently has the following cards: " + this.games[key].players[from].cards.join(", ") + " which gives him a total of " + this.sum(this.games[key].players[from].cards)
					if (this.sum(this.games[key].players[from].cards) < 21) tmp += ", if you want another card say ',blackjack card' if you want to stop say ',blackjack done'"
					else {
						this.commands.done(from, channel, args);
						tmp += " since you have 21 or more, you've been marked as done."
					}
					global.bot.say(channel, tmp);
					return;
				}
			}
		}
		global.bot.say(channel, from + " there is no blackjack game in this room yet, why don't you start one?");
	}.bind(this);

	this.commands.card = function(from, channel, args) {
		for (var key = 0; key < this.games.length; key++) {
			if (this.games[key].players[from] && !this.games[key].players[from].done) {
				if (this.sum(this.games[key].players[from].cards) > 20) {
					this.games[key].players[from].done = true;
					if (this.everyoneDone(this.games[key].players)) {
						this.finishGame(key);
					}
					global.bot.say(channel, "You already have equal or more than 21, we marked you as done.");
				} else {
					this.games[key].players[from].cards.push(this.cards[Math.floor(Math.random() * this.cards.length)]);
					var tmp = "You currently have the following cards: " + this.games[key].players[from].cards.join(", ") + " which gives you a total of " + this.sum(this.games[key].players[from].cards)
					if (this.sum(this.games[key].players[from].cards) < 21) tmp += " if you want another card say 'blackjack card' if you want to stop say 'blackjack done'"
					else {
						this.commands.done(from, channel, args);
						tmp += " since you have 21 or more, you've been marked as done."
					}
					global.bot.say(channel, tmp);
				}
				return;
			}
		}
		global.bot.say(channel, "You aren't playing any game yet, try 'blackjack join'.");
	}.bind(this);

	this.commands.done = function(from, channel, args) {
		for (var key = 0; key < this.games.length; key++) {
			if (this.games[key].players[from] && !this.games[key].players[from].done) {
				this.games[key].players[from].done = true;
				//global.bot.say(this.games[key].playIn, from + " is ready with picking cards.");
				if (this.everyoneDone(this.games[key].players)) {
					this.finishGame(key);
				}
				return;
			}
		}
	}.bind(this);

	this.commands.forceEnd = function(from, channel, args) {
		for (var key = 0; key < this.games.length; key++) {
			if (this.games[key].playIn === channel) {
				if (this.games[key].started < Date.now() - 180000) {
					this.finishGame(key);
				} else {
					global.bot.say(this.games[key].playIn, "You can force the game to end in " + Math.round((180000 - Date.now() + this.games[key].started) / 1000) + " seconds.");
				}
			}
		}
	}.bind(this);

	this.commands.status = function(from, channel, args) {
		for (var key = 0; key < this.games.length; key++) {
			if (this.games[key].playIn === channel) {
				var players = [];
				for (var k in this.games[key].players) {
					if (this.games[key].players[k].done) {
						players.push(k + " (ready)");
					} else {
						players.push(k);
					}
				}
				global.bot.say(channel, "This game was started by: " + this.games[key].owner + " " + Math.round((Date.now() - this.games[key].started) / 1000) + " seconds ago (you can force a game channel end after 3 minutes (180 seconds))");
				global.bot.say(channel, "Players: " + players.join(', '));
			}
		}
	}.bind(this);

	this.commands.disband = function(from, channel, args) {
		var count = 0;
		for (var key = 0; key < this.games.length; key++) {
			if (this.games[key].owner === from) {
				//global.bot.say(this.games[key].playIn, from + " disbanded your game.");
				this.games.splice(key, 1);
				count++;
			}
		}
		global.bot.say(channel, from+ " disbanded " + count + " games.");
	}.bind(this);

	this.commands.help = function(from, channel, args) {
		var sayTo = channel, cmds = [];
		if (sayTo === global.bot.nick) {
			sayTo = from;
		}
		for (var key in this.commands) {
			cmds.push(key);
		}
		global.bot.say(channel, "Playing a blackjack game is simple. To start one simply type: ',blackjack start'");
		global.bot.say(channel, "The goal is to get as close as possible to 21 but not going over, 1 counts as a 11 or a 1. When everyone goes over 21, the house wins.");
		global.bot.say(channel, "The following commands are available (',blackjack' followed by): " + cmds.join(", "));
	}.bind(this);

	this.finishGame = function(key) {
		var botCards = [];
		while (this.sum(botCards) < 17) {
			botCards.push(this.cards[Math.floor(Math.random() * this.cards.length)]);
		}
		var winner = {name: global.bot.nick, points: this.sum(botCards)};
		var scores = ["The house (" + winner.points + ")"];
		for (var k in this.games[key].players) {
			var score = this.sum(this.games[key].players[k].cards);
			scores.push(k + " (" + score + ")");
			if ((score > winner.points && score < 22) || (score < 22 && winner.points > 21)) {
				winner.name = k;
				winner.points = score;
			} else if (score === winner.points && winner.points < 22) {
				winner.name += " and " + k;
			}
		}
		global.bot.say(this.games[key].playIn, winner.name + " won with " + winner.points + ". The following people played: " + scores.join(', '));
		this.games.splice(key, 1);
	};

	this.everyoneDone = function(obj) {
		for (var key in obj) {
			if (!obj[key].done) {
				return false;
			}
		}
		return true;
	};

	this.sum = function sum(arr) {
		var sum = 0, ones = 0;
		for (var key = 0; key < arr.length; key++) {
			if (arr[key] === 1) {
				sum += 11;
				ones++;
			} else {
				sum += arr[key];
			}
		}
		while (sum > 21 && ones > 0) {
			sum -= 10;
			ones--;
		}
		return sum;
	};
}

module.exports = BlackJack;