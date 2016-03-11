+++
categories = "javascript canjs can.component"
date = "2013-12-02T00:00:00.000Z"
title = "Building an accordion with can.Component"

+++



I learn best by doing, so in an effort to learn more about [can.Component](http://canjs.com/guides/Components.html) I've been creating common types of components using the new framework. An **accordion** is one such example and I wanted to write about my experience creating the component. Note that this article doesn't constitute a best practice, I've only been using can.Component for a few weeks now. Nor is the goal here for the least amount of code (My first couple of iterations used less code actually), rather I wanted to write the component as DRY as possible.

I've long been a fan of the [Web Components](http://www.w3.org/TR/components-intro/) and was excited at the idea that [can](http://canjs.com/index.html) could make it possible to write components today. Components are much different than traditional MVC-style programming, in that much more of your code is spent expressing what a component is rather than listening for DOM events and reacting. To that purpose, when I set out to create an accordion control I started with what I wanted it to look like in the end.

An accordion is made up of a list of elements, each with a header and content, that when the header is clicked the content collapses and only the header is shown. So in the end, our html should look something like:

```html
<accordion>
  <collapsible>...</collapsible>
  <collapsible>...</collapsible>
  <collapsible>...</collapsible>
</accordion>
```

Note that we actually have 2 components here. It's important that the `collapsible` component operate independently of being hosted inside of an `accordion`. This leads to DRYer code, a `collapsible` component is something that can be useful in a lot of places.

## Collapsible

So first to build our `collapsible` component. Like I said before, a `collapsible` has a header containing a title, and it has a content section. It should look something like:

```html
<collapsible class="open">
  <header>
    <h1>This is a title</h1>
  </header>
  <article>This is content.</article>
</collapsible>
```

Note that the collapsible contains a class called `open`. This will be used with CSS to control the `article`'s height. If the collapsible is not open we'll hide it by setting its height to `0px` and overflow to `none`. Now to the code for this component:

```javascript
can.Component.extend({
  tag: 'collapsible',
  template: '<header can-click="toggle"><h1>{{item.title}}</h1></header>' +
    '<article>{{item.content}}</article>',
  scope: {
    item: new can.Map({}),
    toggle: function(){
      this.attr('item.open', !this.attr('item.open'));
    }
  },
  events: {
    '{item} open': function(context, ev, newVal){
      this.element[newVal ? 'addClass' : 'removeClass']('open');
    }
  }
});
```

It's pretty straight forward. The `can-click="toggle"` attribute tells can that when the header is clicked, call the `toggle` function, which is part of the component's scope. The `toggle` function simple toggle the `item`'s `open` flag. Then we have an event that listens for the changes to `open` and sets the element's class appropriately. Note that I could have placed the `open` class as part of the `<article>` element. The advantage to doing it that way is that it could have been included in the template which would have avoided the entire events section of the code. Ultimately I decided that it was more *correct* to have the `collapsible` itself be either open or not. Either approach is valid. The CSS is straight forward, but if you're a better designer than I you might use transforms or transitions.

```css
collapsible article {
  overflow: hidden;
  height; 0px;
}

collapsible.open article {
  height: auto;
}
```

You can try this on your own, using this simple component you have a collapsible header/content panel.

## Accordion

An accordion simple wraps a number of `collapsible`s and has 1 extra feature: it ensures that only 1 collapsible is open at a time. So in order to create my accordion I really only need a couple of things:

1. A way to listen for when a collapsible's `open` property changes.
2. A way to determine which items need to be set to closed.

Below is the code that creates our accordion, take a look first and then I'll step you through what is happening.

```javascript
can.Component.extend({
  tag: 'accordion',
  template: '{{#each items}}<collapsible item="items.{{@index}}">' +
    '</collapsible>{{/each}}',
  scope: {
    items: new can.List([]).
    selected: '@',
    select: function(index){
      var items = this.attr('items');
      for(var i = 0; i < items.attr('length'); i++) {
        var isOpen = i === index;
        items[i].attr('open', isOpen);
      }
    }
  },
  events: {
    'inserted': function(){
      var selected = +(this.scope.attr('selected') || 0);
      this.scope.select(selected);
    },
    '{items} change': function(list, ev, what, how, newVal){
      if(~what.indexOf('open') && newVal) {
        var which = +what.substr(0, what.indexOf('.'));
        this.scope.select(which);
      }
    }
  }
});
```

The first thing you're likely to notice is that we're attaching this to the collapsible: `item="items.{{@index}}"`. We are doing this because the way you pass data to a child component is through its attributes. The attribute's name is the name of the property on the component's scope that we want to set, in this case `item`. The attribute value is the name of the parent scope's property that we want to pass in, in this case `item.0` (or `item.1`, etc. `{{@index}}` gets the index inside of our each loop).

Since the `collapsible` controls its own `open` state we only need to observe changes that happen to our children items. This is what is happening in the `{items} change` event. Any time something changes to one of our items we check to see if it is an open event, and if so we run the scope's `select` method which takes the index of the item that is selected and marks all others as closed (by changing their `close` property, which automatically prompts an event in the `collapsible` component which is what actually removes the class.

And that's pretty much all there is to an accordion. One other thing you might be unaware of is why the scope has a `selected` property with a value of `@`. This means that we want to use the value of the attribute rather than an object it refers to. We use this so that you can pass in the default collapsible to open like so: `<accordion selected="2"></accordion>` means that the `collapsible` with an index of 2 will be open and all others closed.

## Summary

As you can see, creating reusable components with can.Component is fairly straight forward. It's just a matter of rethinking how you design a component, to be more declarative. I'm hopeful that designing this way will make it more natural to create smaller, more modular components. Your application itself should be merely a declaration of componenents and bindings of data between them.

## Demo
<iframe width="100%" height="300" src="http://jsfiddle.net/a6r3c/6/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>
