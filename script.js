//Random Quotes Api
const quoteApiUrl =
  "https://api.quotable.io/random?minLength=150&maxLength=250";

const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");

// console.log(quoteSection, userInput);

let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;

const defaultQuote =
  "Life's artistry unfolds in fleeting moments. Each day, paint with purpose, embrace joy, and navigate challenges with resilience. Connect with others, for in shared stories, we find meaning. Your canvas is unique; let it reflect courage, love, and the beauty crafted by the strokes of your passion.";

// Display random quotes
const renderNewQuote = async () => {
  try {
    // Fetch contents from url
    const response = await fetch(quoteApiUrl);

    // Check if the response is successful
    if (!response.ok) {
      // If not successful, set the default quote
      quote = defaultQuote;
    } else {
      // If successful, store the response data
      let data = await response.json();
      quote = data.content;
    }

    // Array of characters in the quote
    let arr = quote.split("").map((value) => {
      // Wrap the characters in a span tag
      return "<span class='quote-chars'>" + value + "</span>";
    });

    // Join array for displaying
    quoteSection.innerHTML = arr.join("");
  } catch (error) {
    console.error("Error fetching quote:", error);
    quote = defaultQuote;
    let arr = quote.split("").map((value) => {
      return "<span class='quote-chars'>" + value + "</span>";
    });
    quoteSection.innerHTML = arr.join("");
  }
};

//Logic for comparing input word with quote
userInput.addEventListener("input", () => {
  let quoteChars = document.querySelectorAll(".quote-chars");
  quoteChars = Array.from(quoteChars);
  let userInputChars = userInput.value.split("");

  quoteChars.forEach((char, index) => {
    if (char.innerText === userInputChars[index]) {
      char.classList.add("success");
      char.classList.remove("fail"); // Remove fail class if it was added before
    } else if (!userInputChars[index]) {
      char.classList.remove("success");
      char.classList.remove("fail");
    } else {
      if (!char.classList.contains("fail")) {
        mistakes += 1;
        char.classList.add("fail");
      }
      char.classList.remove("success");
      document.getElementById("mistakes").innerText = mistakes;
    }

    let check = quoteChars.every((element) =>
      element.classList.contains("success")
    );
    if (check) {
      displayResult();
    }
  });
});

//Update Timer on screen
function updateTimer() {
  if (time == 0) {
    // End test if time reaches 0
    displayResult();
  } else {
    document.getElementById("timer").innerText = --time + "s";
  }
}

//Sets timer
const timeReduce = () => {
  time = 60;
  timer = setInterval(updateTimer, 1000);
};

// End Test
const displayResult = () => {
  // display result div
  document.querySelector(".result").style.display = "block";
  clearInterval(timer);
  document.getElementById("stop-test").style.display = "none";
  userInput.disable = true;
  let timeTaken = 1;
  if (time != 0) {
    timeTaken = (60 - time) / 100;
  }

  document.getElementById("wpm").innerText =
    (userInput.value.length / 5 / timeTaken).toFixed(2) + " wpm";

  document.getElementById("accuracy").innerText =
    Math.round(
      ((userInput.value.length - mistakes) / userInput.value.length) * 100
    ) + " %";
};

// Start test button implementation
const startTest = () => {
  mistakes = 0;
  timer = "";
  userInput.disabled = false;
  timeReduce();
  document.getElementById("start-test").style.display = "none";
  document.getElementById("stop-test").style.display = "block";
};

window.onload = () => {
  userInput.value = "";
  document.getElementById("start-test").style.display = "block";
  document.getElementById("stop-test").style.display = "none";
  userInput.disabled = true;
  renderNewQuote();
};
