{
  "title": "Functional JavaScript in action",
  date: "2013-11-28",
  "categories": "javascript functional"
}

Recently came across a [blog post](http://redactweb.com/javascript-to-convert-between-states-and-abbreviations/) about a JavaScript function to convert state names to abbreviations (or vice versa) and realized that it's an excellent topic to present the power that can be had from functional programming in JavaScript.

The premise of the article is that the author needed a function that when given a state name or abbreviation would return the opposite. The author went about it by first finding a PHP function that does the same, then simply converted the code over to JavaScript. While this method surely works for the purpose needed, it also illustrates how powerful functional programming techniques could be used instead which will produce the same result, but also have some reusable code.

First, let's rewrite the function to get rid of the looping pattern. To do this in a more functional way we can break down what is happening into a few steps. The function is provided two arguments: `name` and `to`. Name is the value that we are looking up in our array and to is the key that we want to convert to. Given that, in order to find the value we need to know the name of the key of that value. It's the opposite of `to`, right? Using the power of Underscore/Lodash -- I prefer [Lo-Dash](http://lodash.com/docs) -- this can be done using the `_.without` function. Now, keep in mind that for performance it would probably be better to find the `from` value using a ternary expression, but for the sake of the article we want to do it in a functional way. So that makes our first expression:

```javascript
var from = _.without(['name', 'abbrev'], to)[0];
```

What this does is simply take the array, find the value that matches `to` and remove it, leaving only one string which is our `from` key.

Now that we know what our `from` key is, we need to look up the `name` in our states array. But before we do that let's see how the original blog post is doing the lookup:

```javascript
$.each(states, function(index, value){
  if (to == 'name') {
    if (value.abbrev.toLowerCase() == name.toLowerCase()){
      returnthis = value.name;
      return false;
    }
  } else if (to == 'abbrev') {
    if (value.name.toLowerCase() == name.toLowerCase()){
      returnthis = value.abbrev.toUpperCase();
      return false;
    }
  }
});
```

Simple enough, they are looping over their `states` array and finding the value that matches what they want to convert. If they are converting to `name`, then they are comparing against the `abbrev`, and they are converting to `abbrev` they are comparing to `name`. When they find the match they assign it to their `returnthis` variable and then returning false, which will existing the loop in `$.each`.

We can do better. Since we've already gotten the `from` key, we can skip the repetitive if/else block that does the same thing. And instead of using an `each` loop let's use the power of functional programming to `_.find` that value.

First, let's construct a regular expression that we can test against values, to prevent the `toLowerCase` conversion they are doing.

```javascript
var exp = new RegExp('^' + name + '$', 'i');
```

This simply creates a regular expression that matches for the `name`, ignoring case. Now let's find the object that matches the value in our `from` key:

```javascript
var selected = _.find(states, function(st){
  return exp.test(st[from]);
});
```

Perfect, this will find the object we are looking for (`RegExp.prototype.test` returns true on a match) and we only need to return the `to` key. Full source:

```javascript
function convertState(name, to) {
  var from = _.without(['name', 'abbrev'], to)[0];
  var exp = new RegExp('^' + name + '$', 'i');
   
  var selected = _.find(states, function(st) {
    return exp.test(st[from]);
  });
   
  return selected[to];
}
```

But wait, we've uncovered a pattern here. This is where functional programming becomes most useful. When you write a bit of code, note that there's a pattern, and abstract out that pattern so that you can reuse the code whenever the pattern is discovered. In our case, what are we really doing? We're operating on an array of objects, each containing 2 keys. We look up the value from one key and return the other. Simple, right?

So what we can and should do is create a function that does all of this for you automatically. It returns a functional that operates on that set of rules using the array you provide it. First we need to replace this line:

```javascript
var from = _.without(['name', 'abbrev'], to)[0];
```

To get rid of the hard coded string array. Instead we want to pass in our "array of objects" and have the function find the fields. We can do that like so:

```javascript
var fields = _.keys(array[0]);
```

And then we simply need to return a function that takes `name` (for value lookup) and `to` arguments. With that we've created a ***higher order function*** that makes it easy any time we have a situation with the same pattern. Full source and examples below.

```javascript
function makeSwappable(array) {
  var fields = _.keys(array[0]);
  return function(name, to) {
    var from = _.without(fields, to)[0];
    var exp = new RegExp('^' + name + '$', 'i');
     
    var selected = _.find(array, function(item) {
      return exp.test(item[from]);
    });
     
    return selected[to];
  };
}
 
var convertState = makeSwappable(states);

convertState('Kentucky', 'abbrev'); // -> 'KY'
convertState('CA', 'name'); // -> 'California'
```
