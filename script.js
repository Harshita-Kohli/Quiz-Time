// to update questions dynamically and pull them form an array, we need to write JavaScript
// console.log("Hello World from game!")
const question = document.getElementById("ques");//we select the element that has id = "ques" 
// const choices = document.getElementsByClassName("choice-text"); //this returns a node list of choices, 
        // but we want to convert it into array so that we can apply array functions on it, so we use Array.from()
// console.log(choices);
const choices = Array.from(document.getElementsByClassName("choice-text"));
// console.log(choices);

// const questionCountText = document.getElementById("quesCount");//we want to take the question Counter element from DOM so as to update it dynamically using JavaScript
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");//we also select the element with id = score so as to dynamically modify the score using Javascript
const progressBarFull = document.getElementById("progress-bar-full");//taking the progress-bar-full from the DOM

const loader = document.getElementById("loader"); //reference to loader
const game = document.getElementById("game");//reference to game div

let currentQuestion = {}; //it is gonna be an object representing the current question. 
let acceptingAnswers = false; //this is to create a delay after someone answers a question before he answers again. Initially, we set it to false, so that the user cannot answer the question before the question is loaded or the game is started
let questionCount = 0;//represents the count of the question we are on..index of question
let score = 0;
let availableQuestions = [];//we will take questions from questions array and put them into availableQuestions

//here are our 3 hard-coded questions. Each question is gonna be an object, which has a ->question
                                                                                    //  ->4 choices
                                                                                    //  ->the correct answer
// let questions = [
//     {
//         question: 'Inside which HTML element do we put the JavaScript??',
//         choice1: '<script>',
//         choice2: '<javascript>',
//         choice3: '<js>',
//         choice4: '<scripting>',
//         answer: 1, //answer:1 means the first option is the correct option
//     },
//     {
//         question:
//             "What is the correct syntax for referring to an external script called 'xxx.js'?",
//         choice1: "<script href='xxx.js'>",
//         choice2: "<script name='xxx.js'>",
//         choice3: "<script src='xxx.js'>",
//         choice4: "<script file='xxx.js'>",
//         answer: 3,
//     },
//     {
//         question: " How do you write 'Hello World' in an alert box?",
//         choice1: "msgBox('Hello World');",
//         choice2: "alertBox('Hello World');",
//         choice3: "msg('Hello World');",
//         choice4: "alert('Hello World');",
//         answer: 4,
//     },
// ];
// ------------------------To FETCH Questions from local JSON File---------------------------------------------
let questions = [];//start with empty questions array
// we will fetch the questions from the json file using fetch
// fetch("questions.json") //this returns a promise
//     .then(res =>
//     {
//         // console.log(res); //this response will be like an http response. We want a json file out of this response
//         return res.json(); //res.json() will get hte body out of the response and will convert it into json
//     }).then(loadedQuestions =>{
//         // console.log(loadedQuestions);
//         questions = loadedQuestions;
//         // we don't want to start the game immediately, so we call startGame() when the the questions are loaded
//         startGame();
//     })
//     .catch(err =>{
//         console.log(err);
//     });

//------------------To fetch questions from the Open Trivia Database using API.But the questions have a different format than we accept. Because we need 4 choices and a correct answer. but there format is corect answer and an incorrect answer.
fetch("https://opentdb.com/api.php?amount=30&category=17&difficulty=easy&type=multiple")
.then(res =>
        {
            // console.log(res); //this response will be like an http response. We want a json file out of this response
            return res.json(); //res.json() will get the body out of the response and will convert it into json
        }).then(loadedQuestions =>{
            // console.log(loadedQuestions); //but these questions need to be converted to the correct format that our game accepts. So we will iterate over the loadedQuestions array and convert each item into something new by using map()
            // We will get the original loadedQuestion from the loadedQuestions[] as parameter and we will format that question into the correct format and return it to the question array that we want to populate with the correct format questions
            questions = loadedQuestions.results.map(loadedQuestion =>{
                const formattedQuestion = {
                    question: loadedQuestion.question,
                };
                const answerchoices = [...loadedQuestion.incorrect_answers];//we use spread operation to copy each incorrect answer into answerchoices array
                formattedQuestion.answer = Math.floor(Math.random() * 3) + 1; //we find any random position of the correct answer choice to be placed inside the formattedQuestion
                answerchoices.splice(formattedQuestion.answer-1,0,loadedQuestion.correct_answer);//we add the correct answer inside the answerchoices at the index = formattedQuestion.answerPosition - 1
                // console.log(answerchoices);

                //To have  "Choice 1: first choice" 
                        // "Choice 2: second choice"
                        // and so on   inside the formattedQuestion, we will iterate over the answerChoices array:
                answerchoices.forEach((choice,index) =>{ //take choice and the index at which it is present in the answerchoices, and do a forEach
                    formattedQuestion["choice"+(index+1)] = choice;
                });
                return formattedQuestion;
            });
            // questions = loadedQuestions;
            // we don't want to start the game immediately, so we call startGame() when the the questions are loaded
           
            startGame();
        })
// CONSTANTS used in the game:
const bonusPoints = 10;
const maxQuestions = 10;//for now our maximum no of questions are 10

// START GAME function will have all the logic for starting the game
startGame = () => { //here startGame is the function name, () denotes no parameters and we use arrow function
 questionCount = 0; //make sure we start the game with question count as 0
 score = 0;
 availableQuestions = [...questions];//we use spread operator to make a full copy of each question from questions[] array into availableQuestions[]
//  console.log(availableQuestions);//this prints the array of available 3 questions
 getNewQuestion(); //the next thing we need to do in startGame() is to call getNewQuestion() function
//  when we are sure that we have a question to be displayed and we are gonna call the start game, we must hide the loader and display the game
 game.classList.remove('hidden'); //we will remove the hidden class from game so as to make it visible
 loader.classList.add('hidden');
};

getNewQuestion = () =>{ //this function is called for generating new questions once the game starts

    //we will get new question only if there are some questions available in the availableQuestions[]. If the no of questions available = 0, we don't
    if(availableQuestions.length===0 || questionCount>=maxQuestions) //EG: if we wanted the user to answer only 10 questions(maximumQuestions = 10) out of total 100 questions(avaailableQuestions = 100), then if the questionCount> 10, we want to redirect user to the end page
    {
        //save the highest score in the local storage. We give key as mostRecentScore and value as score
        localStorage.setItem('mostRecentScore',score);
        //go to the end page 
        return window.location.assign('./end.html');
    } 
    questionCount++;//first thing that we'll do is to increment the question count
    // questionCountText.innerText = questionCount +'/'+ maxQuestions;//we also wanna update the count in the DOM as : 1/3 or 2/3 etc
    progressText.innerText = `Question: ${questionCount}/ ${maxQuestions}`;//we also wanna update the progress text ie the count in the DOM as : 1/3 or 2/3 etc
    // console.log(progressText);
    // console.log(Math.random()*3); //this will return a random float number between 0 and 3
    // Math.floor(Math.random()*3); this will return an integer between 0 and 3. Here we have hard coded the no of available questions as 3. But in reality, the available no of ques will keep changing because everytime a unique question will arise and we won't repeat a question 
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);//as the no of available questions are gonna change, we want to generate a random no. between 0 and the Number of available questions
    currentQuestion = availableQuestions[questionIndex];//we get the question with questionIndex from the availableQuestions[] into the currentQuestion

    
    //$$$ now we wanna dynamically change the HTML by adding the question in our DOM:
    question.innerText = currentQuestion.question; //we use the "question" property of the "currentQuestion" object
    // console.log(currentQuestion);

    //$$$ now along with each question, we also want all the 4 choices to be changed acc to the question asked
    choices.forEach( choice => {  //we have choice as a parameter in this arrow function. choice denotes each choice text from the choices[] array
        // console.log(choice.dataset['number']);
        const number = choice.dataset['number'];//we can get the data attribute "number" associated with each choice
        choice.innerText = currentQuestion['choice'+number]; //out of the current question, we wanna get the choice corresponding to the data-number. eg: if number = 1, we get the choice1 displayed in DOM and same for all other data-numbers
    });

    //once we have the question and the choices loaded, we wanna allow the user to answer by setting "acceptingAnswers" to true
    acceptingAnswers = true;

    //we need to take the availableQuestions array and splice out the question that we just used, so that it cannot be again included while generating a new question 
    availableQuestions.splice(questionIndex,1);//we remove the question at the "questionIndex" location in the availableQuestions[]. 1 means we wanna remove only one question.
};

// now we want to add event listener on the choices so that when the user clicks on a particular choice, 
choices.forEach(choice => {
    choice.addEventListener("click", e =>{ //the event is 'click' and parameter is event
        // console.log(e.target); //e.target gives the choice-text corresponding to the choice clicked by the user

        //UPDATING THE PROGRESS BAR, when the user clicks a choice and submits it, we update the progress bar
        // console.log((questionCount/maxQuestions)*100); //this is the percentage of width of progress bar
         progressBarFull.style.width = `${(questionCount/maxQuestions * 100)}%`; //we apply css dynamically using JS by using style.width

        //if we are not ready to accept answers, we are gonna ignore the fact that the user clicked any option
        if(!acceptingAnswers)
        {
            return; //simpy return i.e. do nothing
        }

        acceptingAnswers = false; //we set it to false because we want a bit of delay here, we don't want the user to click the answers repeatedly. Once the user has clicked a choice, we stop for sometime before allowing the user to click again
        const selectedAnswer = e.target; //e.target gives the choice-text corresponding to the choice clicked by the user
        const selectedChoice = choice.dataset['number'];//this gives the choice number of the choice clicked
        
        
        //after the user has made a choice, we wanna see if the choice is correct or not. So we use == to make a comparison between selectedChoice and currentQuestion. 
        // According to whether the ques is correct or incorrect, we will apply correct or incorrect class on the selected answer. This is for adding animation like red for wrong and green for correct
        //********** IMP: Note the DIFFERENCE BETWEEN == and ===   ************************************
        let classToApply = "incorrect";//let by default, the class to apply be incorrect
        if(selectedChoice == currentQuestion.answer) //this will return true or false
        {
            classToApply = "correct"; //if choice is correct, we set classToApply as "correct"
            score+=bonusPoints;
            scoreText.innerText = score;

        }
        //otherwise, classToApply remains incorrect
        else
        {
            classToApply = "incorrect";
        }
        //now we must apply the class to the selected choice 
        selectedAnswer.parentElement.classList.add(classToApply); //we apply classToApply on the entire choice container in DOM by selecting the parent 


        // now some color: either red or green will be applied on the choice container that the user selected. But we also want to remove that color after some time.
        // But if we apply and remove the classToApply back to back, it seems that nothing happened and no color comes up on the selected choice.
        // so we use setTimeout() to have some time difference between adding and removing the class 

        setTimeout(() => { //setTimeout takes a callback function
            selectedAnswer.parentElement.classList.remove(classToApply);
            getNewQuestion(); //Also, now that the user has clicked a choice from the 4 choices, we want to load a new question by calling getNewQuestion()
        }, 2000); //these 2 things happen 1 sec after the classToApply is added to the choice container
        
        
    });

});
