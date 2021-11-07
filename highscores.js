const highScoreList = document.getElementById('highScoresList'); //we get a reference to the high scores list
const highScore = JSON.parse(localStorage.getItem('highScores')) || []; //we get the high scores out of local storage by parsing the string. If the string is null, we will return an empty array []

// console.log(highScore);
//now we want to iterate over each score object and for each score we want to add an <li> element to the <ul> on the high scores page. This is the exact use-case of a  map() function.
// definition: The map() method creates a new array populated with the results of calling a provided function on every element in the calling array.
//so we use the map() on the highScore array. The map will take each array item and will convert it into something new
// so map() takes an incoming array and converts each of the items into something new in the new array

// console.log(highScore.map(score =>{
//     // console.log(score); //each score object in the highScore array gets consoled
//     // console.log(`${score.name} - ${score.score}`);
//     in the following line we are outputting html strings using js:
//     return (`<li class = "high-score-list"${score.name} - ${score.score}</li>`); // we want to have list items ie <li>'s inside the ul, and not the strings. So we use <li> here in javaScript
//     // it is similar to what we do in react. We are writing html in js. So here, we are returning back a string version of an li
// })
// );
//now we join the elements returned by highscore with an empty string "". This converts all the <li>'s into a kind of single string
highScoreList.innerHTML = (highScore.map(score =>{
                                            // console.log(score); //each score object in the highScore array gets consoled
                                            // console.log(`${score.name} - ${score.score}`);
                                            // in the following line we are outputting html strings using js
                                            return (`<li class = "high-score">${score.name} - ${score.score}</li>`); // we want to have list items ie <li>'s inside the ul, and not the strings. So we use <li> here in javaScript
                                            // it is similar to what we do in react. We are writing html in js. So here, we are returning back a string version of an li
                        }).join("") //we are joining the elements of the highscore[] with the empty string ""
);
console.log(highScoreList);
// so we just added the list items as a mapped and joined string into the highScoreList <ul>