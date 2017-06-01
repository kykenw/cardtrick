// Kyle Kenworthy
// Javascript Final Project
// 5/19/2017

//global variables
//holds array of person objects
var people = [];
//iterator for people
var pplCount = 0;
//array for holding card objects
var deck = [];
//array for holding accusation objects
var accusations = [];
//array for holding the table cells with .boolean class
var booleanCells;
//array for holding suspect cards
var suspects = [];
//array for holding innocent cards
var innocent = [];
//end result string for holding the pulled card from deck
var pulledCard = "";
//cooldown for the settimout to add a delay to the table filling out
var cooldown = 2000;
//array for holding the Not Sure accusations
var ptoSolve = [];
//variable for holding a rate for strategy2
var topRate;

//card object blueprint
function Card(rank, suit) {
    //variables for each instance of card
    this.rank = rank;
    this.suit = suit;
    this.name = rank + " of " + suit;
    //method to get the card name
    this.getName = function () {
        return this.name;
    }
}

//accusation object blueprint
function Accusation(acc) {
    //this variable holds the accusation string
    this.accusation = acc;
    //this variable will hold a true or false value
    this.torl;
    this.c;
    this.index;
    //method for getting torl
    this.getTorl = function () {
        return this.torl;
    }
    //method for setting torl to Truth
    this.setTruth = function (i) {
        this.c = "green";
        this.torl = "Truth";
        this.index = i;
        setBooleanValue(this.c, this.torl, this.index);
    }
    //method for setting torl to Lie
    this.setLie = function (i) {
        this.c = "red";
        this.torl = "Lie";
        this.index = i;
        setBooleanValue(this.c, this.torl, this.index);
    }
    //method for setting torl to Not Sure
    this.setNotSure = function (i) {
        this.c = "blue";
        this.torl = "Not Sure";
        this.index = i;
        setBooleanValue(this.c, this.torl, this.index);

    }
    //method for returning the accusation string
    this.getAcc = function () {
        return this.accusation;
    }
}
//function for setting Truth/Lie/NotSure in the table
function setBooleanValue(c, s, i){
    if(booleanCells == undefined){
        booleanCells = document.querySelectorAll(".boolean");
    }
    var col = c;
    var str = s;
    var index = i;
    if(booleanCells[index].style){
        booleanCells[index].style.color = col;
        booleanCells[index].innerHTML = str;
    }
    
}

//person object blueprint
function Person(name, a1, a2) {
    this.name = name;
    this["a1"] = a1;
    this["a2"] = a2;


    //this function returns the persons name
    this.getName = function () {
        return this.name;
    }
    //these didn't work as I wanted them to so I ended up creating a paralell array
    //these functions call a accusation method that returns the accusation string
    this.getAcc1 = function () {
        return this.a1;
    }
    this.getAcc2 = function () {
        return this.a2;
    }
}

function createPerson() {
    //validForm is a function for validating the information before creating a table
    //to ensure that people fill out everything completely
    if (validForm()) {
        //declare local variables
        var nameInput = document.getElementById("nameinput");
        var name = nameInput.value;
        var prefix1 = document.getElementById("prefix1");
        var suffix1 = document.getElementById("suffix1");
        var prefix2 = document.getElementById("prefix2");
        var suffix2 = document.getElementById("suffix2");
        var acc1 = prefix1.options[prefix1.selectedIndex].text;
        var acc2 = prefix2.options[prefix2.selectedIndex].text;
        acc1 += " " + suffix1.options[suffix1.selectedIndex].text;
        acc2 += " " + suffix2.options[suffix2.selectedIndex].text;

        //clear form values
        nameInput.value = "";
        prefix1.selectedIndex = -1;
        prefix2.selectedIndex = -1;
        suffix1.selectedIndex = -1;
        suffix2.selectedIndex = -1;

        //create Accusation objects
        accusations.push(new Accusation(acc1));
        accusations.push(new Accusation(acc2));
        //create Person object and add to people array
        people[pplCount] = new Person(name, acc1, acc2);
        pplCount++;
    }
}
//build the table
function buildTable() {
    var accNumber = 0;
    var tpanel = document.getElementById("tpanel");
    var buttonpanel = document.getElementById("btn");
    var button = document.createElement("button");
    tpanel.innerHTML = "";
    buttonpanel.innerHTML = "";
    var table = document.createElement("table");
    table.id = "table";
    var tbody = document.createElement("tbody");
    tpanel.appendChild(table);
    table.appendChild(tbody);
    rows = [];

    //iterate through all the created people objects
    for (var i = 0; i < people.length; i++) {
        rows.push(document.createElement("tr"));
        tbody.appendChild(rows[accNumber]);

        rows[accNumber].innerHTML += "<td rowspan='2' class='name'>" + people[i].getName();
        rows[accNumber].innerHTML += "</td><td>" + accusations[accNumber].getAcc();
        rows[accNumber].innerHTML += "</td><td class='boolean'></td></tr>";

        accNumber++;
        rows.push(document.createElement("tr"));
        tbody.appendChild(rows[accNumber]);

        rows[accNumber].innerHTML += "<td>" + accusations[accNumber].getAcc();
        rows[accNumber].innerHTML += "</td><td class='boolean'></td></tr>";
        accNumber++;
    }
    buttonpanel.appendChild(button);
    button.textContent = "Solve";
    button.id = "solvebtn";

    if (button.addEventListener) {
        button.addEventListener("click", solve, false);
    } else if (button.attachEvent) {
        button.attachEvent("onclick", solve);
    }
}
//figure out which card was pulled from the deck
function solve() {
    var buttonpanel = document.getElementById("btn");
    //strategy1
    var c1 = "";
    var c2 = "";
    for (var i = 0; i < people.length; i++) {
        var p1 = "it was the";
        var p2 = "it wasn't the";
        var a1 = people[i].getAcc1();
        var a2 = people[i].getAcc2();
        //find scenario where there are 2 "it was the" or 2 "it wasn't the"
        if (a1.includes(p1) && a2.includes(p1) || a1.includes(p2) && a2.includes(p2)) {
            c1 = getCard(a1);
            c2 = getCard(a2);
            suspects.push(c1);
            suspects.push(c2);
            if (suspects.length == 2) {
                break;

            }
        }
    }
    //push all non suspect cards into the innocent array
    for (var i = 0; i < deck.length; i++) {
        if (deck[i].getName() != c1 && deck[i].getName() != c2) {

            innocent.push(deck[i].getName());
        }

    }
    //determine truths/lies
    for (var i = 0; i < accusations.length; i++) {
        var a = accusations[i].getAcc();
        var torl = determineTorL(a);

        //this code allows me to have a setTimeout inside of a loop
        (function (i, torl) {
            setTimeout(function () {

                if (torl == "Lie") {
                    accusations[i].setLie(i);
                } else if (torl == "Truth") {
                    accusations[i].setTruth(i);
                } else if (torl == "Not Sure") {
                    accusations[i].setNotSure(i);
                }
            }, cooldown + (1000 * i));
        })(i, torl);
    }
    //create a next button and append it to the buttonpanel
    next = document.createElement("button");
    next.textContent = "Next";
    next.id = "next";
    buttonpanel.appendChild(next);
    //create event listener for the next button
    if (next.addEventListener) {
        next.addEventListener("click", getPulledCard, false);
    } else if (next.attachEvent) {
        next.attachEvent("onclick", getPulledCard);
    }

}
function getPulledCard() {
    //try to sudoku the boolean values to determine which card was pulled
    pulledCard = sudoku();//sudoku returns either a card or ""

    //if no determination has been made try another strategy
    if (pulledCard == "") {
        //start strategy2
        //strategy2 is to make a guess at which card was pulled
        //based on the number of times a card is referrenced
        
        var appearances = [];//hold the number of occurences each card gets referrenced
        var rates = [];//hold strings for each card
        for (var c = 0; c < deck.length; c++) {
            var deckCard = deck[c].getName();//get name of card in deck
            var occurences = 0;
            for (var a = 0; a < accusations.length; a++) {
                var ac = accusations[a].getAcc();
                var accCard = getCard(ac);//get the card name out of accusation
                if (deckCard == accCard) {
                    occurences++;
                }
            }
            appearances.push(occurences);
        }
        //calculate rates and put them in paralell array
        for (var c = 0; c < deck.length; c++) {
            var oc = appearances[c];
            var rate = (1 - Math.pow(0.50, oc)) * 100;
            rates.push(rate);
        }
        //get the highest value in the rates array
        topRate = Math.max.apply(Math, rates);
        for (var n = 0; n<rates.length; n++) {
            //find the card that has the topRate and assign it to topCard
            if (topRate == rates[n]) {
                pulledCard = deck[n].getName();
            }
        }
        //make a guess at which card was pulled
        console.log("was it the " + pulledCard + "(%" + topRate + ")?");
    } else {
        console.log(pulledCard + " is the card pulled from the deck")
    }
}
//function to do data analysis on the table
function sudoku() {
    //function that if one is truth the other is false and fills in
    fillIn();

    //create a list of accusations that are Not Sure
    for (var x = 0; x < accusations.length; x++) {
        if (accusations[x].getTorl() == "Not Sure") {
            var a = "";
            a = accusations[x].getAcc();
            ptoSolve.push(a);
        }
    }

    //now that we have a list of problems we can try to find solutions for them
    solveProblems();

    //function that if one is truth the other is false and fills in
    fillIn();

    //try to find the pulled card
    for (var p = 0; p < accusations.length; p++) {
        var a = accusations[p].getAcc();
        var torl = accusations[p].getTorl();
        var prefix = getPrefix(a);
        var card = getCard(a);

        if (prefix == "it was the" && torl == "Truth") {
            return card;
        } else if (prefix == "it wasn't the" && torl == "Lie") {
            return card;
        } else {
            return "";
        }
    }
}
function solveProblems(){
    var acc;
    var torl;
    var solution;
    Loop1:
    for (var a = 0; a < accusations.length; a++) {
        acc = accusations[a].getAcc();
        torl = accusations[a].getTorl();
        for (var p = 0; p < ptoSolve.length; p++) {
            //there are issues with this block that I need to figure out
            if (ptoSolve[p] == acc) {
                if (torl != "Not Sure") {
                    solution = accusations[a].getTorl();
                }
                if (solution == "Truth") {
                    accusations[a].setTruth(a);
                    ptoSolve.splice(p, 1);
                    //console.log("set " + ptoSolve[p] + " to Truth");
                    continue Loop1;

                }
                if (solution == "Lie") {
                    accusations[a].setLie(a);
                    ptoSolve.splice(p, 1)
                    //console.log("set " + ptoSolve[p] + " to Lie");
                    continue Loop1;
                }
            }
            //there are issues with this block I need to figure out
            //if problem to solve is opposite of current accusation
            if (ptoSolve[p] == getOpposite(acc)) {
                var s;
                if (torl != "Not Sure") {
                    solution = accusations[a].getTorl();
                }
                //set solution for the opposite accusation
                if (solution == "Truth") {
                    s = "Lie";
                }
                if (solution == "Lie") {
                    s = "Truth";
                }
                for (var n = 0; n<accusations.length; n++) {
                    var accu = accusations[n].getAcc();
                    if (accu == ptoSolve[p]) {
                        if (s == "Lie") {
                            accusations[n].setLie(n);
                            ptoSolve.splice(p, 1);
                            continue Loop1;
                        }
                        if (s == "Truth") {
                            accusations[n].setTruth(n);
                            ptoSolve.splice(p, 1);
                            continue Loop1;
                        }
                    }
                }
            }
        }
        //if there are still any problems to solve restart the outer loop
        if (ptoSolve.length > 0) {
            continue Loop1;
        }
    }
}
//return the prefix of the card
function getPrefix(a) {
    var prefix;
    if (a.includes("it was the")) {
        prefix = "it was the";
    }else if (a.includes("it wasn't the")) {
        prefix = "it wasn't the";
    }else{
        console.log("accusation doesn't have a valid prefix");
    }
    return prefix;
}
//function to determine whether an accusation is a truth or a lie
function determineTorL(a) {
    var prefix = getPrefix(a);
    var card = getCard(a);
    var isInnocent;

    //determine if the card is found in the list of innocent cards
    for (var i = 0; i < innocent.length; i++) {

        if (card == innocent[i]) {
            isInnocent = true;
        }
    }
    //if card isn't in the list of innocent cards check for if its in suspected cards
    if (isInnocent == undefined) {
        //determine if the card is found in suspected cards
        for (var i = 0; i < suspects.length; i++) {
            if (card == suspects[i]) {
                isInnocent = false;
            }
        }

    }

    if (prefix == "it was the" && isInnocent == true) {
        //console.log(card + " is in innocent array(1)");
        return "Lie";
    } else if (prefix == "it wasn't the" && isInnocent == true) {
        //console.log(card + " is in innocent array(2)");
        return "Truth";
    } else if (prefix == "it was the" && isInnocent == false) {
        //console.log(card + " is in suspect array(3)");
        return "Not Sure";
    } else if (prefix == "it wasn't the" && isInnocent == false) {
        //console.log(card + " is in suspect array(4)");
        return "Not Sure";
    } else {
        //console.log("Error card not in innocent/suspect array");
    }
}
//if one is truth the other false - used in the sudoku array
function fillIn(){
    //fill in any information that we can
    for (var x = 0; x < accusations.length; x++) {
        var torl = accusations[x].getTorl();
        if (x == 0) {
            if (torl == "Lie") {
                accusations[x + 1].setTruth(x + 1);
            } else if (torl == "Truth") {
                accusations[x + 1].setLie(x + 1);
            }
            //if even number
        } else if (x % 2 == 0) {
            console.log(x + "%2==0");
            if (torl == "Lie") {
                accusations[x + 1].setTruth(x + 1);
            } else if (torl == "Truth") {
                accusations[x + 1].setLie(x + 1);
            }
            //if odd number
        } else if (x % 2 == 1) {
            console.log(x + "%2==1");
            if (torl == "Lie") {
                accusations[x - 1].setTruth(x - 1);
            } else if (torl == "Truth") {
                accusations[x - 1].setLie(x - 1);
            }
        }
    }
}
//figure out which card the accusation contains and return it
function getCard(a) {
    for (var i = 0; i < deck.length; i++) {
        if (a.includes(deck[i].getName())) {
            return deck[i].getName();
        }
    }
}
//returns the opposite of the string passed as a parameter
function getOpposite(a) {
    var prefix = getPrefix(a);
    var newprefix;
    var card = getCard(a);
    var newAcc = "";

    if (prefix == "it was the") {
        newprefix = "it wasn't the ";
    }
    if (prefix == "it wasn't the") {
        newprefix = "it was the ";
    }
    newAcc = newprefix + card;
    return newAcc;

}
//create events for the buttons to respond to clicks
function createEventListeners() {
    createPersonBtn = document.getElementById("personBtn");
    buildTableBtn = document.getElementById("buildTableBtn");

    if (createPersonBtn.addEventListener) {
        createPersonBtn.addEventListener("click", createPerson, false);
    } else if (createPersonBtn.attachEvent) {
        createPersonBtn.attachEvent("onclick", createPerson);
    }
    if (buildTableBtn.addEventListener) {
        buildTableBtn.addEventListener("click", buildTable, false);
    } else if (buildTableBtn.attachEvent) {
        buildTableBtn.attachEvent("onclick", buildTable);
    }

}

function buildDeck() {
    //arrays to create a deck of cards
    var ranks = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"];
    var suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
    //iterate through the ranks
    for (var x = 0; x < ranks.length; x++) {
        //iterate through the suits
        for (var i = 0; i < suits.length; i++) {
            //create a new card object and push it into the deck array
            deck.push(new Card(ranks[x], suits[i]))
        }
    }

    //add options to the first select element in the dom
    s1 = document.getElementById("suffix1");
    for (var z = 0; z < deck.length; z++) {
        var option1 = document.createElement("option");
        option1.innerHTML = deck[z].getName()
        s1.appendChild(option1);
    }
    document.getElementById("prefix1").selectedIndex = -1;
    s1.selectedIndex = -1;
    //add options to the second select element in the dom
    s2 = document.getElementById("suffix2");
    for (var a = 0; a < deck.length; a++) {
        var option2 = document.createElement("option");
        option2.innerHTML = deck[a].getName()
        s2.appendChild(option2);
    }
    document.getElementById("prefix2").selectedIndex = -1;
    s2.selectedIndex = -1;
}
//stop invalid submissions from getting submitted
function validForm() {
    var n = document.getElementById("nameinput").value;
    var p1 = document.getElementById("prefix1").value;
    var p2 = document.getElementById("prefix1").value;
    var s1 = document.getElementById("prefix1").value;
    var s2 = document.getElementById("prefix1").value;
    if (n != "" && p1 != "" && p2 != "" && s1 != "" && s2 != "") {
        return true;
    } else {
        return true;
    }

}
function createTitle(){
    
}
//build the deck of cards and create eventlisteners for the buttons
function setup() {
    createTitle();
    buildDeck();
    createEventListeners();
}

//call setup as soon as page loads
if (window.addEventListener) {
    window.addEventListener("load", setup, false);
} else if (window.attachEvent) {
    window.attachEvent("onload", setup);
}