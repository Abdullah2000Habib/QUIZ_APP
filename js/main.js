//Select Element
let countSpan = document.querySelector(".quiz-info .count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answer-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

//Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestion() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questoinsObject = JSON.parse(this.responseText);
      let qCount = questoinsObject.length;

      //Creat Bullets + Set Questions
      createBullets(qCount);

      //Add Questions Data

      addQuestionsData(questoinsObject[currentIndex], qCount);

      //Start Countdown
      countdown(5, qCount);
      //Click On Submit

      submitButton.onclick = function () {
        //Git Right Answer

        let theRightAnswer = questoinsObject[currentIndex].right_answer;

        //Increase Current Index
        currentIndex++;

        ///cheak Answer

        checkAnswer(theRightAnswer, qCount);

        //Remove Previous Element

        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        //Add Questions Data

        addQuestionsData(questoinsObject[currentIndex], qCount);

        //Handle Bullets
        handleBullets();

        //Clear Interval
        clearInterval(countdownInterval);
        ///Restart Countdown
        countdown(5, qCount);

        //Show Result

        showResults(qCount);
      };
    }
  };

  myRequest.open("GET", "html_questions.json", true);
  myRequest.send();
}

getQuestion();

function createBullets(num) {
  countSpan.innerHTML = num;

  //Create Spans
  for (let i = 0; i < num; i++) {
    let bulletsSpan = document.createElement("span");

    if (i === 0) {
      bulletsSpan.className = "on";
    }
    bulletsSpanContainer.appendChild(bulletsSpan);
  }
}

function addQuestionsData(obj, count) {
  if (currentIndex < count) {
    //Create H2 Questions Titles

    let questionTitle = document.createElement("h2");

    //Create Question Text

    let questoinText = document.createTextNode(obj["title"]);

    //Append Text To H2

    questionTitle.appendChild(questoinText);

    //Append h2 To Quiz Area

    quizArea.appendChild(questionTitle);

    //Create The Answer

    for (let i = 1; i <= 4; i++) {
      //Create Main The Answer Div

      let mainDiv = document.createElement("div");

      //Add Class To Main Div

      mainDiv.className = "answer";

      //Create Radio input

      let radioInput = document.createElement("input");

      //Add Type + Name + Id + Data-Attribute

      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      //Create The Lable

      let theLabel = document.createElement("label");

      //Add Attribute

      theLabel.htmlFor = `answer_${i}`;

      //Create Label Text

      let theLabelText = document.createTextNode(obj[`answer_${i}`]);

      //Add The Text To Label

      theLabel.appendChild(theLabelText);

      //Add Input + Label To Main Div

      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      //Add mainDiv To answer Area

      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");

  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rAnswer === theChoosenAnswer) {
    rightAnswers++;
  }
}

function handleBullets() {
  let bulletsSpan = document.querySelectorAll(".bullets .spans span");

  let arrayOfSpan = Array.from(bulletsSpan);

  arrayOfSpan.forEach((span, Index) => {
    if (currentIndex === Index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResult;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResult = `<span class ="good">Good</span>,${rightAnswers} From ${count} Is Good`;
    } else if (rightAnswers === count) {
      theResult = `<span class ="perfect">Perfect</span>,All Answer is Good`;
    } else {
      theResult = `<span class="bad">Bad</span>,${rightAnswers} From ${count}`;
    }

    resultsContainer.innerHTML = theResult;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.marginTop = "10px";
    resultsContainer.style.backgroundColor = "white";
  }
}
function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;

    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
