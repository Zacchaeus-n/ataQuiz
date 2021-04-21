const question = document.querySelector("#container__question__h2");
const choices = Array.from(
  document.querySelectorAll(".container__question__choice__txt")
);

const progressText = document.querySelector("#progressUpdate");
const scoreText = document.getElementById("score");
const progressbar = document.getElementById("progressbar");
const loader = document.getElementById("loader");
const game = document.getElementById("game");
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];

let questions = [];

fetch("https://opentdb.com/api.php?amount=35&category=18&type=multiple")
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestions) => {
    questions = loadedQuestions.results.map((loadedQuestion) => {
      const formattedQuestion = {
        question: loadedQuestion.question,
      };

      const answerChoices = [...loadedQuestion.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestion.correct_answer
      );

      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
      });

      return formattedQuestion;
    });

    startGame();
  })
  .catch((err) => {
    console.error(err);
  });

//CONSTANTS
const MARK = 3;
//CONSTANTS
// const MARK = 3;

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuesions = [...questions];

  //calculating the highestscore
  const totalQuestions = availableQuesions.length;
  const highestScore = totalQuestions * MARK;
  console.log(highestScore);

  //storing the highestscore in local storage
  localStorage.setItem(`highestScore`, highestScore);
  console.log(totalQuestions);

  getNewQuestion();
  game.classList.remove("hidden");
  loader.classList.add("hidden");
};

getNewQuestion = () => {
  //CONSTANT
  const MAX_QUESTIONS = questions.length;
  const TOTAL_QUESTIONS = availableQuesions.length;
  console.log(MAX_QUESTIONS);
  if (availableQuesions.length === 0 || questionCounter > MAX_QUESTIONS) {
    //storing the current mark in local storage
    localStorage.setItem(`currentMark`, score);
    //go to the end page
    return window.location.assign("/html/finish.html");
  }
  questionCounter++;
  progressText.innerText = `${questionCounter}/${MAX_QUESTIONS}`;
  //Update the progress bar
  progressbar.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuesions.length);
  currentQuestion = availableQuesions[questionIndex];
  question.innerHTML = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerHTML = currentQuestion["choice" + number];
  });

  availableQuesions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply === "correct") {
      incrementScore(MARK);
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
};
