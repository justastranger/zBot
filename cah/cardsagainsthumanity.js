let fs = require("fs");

let cards = {};
let cardsFile = "cards.json";
if(fs.existsSync(cardsFile)){
    cards = (JSON.parse(fs.readFileSync(cardsFile).toString()));
    console.log("Found Cards!");
    console.log(cards);
} else {
    console.log("Missing Cards Against Humanity cards file")
}

let cardCzar;
let started = false;
// players = {justastranger: {hand: [Strings], score:Number}}
// whiteCards are simple text
// blackCards are {text:String, pick:Number}
let players = {};
let played = [];
let blackCard = {};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function CardsHandler(from, username, channel, args){
    let arguments = args.split(" ");
    if(arguments[0] === "start") {
        if(started) global.bot.say(channel, "We've already started, silly!");
        else {
            cardCzar = from;
            blackCard = getRandomBlackCard();
        }
        return;
    }
    if(arguments[0] === "join") {
        if(!players.includes(from)) deal(from,  7); // Deal someone 7 cards when they join
        else global.bot.notice(from, "You're already in the game, " + from + "!");
        return;
    }
    if(arguments[0] === "play") {
        // arguments[1] should be an integer here
        let cardIndex = Number(arguments[1])-1;
        if(players[from].hand[cardIndex] === undefined) {
            global.bot.notice(from, "What card is THAT, " + from + "?");
        } else {
            played.push(players[from].hand[cardIndex]);
            players[from].hand = players[from].hand.splice(cardIndex,1);
            deal(from, 1);
        }
        return;
    }

}

function deal(from, count){
    if(players[from] !== undefined) players[from] = [];
    for(let i = 0; i < count; i++){
        players[from].hand.push(getRandomWhiteCard());
    }
}

function getRandomWhiteCard(){
    let cardIndex = getRandomInt(0, cards.whiteCards.length);
    return cards.whiteCards[cardIndex];
}

function getRandomBlackCard(){
    let cardIndex = getRandomInt(0, cards.blackCards.length);
    return cards.blackCards[cardIndex];
}


module.exports.handler = CardsHandler;