const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");
const mostRecentScore = localStorage.getItem("mostRecentScore");
// console.log(mostRecentScore);

//local storage works on key-value pairs with the value being a string. If we wanna work with arrays in value, we need to stringify
// localStorage.setItem('highScore',JSON.stringify([]));
//we wanna get the array of high scores from local storage
const highScores = JSON.parse(localStorage.getItem("highScores")) || []; 
console.log(highScores);//When no-one has played as yet,there will be no high score in the local storage, we get NULL in console. So to avoid that null, we return an empty array []

const Max_High_ScoreNums = 5;//we can maximum 5 high scores in the highscore array
finalScore.innerText = `Your Score: ${mostRecentScore}`;
console.log(mostRecentScore);
// finalScore.innerText = `Your Score : ${mostRecentScore}`;
// we want to add an event listener to username, so that when the user enters some name into username field, only then the save button gets disabled
username.addEventListener("keyup",()=>{

    // console.log(username.value);
    saveScoreBtn.disabled = !username.value;
});
// forms by default save the response to another page as query parameters : http://127.0.0.1:5500/end.html?username=
//we wanna save the high scores in the local storage in the sorted form. We wanna make sure that we save top 5 players in the local storage and splice or remove any extra players who have less score
saveHighScore = e =>{
//  console.log("clicked submit button");
 e.preventDefault(); //this prevents to take us to form action which take us to a different page.
    //   The "action" attribute specifies where to send the form-data when a form is submitted.
    //so now we can click the save button as many times as we want, without going to another page 
    // localStorage.getItem()

    // score is an object having the score and name of the player
    const score = {
        score:  mostRecentScore, //Math.random()*100, just to check if sorting works   
        name: username.value,
    };

    // console.log(score); //this will print an object having score and name of the player
    

    // --------------NOTE: We wanna 
    // 1.put the scores into highscores
    // 2.Sorted the highScores[] according to descending order of scores 
    // 3.Put only the top 5 players in the highScores array--------------------
    highScores.push(score);//1. we push the object into the highscores array. So whenever a score object is saved, it will be pushed into highScores array 
    // console.log(highScores);
    //2. we use inbuilt function sort() that is an array function
    highScores.sort((a,b) =>{
     return b.score - a.score; //this will put the player b before a if b's score is greater than a's score
    });
    // highScores.sort((a,b) => b.score - a.score); //so this line will simply sort the highScores array 

    //3. to have only 5 high scores in the highScores[], we use splice() inbuilt function:
    highScores.splice(5);//At index 5 start cutting everything, so it will cut or splice any player's name and score who is on the 6th or greater number
    
    
//we wanna store the high scores in the form of key-value pairs in the localStorage:
    localStorage.setItem('highScores',JSON.stringify(highScores)); //we need to put key as string and its value also as string. But here as our value was an array ie highScore[] so we had to stringify the array into a string
    console.log(highScores);
    //When we have saved the score, we wanna return to the home page
    alert("Saved your score!");
    
};
//shorthand way of highScores.sort() arrow function is:



