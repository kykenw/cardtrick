// Kyle Kenworthy
// Javascript Final Project
// 5/19/2017

//global variables
var people = [];
//holds array of person objects
var deck = [];
//array for holding card objects
var accusations = [];
//array for holding accusation objects
var booleanCells;
//array for holding the table cells with .boolean class
var suspects = [];
//array for holding suspect cards
var innocent = [];
//array for holding innocent cards
var pulledCard = "";
//end result string for holding the pulled card from deck
var cooldown = 1000;
//cooldown for the settimout to add a delay to the table filling out
var topRate;
//variable for holding a rate for strategy2
var unabletosolve = [];

//array of solutions
var solutions = [];

function Card(rank, suit) {
    //card object blueprint
    //variables for each instance of card
    this.rank = rank;
    this.suit = suit;
    this.name = rank + " of " + suit;
    //method to get the card name
    this.getName = function () {
        return this.name;
    }
}

function Solution(acc, torl) {
    this.acc = acc;
    this.torl = torl;

    this.getAcc = function () {
        return this.acc;
    }
    this.getTorl = function () {
        return this.torl;
    }
}

function Accusation(acc) {
    //accusation object blueprint
    this.accusation = acc;
    //this variable holds the accusation string
    this.torl;
    this.opptorl;
    //this variable will hold a true or false value
    this.c;
    this.index;
    this.getOppTorl = function () {
        return this.opptorl;
    }
    this.getTorl = function () {
        //method for getting torl
        return this.torl;
    }
    this.setTruth = function (i) {
        //method for setting torl to Truth
        this.c = "green";
        this.torl = "Truth";
        this.opptorl = "Lie";
        this.index = i;
        if (this.index != -1) {
            setBooleanValue(this.c, this.torl, this.index);
        }
    }
    this.setLie = function (i) {
        //method for setting torl to Lie
        this.c = "red";
        this.torl = "Lie";
        this.opptorl = "Truth";
        this.index = i;
        if (this.index != -1) {
            setBooleanValue(this.c, this.torl, this.index);
        }
    }
    this.setNotSure = function (i) {
        //method for setting torl to Not Sure
        this.c = "blue";
        this.torl = "Not Sure";
        this.opptorl = "Not Sure";
        this.index = i;
        if (this.index != -1) {
            setBooleanValue(this.c, this.torl, this.index);
        }

    }
    this.getAcc = function () {
        //method for returning the accusation string
        return this.accusation;
    }
}
function setBooleanValue(c, s, i) {
    //function for setting Truth/Lie/NotSure in the table
    if (booleanCells == undefined) {
        booleanCells = document.querySelectorAll(".boolean");
    }
    var col = c;
    var str = s;
    var index = i;
    if (booleanCells[index].style) {
        booleanCells[index].style.color = col;
        booleanCells[index].innerHTML = str;
    }

}

function Person(name, a1, a2) {
    //person object blueprint
    this.name = name;
    this["a1"] = a1;
    this["a2"] = a2;


    this.getName = function () {
        //this method returns the persons name
        return this.name;
    }

    this.getAcc1 = function () {
        return this.a1;
    }
    this.getAcc2 = function () {
        return this.a2;
    }
}
function solutionExists(acc) {
    accu = acc;
    for (var s = 0; s < solutions.length; s++) {
        a = solutions[s].getAcc();
        if (accu == a) {
            return true;
        }
    }
    return false;
}
function searchSolutions(acc) {
    var a;
    var answer;
    for (var s = 0; s < solutions.length; s++) {
        a = solutions[s].getAcc();
        if (acc == a) {
            answer = solutions[s].getTorl();
        }
    }
    if (answer == undefined) {
        return "no solution";
    } else {
        return answer;
    }
}
function test() {
    //set this to whatever you want the pulled card to be
    var wasPulled = "Ace of Spades";
    //set this to the card that is paired with the wasPulled card
    var theSuspect = "2 of Hearts";
    var p1 = "it was the ";
    var p2 = "it wasn't the ";
    //set this to the number of people you would like to generate
    var numofPeople = 5;
    //this is used with the random functuon to generate a number between 0 - acc
    var acc = numofPeople * 2;
    //randomly put wasPulled into the table
    var showsup = Math.floor((Math.random() * acc));
    //index in table that some contradictory data shows up
    var cDataLoc = Math.floor((Math.random() * acc));
    //if they are the same generate numbers for them until they are different

    while (showsup == cDataLoc) {
        showsup = Math.floor((Math.random() * acc));
        cDataLoc = Math.floor((Math.random() * acc));
    }

    //create people with 1 truth 1 lie
    for (var p = 0; p < numofPeople; p++) {
        //2 accusations per person so accNum used for index if accusations
        var accNum = p * 2;
        var plusOne = accNum + 1;

        //variables for random numbers
        var n1;
        var n2;
        //variables for cards
        var c1;
        var c2;
        //variables for accusations
        var a1;
        var a2;
        var prefix;
        var pcinTable = false;
        //create an error if pulledcard doesnt show up in table
        if (accNum == showsup || plusOne == showsup) {
            pcinTable = true;
        }
        //generate random numbers
        n1 = Math.floor((Math.random() * 51));
        n2 = Math.floor((Math.random() * 51));
        //keep rolling until both are unique numbers
        while (n1 == n2) {
            n1 = Math.floor((Math.random() * 51));
            n2 = Math.floor((Math.random() * 51));
        }
        //make sure wasPulled shows up in table at the index of showsup and
        //and theSuspect shows up in paired in the right spot
        //if even number accNum = p*2
        if (accNum == showsup) {
            c1 = wasPulled;
            c2 = theSuspect;
            //if odd number
        } else if (plusOne == showsup) {
            c1 = theSuspect;
            c2 = wasPulled;
            //if accNum != showup set card names
        } else {
            c1 = deck[n1].getName();
            c2 = deck[n2].getName();
        }
        //if accNum == cDataLoc overwrite the card name
        //make sure contradictory data shows up in table
        //even
        if (accNum == cDataLoc) {
            c1 = theSuspect;
            //odd
        } else if (plusOne == cDataLoc) {
            c2 = theSuspect;
            //if accNum != showup set card names
        }
        //create a truth
        if (wasPulled == c1) {
            prefix = p1;
        } else {
            prefix = p2;
        }
        //create first accusation
        a1 = prefix + c1;

        //create a lie
        if (wasPulled == c2) {
            prefix = p2;
        } else {
            prefix = p1;
        }
        //create second accusation
        a2 = prefix + c2;

        //create Accusation objects with the a1/a2 strings and push them into array
        accusations.push(new Accusation(a1));
        accusations.push(new Accusation(a2));
        //create Person object and push into array
        people.push(new Person(p.toString(), a1, a2));

    }
    buildTable();
    // if (!pcinTable) {
    //     console.log("Error pulled card not in table");
    //     console.log(wasPulled + " should have shown up at index " + showsup);
    // }

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
        people.push(new Person(name, acc1, acc2));
    }
}
function buildTable() {
    //build the table
    var accNumber = 0;
    var tpanel = document.getElementById("tpanel");
    var fpanel = document.getElementById("fpanel");
    var form = document.getElementById("form");
    var buttonpanel = document.getElementById("btn");
    var button = document.createElement("button");
    tpanel.innerHTML = "";
    buttonpanel.innerHTML = "";
    var table = document.createElement("table");
    table.id = "table";
    var tbody = document.createElement("tbody");
    tpanel.appendChild(table);
    table.appendChild(tbody);
    var rows = [];

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
    fpanel.removeChild(form);

    if (button.addEventListener) {
        button.addEventListener("click", solve, false);
    } else if (button.attachEvent) {
        button.attachEvent("onclick", solve);
    }
}
function solve() {
    //figure out which card was pulled from the deck
    var buttonpanel = document.getElementById("btn");
    var solvebtn = document.getElementById("solvebtn");
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

            break;//if there are 2 suspects break out of the loop

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
        var opp = getOpposite(a);
        var torl = determineTorL(a);
        console.log("solutions exists for " + a + ": " + solutionExists(a));


        //this code allows me to have a setTimeout inside of a loop
        (function (i, torl) {
            setTimeout(function () {

                if (torl == "Lie") {
                    accusations[i].setLie(i);
                    if (!solutionExists(a)) {
                        solutions.push(new Solution(a, "Lie"));
                        solutions.push(new Solution(opp, "Truth"));
                    }
                } else if (torl == "Truth") {
                    accusations[i].setTruth(i);
                    if (!solutionExists(a)) {
                        solutions.push(new Solution(a, "Truth"));
                        solutions.push(new Solution(opp, "Lie"));
                    }

                } else if (torl == "Not Sure") {
                    accusations[i].setNotSure(i);

                }
            }, cooldown + (1000 * i));
        })(i, torl);
    }
    buttonpanel.removeChild(solvebtn);
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
        console.log("strategy1 failed attempting strategy2");
        //start strategy2
        //strategy2 is to make a guess at which card was pulled
        //based on the number of times a card is referrenced

        var appearances = [];//hold the number of occurences each card gets referrenced
        var rates = [];//hold rates for each card
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
        for (var n = 0; n < rates.length; n++) {
            //find the card that has the topRate and assign it to pulledCard
            if (topRate == rates[n]) {
                pulledCard = deck[n].getName();
            }
        }
        if (suspects.length > 0 && topRate != 50) {
            //make a guess at which card was pulled
            setTimeout(alert("was it the " + pulledCard + "?"), 2000);
        } else {
            setTimeout(alert("not enough info to make a guess"), 2000);
        }
    } else {

        setTimeout(alert(pulledCard + " is the card pulled from the deck"), 2000);
    }
}
function sudoku() {
    //function to do data analysis on the table and modify torl values

    //if we have solutions to problems solve them
    solveProblems();

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
            //console.log(card + " is not the pulled card");
        }
    }
    return "";
}
function solveProblems() {
    //go through the list of problems and solve them
    for (var a = 0; a < accusations.length; a++) {
        var acc = accusations[a].getAcc();
        //if a solution exists set it
        if (solutionExists(acc)) {
            var solution = searchSolutions(acc);
            console.log("The solution to " + acc + ": " +solution);
            if(solution == "Truth"){
                accusations[a].setTruth(a);
            }
            if(solution == "Lie"){
                accustations[a].setLie(a);
            }
        }else{
            unabletosolve.push(acc);
        }
    }
    for(var u = 0; u < unabletosolve.length; u++){
        console.log("unable to solve " + unabletosolve[u])
    }
}


function tableCompleted(i) {
    //function that returns true/false depending on if any NotSure remains
    var breakpoint = 10;
    if (i < breakpoint) {
        for (var a = 0; a < accusations.length; a++) {
            var tl = accusations[a].getTorl();
            if (tl == "Not Sure") {
                return false;
            }
        }

    } else {
        return true;
    }
    return true;
}
//return the prefix of the card
function getPrefix(a) {
    var prefix;
    if (a.includes("it was the")) {
        prefix = "it was the";
    } else if (a.includes("it wasn't the")) {
        prefix = "it wasn't the";
    } else {
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

function fillIn() {
    //function that if one is truth the other is Lie and fills in
    for (var x = 0; x < accusations.length; x++) {
        var torl = accusations[x].getTorl();
        //if even number
        if (x % 2 == 0) {
            if (torl == "Lie") {
                accusations[x + 1].setTruth(x + 1);
                var a = accusations[x + 1].getAcc();
                if (!solutionExists(a)) {
                    solutions.push(new Solution(a, "Truth"));
                }
            } else if (torl == "Truth") {
                accusations[x + 1].setLie(x + 1);
                var a = accusations[x + 1].getAcc();
                if (!solutionExists(a)) {
                    solutions.push(new Solution(a, "Lie"));
                }
            }
            //if odd number
        } else if (x % 2 == 1) {
            if (torl == "Lie") {
                accusations[x - 1].setTruth(x - 1);
                var a = accusations[x - 1].getAcc();
                if (!solutionExists(a)) {
                    solutions.push(new Solution(a, "Truth"));
                }
            } else if (torl == "Truth") {
                accusations[x - 1].setLie(x - 1);
                var a = accusations[x - 1].getAcc();
                if (!solutionExists(a)) {
                    solutions.push(new Solution(a, "Lie"));
                }
            }
        }
    }
}
function getCard(a) {
    //figure out which card the accusation contains and return it
    for (var i = 0; i < deck.length; i++) {
        if (a.includes(deck[i].getName())) {
            return deck[i].getName();
        }
    }
}
function getOpposite(a) {
    //returns the opposite of the string passed as a parameter
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
function createEventListeners() {
    //create events for the buttons to respond to clicks
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
    //builds the deck of cards
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
function validForm() {
    //stop invalid submissions from getting submitted
    var n = document.getElementById("nameinput").value;
    var p1 = document.getElementById("prefix1").value;
    var p2 = document.getElementById("prefix2").value;
    var s1 = document.getElementById("suffix1").value;
    var s2 = document.getElementById("suffix2").value;
    if (n != "" && p1 != "" && p2 != "" && s1 != "" && s2 != "") {
        return true;
    } else {
        console.log("all fields need to be filled out")
        return false;
    }

}

//build the deck of cards and create eventlisteners for the buttons
function setup() {

    buildDeck();
    createEventListeners();
}

//call setup function as soon as page loads
if (window.addEventListener) {
    window.addEventListener("load", setup, false);
} else if (window.attachEvent) {
    window.attachEvent("onload", setup);
}