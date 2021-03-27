var choicesList = document.querySelector("#choices-list");  // ul
var questionText = document.querySelector("#question");
var timeLeftText = document.querySelector("#time");
var myBtn = document.querySelector("#my-button");
var correctAnsText = document.querySelector("#correct-ans");
var yourAnsText = document.querySelector("#your-ans");
var scoreText = document.querySelector("#score");
var curQuest = 0;
var stage = 0;
var maxTimeGiven = 15;  // seconds
var countSetInterval = 0;
// stage
//   0     initialize-listener for li, stage = 1
//   1      Ask question, button says next, if last question, 

var score;
var timeLeft;
var waitFlag;
var choiceCount;
var maxChoices = 7;
var score = 0;
var hasBeenClicked = false;

var questions = [
    {
      title: "What is my favorite food?",
      choices: ["pizza", "pasta", "bread", "none of the above", "I don't know"],
      answer: "pasta"
    },
    {
      title: "What is my name?",
      choices: ["ant", "tom", "stacey", "none of the above", "I don't know"],
      answer: "ant"
    },
    {
      title: "Which of the following is not valid for alight-items?",
      choices: ["flex-start", "center", "bottom", "stretch", "flex-end", "none of the above", "I don't know"],
      answer: "bottom"
    },
    {
      title: "Which of the following is not valid for justify-content?",
      choices: ["space-between", "flex-start", "flex-end", "center", "space-around", "none of the above", "I don't know"],
      answer: "none of the above"
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
/*
  var items = choicesList.getElementsByTagName("LI");  // choicesList is the choicesList element
  for (var i = 0; i<maxChoices; i++) {
    items[i].setAttribute("data-index", i);
  }
*/
}    // end of setAtributes

// The following function renders items in a todo list as <li> elements
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

// Handler for click on Button
function btnClick() {
  console.log("In btnClick");
  if (stage == 0) {
    // Stage 1 - Waiting to start
    stage = 1;

    console.log("    choicesList ", choicesList);
    console.log("    questionText ", questionText);
    console.log("    timeLeftText ", timeLeftText);
    console.log("    myBtn ", myBtn);
    console.log("    correctAnsText ", correctAnsText);
    console.log("    yourAnsText ", yourAnsText);
    console.log("    scoreText ", scoreText);

    setAttributes();   // setAttributes of li elements
    changeChoices();

    choicesList.addEventListener("click", myOnClick);   // listen for click on a choice
    timeLeftText.text = maxTimeGiven;
    timeLeft = maxTimeGiven;
    myBtn.textContent = "Next";
    scoreText.textContent = "0/" + questions.length;
    timeLeftText.textContent = maxTimeGiven;
    // These appear below question and choices
    correctAnsText.textContent = "";
    yourAnsText.textContent = "";
    countSetInterval++;
    hasBeenClicked = false;
    x = setInterval(myOnTimer, 1000);
    console.log("btnClick stage 1, x", x);
  }
  else {
    // Stage 2 - Asking questions
    console.log("btnClick in Stage 2");
    curQuest++;
    if (curQuest < questions.length)
    {
      console.log("btnClick curQuest, questions.length", curQuest, questions.length);

      changeChoices();
      timeLeftText.text = maxTimeGiven;
      timeLeft = maxTimeGiven;
      myBtn.textContent = "Next";
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

function incScore() {
  score++;
  scoreText.textContent = "Correct answers: " + score;
}

// This is handler for clicking one of the choices
function myOnClick(e) {
  var target = e.target; // Clicked element
  while (target && target.parentNode !== choicesList) {
    target = target.parentNode; // If the clicked element isn't a direct child
    if(!target) { return; } // If element doesn't exist
  }
  if (hasBeenClicked) {return;}
  console.log("target.tagName: ", target.tagName);
  if (target.tagName === "LI") {
    var index = target.getAttribute("data-index");
    console.log("myOnClick, index", index);
    console.log("myOnClick, choiceCount", choiceCount);
    console.log("myOnClick, choice", questions[curQuest].choices[index]);
    hasBeenClicked = true;
    clearInterval(x);  // stop timer
    //var msg;
    if (questions[curQuest].choices[index] == "") {
      // will only be here if user clicked a blank choice. Don't allow that
      yourAnsText.textContent = "You clicked on a blank choice";
      correctAnsText.textContent = "The correct answer is " + questions[curQuest].answer + ". Better luck next time!";
    }
    else if (index == choiceCount-1) {
      yourAnsText.textContent = "You clicked 'I don't know'";
      correctAnsText.textContent = "The correct answer is " + questions[curQuest].answer + ". Better luck next time!";
    }
    else if (questions[curQuest].choices[index] == questions[curQuest].answer) {
      console.log("correct answer!");
      yourAnsText.textContent = "You are right! Your answer is " + questions[curQuest].choices[index] + ". Good going!";
      correctAnsText.textContent = "The correct answer is " + questions[curQuest].answer;
      incScore();
    }
    else {
      yourAnsText.textContent = "Sorry, wrong answer! Your answer is " + questions[curQuest].choices[index];
      correctAnsText.textContent = "The correct answer is " + questions[curQuest].answer + ". Better luck next time!";
    }
    myBtn.textContent = "Next";
  }   // end of myOnClick
 
}   // end of function myOnClick for addeventlistener for choicesList
