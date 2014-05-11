{
  "title": "Responsive Computes",
  date: "2014-05-11",
  "categories": "javascript canjs can.compute"
}

Recently I was working on a template and ran into issues trying to make it responsive purely using CSS media queries. The problem is that the mark-up of the mobile view and that of the desktop were just too different. In fact, the *functionality* of the two views were a bit different as well.

At this point you might give up and just write up two separate templates and use media queries to hide one of them. Bootstrap even [has classes](http://getbootstrap.com/css/#responsive-utilities-classes) for just such a case.

Luckily, however, there is the [matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window.matchMedia) API that brings the power of media queries to JavaScript. There's fairly broad [browse support](http://caniuse.com/#feat=matchmedia) and even [a polyfill](https://github.com/weblinc/media-match/blob/master/media.match.js) if you want support in older IE browsers. matchMedia allows you to use the same type of media queries in JavaScript that you can use in CSS, for example:

```javascript
var mql = matchMedia('only screen and (max-width: 768px)');
mql.matches === true; // true if the screen is <= 768px
```

Additionally matchMedia queries include an `addListener` function that takes a callback that will be called when the media query's status changes; meaning you can resize the browser and the media query will respond when the screen becomes less than 768px (for example).

## Live-bound responsive templates

If you use CanJS you're familiar with can.computes, but you might not be familiar with the [2nd signature](http://canjs.com/docs/can.compute.html#sig_can_compute_initialValue__settings__) which allows you to create a compute from any type of event emitting object. This means we can easily turn our matchMedia query into a compute that can be used in templates:

```javascript
var mql = matchMedia('only screen and (max-width: 768px)');

var mobile = can.compute(mql.matches, {
  get: function(){
    return mql.matches;
  },
  set: function(){
    // Do nothing for this one
  },
  on: function(updated){
    mql.addListener(updated);
  },
  off: function(updated){
    mql.removeListener(updated);
  }
});
```

The compute's `settings` object describes how to bind the compute to the media query and respond to changes. Now your templates can be responsive in a much more powerful way than what CSS allows:

```html
{{#if mobile}}
  <div>Hi there phone! Mobile navigation goes here.</div>
{{else}}
  <div>Totally different desktop experience!</div>
{{/if}}
```

The broader lesson here is that [can.computes](http://canjs.com/docs/can.compute.html) are crazy powerful. If you're only using them to respond to changes in your business logic you're not unlocking their full potential. The browser provides many APIs, like matchMedia, that can be bound to. Check out the [video slider](http://bitovi.com/blog/2013/04/weekly-widget-compute-slider.html) and be inspired.
