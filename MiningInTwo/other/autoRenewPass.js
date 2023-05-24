let gtheMsg
register("Chat", (theMsg) => {  
    gtheMsg = theMsg
    if(ChatLib.removeFormatting(gtheMsg) == "Click to buy a new pass for 10,000 Coins" || ChatLib.removeFormatting(gtheMsg) == "Your pass to the Crystal Hollows will expire in 1 minute" || ChatLib.removeFormatting(gtheMsg) == "Click here to purchase a new 5 hour pass for 10,000 Coins") {
        ChatLib.command('purchasecrystallhollowspass', false);
        ChatLib.chat('&b&lPurchased crystal hollows pass');
    }
}).setCriteria("${theMsg}")