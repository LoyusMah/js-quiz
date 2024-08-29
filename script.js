const QUIZ_TIME = 50;
const QUIZ_QUESTION_POINTS = 1;
const PASS_PERCENT = 50;

// Global variables
let setIntervalId;
let quiz = [];
let timer = 0;
let timerAudio = document.getElementById("timerAudio");
let cheerAudio = document.getElementById("cheerAudio");
let booAudio = document.getElementById("booAudio");

async function fetchQuizQuestion() {
  const response = await fetch("quiz.json");
  const data = await response.json();
  quiz = data.quiz;
  console.log(quiz);
  showModule("start-module");
}
fetchQuizQuestion();

function showModule(moduleName) {
  const moduleList = document.querySelectorAll(".module");
  for (let modu of moduleList) {
    if (modu.id === moduleName) {
      modu.style.display = "block";
    } else {
      modu.style.display = "none";
    }
  }
}

const startQuiz = () => {
  showModule("quiz-module");
  const questionUl = document.getElementById("quizlist");
  questionUl.innerHTML = "";

  // Clear any existing timer before starting a new one
  clearInterval(setIntervalId);

  // Initialize the timer outside of the loop
  timer = QUIZ_TIME;
  setIntervalId = setInterval(checkTimer, 1000);

  for (let quizIndex in quiz) {
    const questionList = document.createElement("li");
    questionList.classList.add("quiz-question");

    const questionSpan = document.createElement("span");
    questionSpan.innerText = quiz[quizIndex].question;

    const optionsUl = document.createElement("ul");
    optionsUl.classList.add("quiz-answer");

    for (let optionIndex in quiz[quizIndex].options) {
      const optionList = document.createElement("li");
      const inputElement = document.createElement("input");
      const inputLabel = document.createElement("label");

      inputElement.id = `q-${quizIndex}-a-${optionIndex}`;
      inputElement.type = "radio";
      inputElement.name = `question-${quizIndex}`;
      inputLabel.setAttribute("for", `q-${quizIndex}-a-${optionIndex}`);
      inputLabel.innerText = quiz[quizIndex].options[optionIndex];

      optionList.append(inputElement);
      optionList.append(inputLabel);
      optionsUl.append(optionList);
    }

    questionList.append(questionSpan);
    questionList.append(optionsUl);
    questionUl.append(questionList);
    console.log(questionList);
  }
};

const checkTimer = () => {
  let timerElement = document.getElementById("timer");
  timerElement.innerText = timer;
  timer -= 1; // Decrement the timer by 1
  console.log("timer:", timer);
  timerAudio.play();

  if (timer < 0) {
    stopQuiz();
  }
};

const stopQuiz = () => {
  clearInterval(setIntervalId); // Correctly clear the interval
  console.log("stop Quiz");
  showModule("score-module");
  calculateResult();
};

const calculateResult = () => {
  const selectOptionList = document.querySelectorAll(
    'input[type="radio"]:checked'
  );
  let score = 0;
  let result = "failed";
  for (item of selectOptionList) {
    questionNo = item.id.split("-")[1];
    answerSelected = item.id.split("-")[3];
    let questionItem = quiz[questionNo];

    if (questionItem.answer === questionItem.options[answerSelected]) {
      score = score + QUIZ_QUESTION_POINTS;
    }
  }
  const resultPercent = (score / (QUIZ_QUESTION_POINTS * quiz.length)) * 100;
  if (resultPercent >= PASS_PERCENT) {
    result = "PASSED";
    cheerAudio.play();
  } else {
    booAudio.play();
  }
  const scoreElm = document.getElementById("score");
  scoreElm.innerHTML = score;

  const resultElm = document.getElementById("result");
  resultElm.innerHTML = result;
};

const resetQuiz = () => {
  const timerElement = document.getElementById("timer");
  timerElement.innerText = "--";
  showModule("start-module");
};
