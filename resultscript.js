
function getCard(){
    var cpanel = document.getElementById("cpanel");
    var textpanel = document.getElementById("textpanel");
    var q = location.search.substring(1);
    var keyvalue = q.split('=');
    var key = decodeURIComponent(keyvalue[0]);
    var card = decodeURIComponent(keyvalue[1]);
    var cts = makeString(card);

    textpanel.innerHTML = "Was your card the " + cts + "?";
    cpanel.innerHTML = "<img src='cardimages\/" + card + ".png' \/>";
  
}

function makeString(c){
     var ranks = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
    var suits = ["spades", "hearts", "diamonds", "clubs"];

    for(var s = 0; s < suits.length; s++){
        for(var r = 0; r < ranks.length; r++){
            if(c.includes(suits[s]) && c.includes(ranks[r])){
                var cardtostr = ranks[r] + " of " + suits[s];
                return cardtostr; 
            }

        }
    }
}

if(window.addEventListener){
    window.addEventListener("load", getCard, false);
}else if(window.attachEvent){
    window.attachEvent("onload", getCard);
}