{
  "title": "Functional JavaScript in action",
  date: "2013-11-17",
  "categories": "javascript functional"
}

Recently came across a [blog post](http://redactweb.com/javascript-to-convert-between-states-and-abbreviations/) about a JavaScript function to state names to abbreviations (or vice versa) and realized that it's an excellent topic to present the power that can be had from functional programming in JavaScript.

The premise of the article is that the author needed a function that when given a state name or abbreviation would return the opposite. The author went about it by first finding a PHP function that does the same, then simply converted the code over to JavaScript. While this method surely works for the purpose needed, it also illustrates how powerful functional programming techniques could be used instead which will produce the same result, but also have some reusable code.

First, let's rewrite the function to get rid of the looping pattern. To do this in a more functional way we can break down what is happening into a few steps. The function is provided two arguments: `name` and `to`. Name is the value that we are looking up in our array and to is the key that we want to convert to. Given that, in order to find the value we need to know the name of the key of that value. It's the opposite of `to`, right? Using the power of Underscore/Lodash -- I prefer [Lo-Dash](http://lodash.com/docs) -- this can be done using the `_.without` function. Now, keep in mind that for performance it would probably be better to find the from value using a ternary expression, but for the sake of the article we want to do it in a functional way. So that makes our first expression:

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
