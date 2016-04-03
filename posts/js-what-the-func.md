---
title: What the Func
---

JavaScript allows you to define functions two different ways. We call the two types of functions, **Function Declarations** and **Function Expressions**.

## Function Declaration

A function declaration looks like:

```js
function addFive(a) {
  return a + 5;
}
```

It is a standalone construct within your program. What's interesting about function declarations is that they can be called before they have been defined:

```js
addFive(2) // -> 7

function addFive(a) {
  return a + 5;
}
```

We'll get back to this in just a second.

## Function Expressions

A function expression is like any other expression within your JavaScript code. You can use function expressions to assign functions to variables:

```js
var addFive = function(a) {
  return a + 5;
};
```

Unlike function declarations, however, you cannot call the function before its definition:

```js
addFive(2) // throws TypeError: addFive is not a function

var addFive = function(a){
  return a + 5;
};
```

So what's going on here? The answer is hoisting.

## Hoisting

You probably already know that JavaScript variables are scoped to their surrounding function. This allows you to do weird stuff like:

```js
var sayHello = function(){
  return 'Hello ' + name;
};

var name = 'Matthew';
```

To demonstrate how this works, imagine the code were instead written like below:

```js
var name, sayHello;

sayHello = function(){
  return 'Hello ' + name;
};

name = 'Matthew';
```

This makes it easier to reason about, and indeed many people prefer writing code this way (CoffeeScript transpiles to code that looks like the above).

The same hoisting rule applies to both types of functions. The key difference is that for variables only the reference (the "name" if you will) is hoisted to the top of the function. Their value is only known after it is assigned. For **function declarations**, however, the entire function body is hoisted. It actually *is* assigned its value at parse time.

So then, what do you think happens in this scenario:

```js
addFive(2);

var add = function addFive(a){
  return a + 5;
};
```

At first glance I would expect the above bit of code to work, after all it *looks* like a function declaration. But alas, it is not. What makes a function declaration a function declaration is not that it is named, but that it is declared within the body of its parent scope. Since it is on the right hand side of an assignment, this is a function expression.

However, named functions can still be super useful as the name is available within the body of the function. This makes it useful for event listeners, for example:

```js
window.addEventListener('load', function onload(){
  window.removeEventListener('load', onload);
});
```

As well as for recursive functions:

```js
var someLongFunctionName = function process(arr){
  var item = arr.shift();

  if(item) {
    doStuff(item);
    process(arr);
  } else {
    return true;
  }
}
```

## A note on style

A lot of people feel strongly about using one type of function over the other. To many people sticking with only expressions means less you have to think about because the rules are the same for functions as with any other type of variable.

I tend to use function declarations a little more than function expressions. I like the fact that I don't have to worry about when I call them (assuming they are pure functions that don't depend on outside variables having been assigned). This *does* force you to think a little more about how the function will be used, but I think that is a good thing that encourages more thoughtfully written code.

The most important bit of any function is the return statement (or the export when a module) and function declarations allow you to define your return near the top of your function.  For example:

```js
function doStuff(){
  var a = 1;
  var b = 2;

  return doMoreStuff();

  function doMoreStuff() {
    // A very long function
  }
}
```

And for modules it's even nicer as it allows you to define all of your imports and exports at the same place, at the top of your module.

```js
// Imports
var doMath = require('./do_math');

// Exports
exports.addFive = addFive;

// Body
function addFive(a) {
  return a + 5;
}
```
