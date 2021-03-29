var choicesList = document.querySelector("#choices-list");  // ul
var questionText = document.querySelector("#question");
var timeLeftText = document.querySelector("#time");
var nextBtn = document.querySelector("#next-button");
var correctAnsText = document.querySelector("#correct-ans");
var yourAnsText = document.querySelector("#your-ans");
var scoreText = document.querySelector("#score");
var numCorrAnsSoFarText = document.querySelector("#numCorrectAnsSoFar");
var hofQuestionText = document.querySelector("#hofQuestion");
var recScoreBtn = document.querySelector("#record-score");
var curQuest = 0;
var stage = 0;
var maxTimeGiven = 15;  // seconds
var countSetInterval = 0;
// stage
//   0     initialize-listener for li, stage = 1
//   1      Ask question, button says next, if last question, 

var numCorrAnsSoFar;
var score;
var timeLeft;
var waitFlag;
var choiceCount;
var maxChoices = 7;
var score = 0;
var hasBeenClicked = false;
var hofInitials;
var hofScores;
var hofCorrAns;
var hofStored;   // initials, score, correct answers; equivalent to hofInitials, hofScores, hofCorrAns

var questions = [
    {
      title: "Which of the following is not valid for alight-items?",
      choices: ["flex-start", "center", "bottom", "stretch", "flex-end", "none of the above", "I don't know"],
      answer: "bottom"
    },
    {
      title: "Which of the following is not valid for justify-content?",
      choices: ["space-between", "flex-start", "flex-end", "center", "space-around", "none of the above", "I don't know"],
      answer: "none of the above"
    },
    {
      title: "What is the best food while coding Javascript?",
      choices: ["pizza", "pasta", "bread", "none of the above", "I don't know"],
      answer: "pasta"
    },
    {
      title: "What is the name of your Javascript instructor?",
      choices: ["Ant", "Michael", "Stacey", "none of the above", "I don't know"],
      answer: "Ant"
    }
  ];

function setAttributes() {
  // Create six choices that user can choose from
  for (var i = 0; i < maxChoices; i++) {
    var li = document.createElement("li");
    li.textContent = "";
    li.setAttribute("data-index", i);

    choicesList.appendChild(li);
  }
}    // end of setAtributes

// The following function renders items in a choices list as <li> elements
function changeChoices() {
  // Set new question text
  questionText.innerHTML = questions[curQuest].title;
  // Set new choices text
  choiceCount = questions[curQuest].choices.length;
  var items = choicesList.getElementsByTagName("li");
  // Clear list of question choices
  for (var i=0; i < items.length; i++) {
    items[i].textContent = "";
    console.log("");
  }
  for (var i = 0; i < choiceCount; i++) {
      items[i].textContent = questions[curQuest].choices[i];
  }
  items[choiceCount] = "I don't know";
}

// Handler for click on Next Button
function btnClickNext() {
  if (stage == 0) {
    // Stage 1 - Waiting to start
    stage = 1;

    setAttributes();   // setAttributes of li elements
    changeChoices();

    choicesList.addEventListener("click", onClickChoice);   // listen for click on a choice
    timeLeftText.text = maxTimeGiven;
    timeLeft = maxTimeGiven;
    nextBtn.textContent = "Next";
    scoreText.textContent = "0";
    timeLeftText.textContent = maxTimeGiven;
    // These appear below question and choices
    correctAnsText.textContent = "";
    yourAnsText.textContent = "";
    countSetInterval++;
    hasBeenClicked = false;
    recScoreBtn = true;
    numCorrAnsSoFar = 0;
    x = setInterval(myOnTimer, 1000);
    //console.log("btnClick stage 1, x", x);
  }
  else {
    // Stage 2 - Asking questions
    curQuest++;
    if (curQuest < questions.length)
    {
      changeChoices();
      timeLeftText.text = maxTimeGiven;
      timeLeft = maxTimeGiven;
      nextBtn.textContent = "Next";
      yourAnsText.textContent = "Your answer: ";
      correctAnsText.textContent = "The correct answer: ";
      countSetInterval++;
      hasBeenClicked = false;
      x = setInterval(myOnTimer, 1000);  
    }
    else {
      questionText.textContent = "Thanks for playing!";
    }
  }
}

function myOnTimer() {
  timeLeft--;
  timeLeftText.textContent = timeLeft;
  if (timeLeft <= 0) {
    countSetInterval--;
    clearInterval(x);
    yourAnsText.textContent = "Time out! No answer was selected. Better luck next time! ";
    correctAnsText.textContent = "The correct answer: " + questions[curQuest].answer;
  }
}

function UpdateDashboard() {
  numCorrAnsSoFarText.textContent = numCorrAnsSoFar + "/" + (curQuest+1);
  scoreText.textContent = score;
}

// This is handler for clicking one of the choices
function onClickChoice(e) {
  var target = e.target; // Clicked element
  while (target && target.parentNode !== choicesList) {
    target = target.parentNode; // If the clicked element isn't a direct child
    if(!target) { return; } // If element doesn't exist
  }
  if (hasBeenClicked) {return;}

  if (target.tagName === "LI") {
    var index = target.getAttribute("data-index");
    hasBeenClicked = true;
    clearInterval(x);  // stop timer
    if (questions[curQuest].choices[index] == "") {
      // will only be here if user clicked a blank choice. Don't allow that
      yourAnsText.textContent = "You clicked on a blank choice";
      correctAnsText.textContent = "The correct answer is " + questions[curQuest].answer + ". Better luck next time!";
      score += 0;   // User does not receive any points
    }
    else if (index == choiceCount-1) {
      yourAnsText.textContent = "You clicked 'I don't know'";
      correctAnsText.textContent = "The correct answer is " + questions[curQuest].answer + ". Better luck next time!";
      score += 0;   // User does not receive any points
    }
    else if (questions[curQuest].choices[index] == questions[curQuest].answer) {
      yourAnsText.textContent = "Your answer is " + questions[curQuest].choices[index] + ", which is correct! Good going!";
      correctAnsText.textContent = "";   // No need to show correct answer when the user got it right
      score += timeLeft;
      numCorrAnsSoFar += 1;
    }
    else {
      yourAnsText.textContent = "Sorry, wrong answer! Your answer is " + questions[curQuest].choices[index];
      correctAnsText.textContent = "The correct answer is " + questions[curQuest].answer + ". Better luck next time!";
    }
    UpdateDashboard();

    if (curQuest == questions.length-1) {
      /************* All questions have been asked! *************/
      //nextBtn.disabled = true;
      nextBtn.textContent = "Take the quiz again";
      recScoreBtn.disabled = false;
      curQuest = 0;
      hofStored = JSON.parse(localStorage.getItem("hofStored") || "[]");
      if (hofStored.length > 0) {
        console.log("hofstored[0].initials", hofStored[0].initials);
      }

      var tableTitle = document.querySelector("#hof-title");
      tableTitle.textContent = "Last 10 Scores Newest to Oldest";
      fillHOFTable2();

    }
    else {
      nextBtn.textContent = "Next";
    }
  }   // end of if (target.tagname ...
}   // End of onClickChoice

function btnClickInitials2() {
  let initialsText = document.getElementById("initials").value;
  if (initialsText == "" ) {
    initialsText == "  a"; 
  }
  // Most recent is at beginning of array
  hofStored.unshift({initials: initialsText, score: score, corrans:numCorrAnsSoFar});
  console.log("hofstored[0]", hofStored[0]);
  localStorage.setItem("hofStored", JSON.stringify(hofStored));
  var tbl = document.querySelector("#hofTable");
  tbl.innerHTML = "";
  fillHOFTable2();
 }

// HOF = Hall of Fame
function fillHOFTable2() {
  var tbl = document.querySelector("#hofTable");
  var tblBody = document.createElement("tbody");

  // Heading row
  var row = document.createElement("tr");
  var msg3 = ["Initials", "Score", "Correct answers"];

  for (var j = 0; j < 3; j++) {
    // Create a <td> element and a text node, make the text
    // node the contents of the <td>, and put the <td> at
    // the end of the table row
    var cell = document.createElement("td");
    var cellText = document.createTextNode(msg3[j]);
    cell.appendChild(cellText);
    row.appendChild(cell);
  }

  // add the row to the end of the table body
  tblBody.appendChild(row);


  // creating all cells
  for (var i = 0; i < Math.min(10, hofStored.length); i++) {
    // creates a table row
    var row = document.createElement("tr");

    var msg2 = [hofStored[i].initials, hofStored[i].score, hofStored[i].corrans];

    for (var j = 0; j < 3; j++) {
      // Create a <td> element and a text node, make the text
      // node the contents of the <td>, and put the <td> at
      // the end of the table row
      var cell = document.createElement("td");
      var cellText = document.createTextNode(msg2[j]);
      cell.appendChild(cellText);
      row.appendChild(cell);
    }

    // add the row to the end of the table body
    tblBody.appendChild(row);
  }

  // put the <tbody> in the <table>
  tbl.appendChild(tblBody);
  console.log("tbl end", tbl);

  // appends <table> into <body>
  body.appendChild(tbl);
}
