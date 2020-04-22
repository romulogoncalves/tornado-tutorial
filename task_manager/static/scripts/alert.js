"use strict"

/* An example of a comment
with two lines.
*/

// Define a variable
let message = 'There was an error!';

// Define a constant
const age = 12;

// A constant used as an alias
const COLOR_RED = "#F00";

alert(message);
alert(`the result is {1 + 3}`);

// Boolean type
let isItGreater = 4 > 1;

/*
Conversion to string: String()
Conversion to int: Number() / + (example: +"12" -> creates int 12.
Conversion to boolean: Boolean())
*/

// If one of the operands is a string, the other one is converted to a string.
let twoStrings = "Hello " + " world!"

// prompt(<question>, <default value>), ok or cancel
let age = prompt('How old are you?', 100);

// confirm(<question>): ok or cancel
let isBoss = confirm("Are you the boss?");

// functions with default values
function showMessage(from, text = "no text given") {
  alert( from + ": " + text );
}

function showMessage(from, text = anotherFunction()) {
  // anotherFunction() only executed if no text given
  // its result becomes the value of text
}

let sayHi = function() {
  alert( "Hello" );
};


