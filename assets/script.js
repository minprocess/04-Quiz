var choicesList = document.querySelector("#choices-list");
var questionText = document.querySelector("#question");

var questions = [
    {
      title: "What is my favorite food?",
      choices: ['pizza', 'pasta', 'bread'],
      answer: 'pasta'
    },
    {
      title: "What is my name?",
      choices: ['ant', 'tom', 'stacey'],
      answer: 'ant'
    }
  ];

// The following function renders items in a todo list as <li> elements
function renderChoices() {
    console.log("In renderChoices");

    // Clear todoList element and update todoCountSpan
    questionText.innerHTML = questions[0].title;
    console.log("questions[0].title: ", questions[0].title);

    choicesList.innerHTML = "";
    var choiceCount = questions[0].choices[0].length;
    console.log("questions[0].choices.length: ", questions[0].choices.length);

    // Render a new li for each choice
    for (var i = 0; i < choiceCount; i++) {
      var li = document.createElement("li");
      li.textContent = questions[0].choices[i];
      li.setAttribute("data-index", i);
      choicesList.appendChild(li);
    }
  }

function init() {
    // Get stored todos from localStorage
    var storedTodos = JSON.parse(localStorage.getItem("todos"));
    
    // If todos were retrieved from localStorage, update the todos array to it
    if (storedTodos !== null) {
      todos = storedTodos;
    }
    console.log("todos.length in init: ", todos.length);
  
    // This is a helper function that will render todos to the DOM
    renderTodos();
  }

  renderChoices();
  //init()
