+++
categories = "javascript"
date = "2014-03-26T00:00:00.000Z"
title = "Test Your Application Entry Point"

+++

This will be short and sweet. When working on a large JavaScript application (or a small one, for that matter) you're going to have an entry point where you set up your world and get everything started. It probably looks something like this:

```javascript
define([
  'xwidget',
  'ywidget',
  'routing'
], function(XWidget, YWidget, route){
  // Load everything!

  // Set up global state!
  var state = {
    light: 'green',
    time: new Date()
  };

  // Initialize main widget!
  var main = new XWidget('body', {
    subwidget: new YWidget($('<div></div>'), {}),
    state: state
  });

  // Listen for routes
  route('/calendar', function(){
    // Make some change to `main` probably
  });
});
```

It's very easy to forget that not only is this an important chunk of code, it influences everything else that happens further down the chain in your application. **Test it** as though it's just as important, because it is.

When you begin crafting your application as a pyramid of [web components](http://dailyjs.com/2014/03/10/components-controls/) this becomes even more critical. Using [can.Component](http://canjs.com/guides/Components.html)'s scoping rules, data you initialize in your `main.js` will trickle down and be used by any component on your page, no matter how deeply nested.

This is amazing in terms of crafting components that glue well together, but the downside is that the tests you created for `<x-widget>` are not enough, that top level file might be doing things just slightly differently.

The benefits of writing tests first hold as well for your application entry point. If you try writing tests after-the-fact (as I'm currently doing) you'll notice that things break as your entry point file is actually dependent on something in your `index.html` file (as an example). Tests first will force you to make sure everything is as maximally modular as can be.
