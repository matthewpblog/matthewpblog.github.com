---
title: JavaScript Debugging Tips from the Trenches
---

JavaScript. The combination of dynamic typing, liberal use of state mutation, closures, and asynchronousity can lead to bugs that are frightening to try and fix. I'm by no means a debugging Jedi, but over the years I *have* accumulated a number of techniques that help me find the source of even the nastiest bugs eventually.

If you're a veteran debugger some of these probably sound obvious to you, but I think there's benefit to being reminded of these from time-to-time.

## Stack traces: there be dragons

![frightening stack trace](/images/js-debug/stack-trace.png)

Seeing a stack trace in your console (whether with Node or in a Browser) that spills out dozens of lines of code from a deeply nested library can be quite intimidating. I think most people struggle a little bit reading other people's code.

The first, and probably most important, lesson in debugging is to love stack traces. The most important thing about stack traces is that ***they exist***. Bugs where your app fails silently are far more daunting. Stack traces at least give you a starting point from which you can work backwards.

Stack traces can tell you a few key things about your bug:

1. The names of functions being called.
2. Line and column numbers, so you can refer to the code in question.
3. Often -- not always but often -- you'll find some of your *own* code within the stack trace. This is huge! It gives you a familiar frame of reference and somewhere that you can begin your investigation.

So instead of panicking when you encounter a stack trace, take a deep breath and see what clues are hidden within it.

## Setters are your friend

A common bug in stateful code is that some property on an object has an unexpected value. These could be caused by code within the closure changing the value, or if that object is exposed to the outside world it could be coming from just about anywhere.

Setters provide a way to debug this. Here's something I often do:

```js
var _val = someObject.prop;
Object.defineProperty(someObject, 'prop', {
  get: function() { return _val; },
  set: function(val) {
    if(val !== 'expected value') {
      try {
        throw new Error('Why you do that?');
      } catch(err) {
        console.log(err.stack);
      }
    }

    _val = val;
  }
});
```

This will display a stack trace whenever the object's property changes to a value that you're not expecting it to be. Now that you love stack traces you should be happy to see one.

The same trick works with functions, but instead of a setter, wrap their value so you have a place to set a `debugger;` when things aren't as they should be:

```js
var fn = someObject.fn;
someObject.fn = function(){
  // Why is this getting called?
  debugger;
  return fn.apply(this, arguments);
};
```

Which brings us to:

## Learn to love the debug tools

In a lot of languages you can get by with logging values to the console/terminal. This certainly works in JavaScript as well; back in the old days we even had to do `alert(value)` because it was all we had.

Long gone are those days and browsers (and even Node) have excellent debugging tools. Nevertheless I still run into developers who aren't comfortable using them. While you can get by with `console.log`, in a stateful application nothing beats being able to examine code within a breakpoint.

Get used to using:

* A `debugger;` statement that has been carefully placed (perhaps using the setter tip from above).
* The Console tab as a playground to inspect values once you have hit a breakpoint.
* Buttons/shortcuts for stepping into, over, and out of function calls.
* The stack trace (which you now love) which displays all of the function calls that have gotten you where you are. It sucks a bit when you are within an asynchronous call, but browsers are improving the experience here, especially with native Promises.

These are just the basics, you can do everything from inspect cookie values to do a memory dump with your tools. The key is getting comfortable using them and you'll find yourself much more productive.

## Use counters

This is an easy one; if you ever encounter a function that is frustratingly being called more times than expected, use a counter to provide a place to debug. Combine this with the wrapping technique from earlier:

```js
var counter = 0;

var fn = someObject.fn;
someObject.fn = function(){
  counter++;

  // This function should have been called no more than 3 times
  if(counter > 3) {
    debugger;
  }

  return fn.apply(this, arguments);
};
```

As usually, once you hit a breakpoint the stack trace displayed gives you a place to work backwards.

## Work backwards

I can't stress this enough, start with what you know and work backwards from there. If there's a value that's not right, a function that called too many times, or one that's not called at all, find the point in time within the application where you know you're in a bad state. Use the tools in your toolbox to find that next spot backwards where you can test whether things are what you would expect them to. Eventually you'll reach the point at which the state is correct. At that point you can start *working forwards*.

The combination of working backwards followed by working forwards will let you condense down a bug to only a few lines of code. At that point it's a good idea to break into a **minimal test case**. Whether it's your code or open source code, file a bug on the bug tracker and someone more knowledgable might be able to help. If not you at least have something small enough to work with yourself.

## Divide and conquer

When all else fails you can always remove code. Start with a file that you know is part of the problem and remove everything. If the bug has gone away you can then insert some of the code back; only half at a time. Eventually you'll be able to reduce the bug down to only a few lines of code, at which point the other tricks outlined in this article can take you to the next step.

## Don't fret

Debugging JavaScript is hard. You're not alone in your frustration. But little can be as satifying as when you finally find the cause of a bug you spent 2 hours on. So there *is* reward for the pain. If you learn to use your tools, reduce the noise (by eliminating code) and learn to love stack traces, there are no bugs you can't overcome.
