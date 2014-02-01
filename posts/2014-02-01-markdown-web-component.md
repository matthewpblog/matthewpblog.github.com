{
  "title": "Markdown Enable Your Blog Comments with Web Components",
  date: "2014-02-01",
  "categories": "javascript canjs can.component webcomponents"
}

If you're like me and are excited about getting started using web components today, you might find yourself struggling coming up with practical uses that aren't the typical carousel, calendar, or [accordion](http://matthewphillips.info/posts/building-an-accordion-with-can-component.html) widgets that we've all written a hundred times in plain JavaScript.

In this article I'll walk you through the process of:

* Finding a practical use for web components.

* Developing your first iteration.

* Refining, deciding when components are needed and when they are just extra fluff.

All of my examples will use [can.Component](http://canjs.com/guides/Components.html) because it's available today, is stable, and has really good browser support, but are still applicable no matter what your web component framework of choice is.

# From Concept to Code

If all you're interested in is learning you can pick just about any API on the web and turn it into a web component. Or pick your favorite JavaScript library and wrap a component around it. Web components are primed to be the new jQuery plugin.

## Markdown

If you're a programmer you probably use markdown (or another markup generator) quite often. I'm writing this post in markdown right now. The only downside is I have a Grunt task running in the background that is rerendering the html every time I save the file. What if you could write markdown and have it generate all in the browser? You want to write something like:

```html
<markdown>
# Hello world!

* Oh my, **lists**
</markdown>
```

And let a library do the heavy lifting. Luckily there is a [Showdown](https://github.com/coreyti/showdown), a JavaScript library for turning markdown into HTML. It's pretty fantastic. So let's make a component.

Since Showdown does most of the heavy lifting all we need is a nice wrapper that will allow us to write Markdown inside of a tag and have it render the HTML automatically. Using can.Component we can do that easily, here's a demo:

## Demo
<iframe width="100%" height="300" src="http://jsfiddle.net/TBFp6/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

The code should speak for itself. The `x-markdown` component (all web components should be namespaced, we use `x-` in this example) generates the HTML after it is inserted into the page. We simply listen for the `inserted` event and set the `<content/>` provided by the user to the `markdown` property on the component's Scope.

The powerful part of this example is the `can.compute`. Computes are a type of object that can listen to changes of other objects and automatically recompute themselves. If you've used [ko.observable](http://knockoutjs.com/documentation/observables.html) or Ember [computed properties](http://emberjs.com/guides/object-model/computed-properties/) the idea is much the same, but can.computes are a bit more powerful (we'll get to that later).

The compute simple takes the value of the `markdown` property (which is set in the `inserted` event) and uses Showdown to generate the html that will be displayed.

# Using with Blog Comments

While cool, this example isn't that practical. In reality you'll rarely have a scenario where you need to write HTML inside of a web browser, otherwise using a static site generator is probably what you'll be using.

One place where you would want to generate the HTML on the fly is for blog comments. If your blog is developer-focused it makes sense to allow the reader to write comments in markdown, and have a live preview of what it will look like. So let's refactor `<x-markdown>` to be our live preview.

```javascript
can.Component.extend({
  tag: 'x-markdown',
  template: '<div>{{{html}}}</div>',
  scope: {
    html: can.compute(function() {
      var markdown = this.attr('markdown');
      var converter = new Showdown.converter();
      var html = converter.makeHtml(markdown);
      return html;
    }),
    markdown: ''
  }
});
```

This new version of `<x-markdown>` is much more succinct because we've eliminated the `<content/>` portion by getting the raw markdown from a textarea. can.Component allows you to pass data (included complex objects) through an element's attribute tags. We'll use it like such: `<x-markdown markdown="value"></x-markdown>` so that the `html` compute will be live-bound to the `value` object that we pass in.

Next we need to create a live-bound textarea we'll call `<x-textarea>`. The idea that both x-markdown and x-textarea will be live-bound to the same compute object, and any time you type into the textarea the markdown will automatically be rerendered in the preview window. Demo time:

## Demo
<iframe width="100%" height="300" src="http://jsfiddle.net/TBFp6/1/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

Try out the fiddle (Click on the **Result** link) and see for yourself how the preview updates as you type. The secret sauce here is that we are using `can-value` to bind the textarea's `value` to our scope property also called `value`. can-value works on the element's `change` event, which for most types of forms is fine, but in our case we need the preview to update as you type, so we've added a `keyup` event that simply triggers the textarea's change event as the user types. Simple!

# When not to Web Component

Awesome, we've built a live-bound markdown enabled comment system. In less than 30 lines of code. However you might notice that the `<x-textarea>` isn't really doing much at all. It simply turns a normal textarea into a live-bound one.

However in reality textareas *really are* live-bound, they use the normal DOM events to update their values. So all we are using the `<x-textarea>` for in practice is to turn the DOM events into can events. Luckily [can.compute](http://canjs.com/docs/can.compute.html) already has a way of doing this, so we don't need the `x-textarea` at all.

can.compute can take a set of arguments that includes an element, the property to bind to, and an event to bind to. We'll use it like:

```javascript
var markdown = can.compute(textarea, 'value', 'keyup');
```

This allows us to move our textarea outside of the script tag (since we're getting rid of the component) but still have a live-bound value between the textarea and our `x-markdown` preview. See the demo below.

## Demo
<iframe width="100%" height="300" src="http://jsfiddle.net/TBFp6/2/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

Hopefully I've demonstrated the process of coming up with an idea for a component (essentially an encapsulated piece of HTML with JavaScript interactivity) and refining it until you are left with only the bits of code that you need. We've created a Markdown-enabled blog commenting system is only 18 lines of code. Let it be inspiration for your next component. Can you do better, how about an MDN reference widget?
