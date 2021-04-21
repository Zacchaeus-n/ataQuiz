const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("btnSaveMark");
const finalScore = document.getElementById("totalMark");
const mostRecentScore = localStorage.getItem("mostRecentScore");

const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
//local storage variable for the highest score
const highestScore = localStorage.getItem(`highestScore`);

const MAX_HIGH_SCORES = 5;
const MIN_HIGH_SCORE = highestScore * 0.6;
//get current mark from local storage
const currentMark = localStorage.getItem("currentMark");
//update total score on page
finalScore.innerText = `${currentMark} out of ${highestScore}`;

// finalScore.innerText = mostRecentScore;

username.addEventListener("keyup", () => {
  saveScoreBtn.disabled = !username.value;
});

saveHighScore = (e) => {
  e.preventDefault();

  const score = {
    score: mostRecentScore,
    name: username.value,
  };

  if (score.score >= MIN_HIGH_SCORE) {
    highScores.push(score);
    highScores.sort((itemOne, itemTwo) => itemOne.score - itemTwo.score);
  }
  //   highScores.push(score);
  //   highScores.sort((a, b) => b.score - a.score);
  //   highScores.splice(5);

  localStorage.setItem("highScores", JSON.stringify(highScores));
  window.location.assign("/html/finish.html");
};
