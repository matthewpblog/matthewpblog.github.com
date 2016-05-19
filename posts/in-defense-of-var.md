---
title: "In Defense of var"
---

Many articles and discussions on Twitter have popped up in the last year or so debating when to use the new `let` and `const` bindings. Some will say you should only use `const` for things like string constants, while others take the opposite approach and say to *always* use const, unless you specifically plan on changing the value later.

These arguments have merit, I don't want to disparage them. I would, however, like to point out the wasted energy these debates (and decisions) cause.

## Once, there was only var

A (not so) long time ago there was only `var`, and it was bad. Well, not totally bad but it does unexpected stuff like hoisting. If you're a seasoned JavaScript dev you know about hoisting and probably avoid bugs like this:

```js
for(var i = 0; i < teams.length; i++) {
  getTeamById(i, function(){
    var name = teams[i]; // OOPS!
  });
}
```

I'm sure you spot the error here; `i`'s value is scoped to the outer function, not lexically inside of the loop. If you've been doing JavaScript a long time you probably still make this mistake from time to time, but overall you instinctively avoid it.

## Semantics Shemantics

Semantics do matter, and `let` and `const` are both (probably) better than `var` for most uses. Nevertheless I'd rather have 1 type of declaration, however flawed, than 3. I don't want to obsess over when to use `let` vs. `const`. I don't want to think about "I'm using a for loop here, which declaration is appropriate..." I want my mind focusing on what the code is trying to accomplish.

Some will say that you never need to use `var` again. That's probably true; you don't **need** to use it. But this sort of code is not that rare:

```
getTeams().then(function(teams){
  displayTeams(team);
});

if(loggedIn) {
  var displayTeams = function(){ ... }
} else {
  var displayTeams = function(){ ... }
}
```

Arguably you shouldn't write code like that, but the advantage to having one declaration is that once you get used to how it works, you don't have to think about it anymore.

I'm worried that in a world with 3 declaration choices we're going to be slowed down; paralized by choice.
