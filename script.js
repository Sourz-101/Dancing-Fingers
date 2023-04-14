//Random Quotes Api
const quoteApiUrl = "https://api.quotable.io/random?minLength=250&maxLength=350"

const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");

// console.log(quoteSection, userInput);

let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;


// Display random quotes 
const renderNewQuote = async () => {

    //fetch content from URL
    const response = await fetch(quoteApiUrl);

    //store  response
    let data = await response.json();

    // access quote
    quote = data.content;

    //Array of character into quote
    let arr = quote.split("").map((value) => {
        //wrapping the character into a span tag
        return "<span class='quote-chars'>" + value + "</span>";
    });

    // join array for displaying
    quoteSection.innerHTML += arr.join("");
    // console.log(arr);
}


//Logic for comparing input word with quote
userInput.addEventListener("input", () => {
    let quoteChars = document.querySelectorAll(".quote-chars");

    //create an array from recieved span tag
    quoteChars = Array.from(quoteChars);

    // console.log(quoteChars);

    // Create an array from user input
    let userInputChars = userInput.value.split("");

    // Loop threw each character in the loop
    quoteChars.forEach((char, index) =>{
        // check if char(quote character) = userInputChars[index](input character
        if(char.innerText == userInputChars[index]){
            char.classList.add("success");
        }

        //If user hasen't entered anything or backspace
        else if(userInputChars[index] == null){
            //remove class if any added
            if(char.classList.contains("success")){
                char.classList.remove("success");
            }
            else{
                char.classList.remove("fail");
            }
        }

        // If user enters wrong character
        else {
            // check if we already added failed class
            if(!char.classList.contains("fail")){
                // increment and display mistakes
                mistakes += 1;
                char.classList.add("fail");
            }
            document.getElementById("mistakes").innerText = mistakes;
        }
        // Return true if all input entered is correct
        let check = quoteChars.every(element => {
            return element.classList.contains("success");
        });
        // End test if all charactes are correct
        if(check){
            // console.log("OK");
            displayResult();
        }

    });

});


//Update Timer on screen
function updateTimer(){
    if(time == 0){
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
    document.getElementById("stop-test").style.display="none";
    userInput.disable = true;
    let timeTaken = 1;
    if(time != 0){
        timeTaken = (60 - time)/100;
    }

    document.getElementById("wpm").innerText = (userInput.value.length / 5 / timeTaken).toFixed(2) + " wpm";

    document.getElementById("accuracy").innerText =
    Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100) + " %";
}


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