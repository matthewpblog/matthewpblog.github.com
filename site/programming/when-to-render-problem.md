---
layout: post.njk
title: The When to Render Problem
date: 2019-09-29
tags: post
permalink: programming/when-to-render-problem.html
description: How view libraries know when and how to update the page in the most minimal way possible. Discusses the pros/cons of the different approaches taken.
---

Front-end view libraries typically set out to solve two important problems for developers:

1. Providing a __declarative__ way to express the view in terms of desired HTML.
1. Answering the when to render question.

This post focuses on the latter and compares how various libraries solve this problem.

## The problem

Web application state changes. It changes because users interact with the app and produce events. When that state changes you often want to update the page to reflect the new state.

The change in state *might* necessitate updating the UI completely, it *might* not require any changes at all, or it could be anything in between.

Since the view library enables declarative programming, knowing *when and how to rerender* becomes a critical component; if the developer has to manage the minutia of updating individual DOM nodes then the advantages of declarative views go away.

To explain why this is critical, take a naive approach to rendering like so:

```js
function render({ name }) {
  app.innerHTML = `
    <label>Name:
      <input type="text" placeholder="name"
        value="${name}" oninput="onChange">
    </label>
    <span>Name: ${name}</span>
  `;
}

window.onChange = ev => {
  render({
    name: ev.target.value
  });
};

render({ name: '' });
```

The above implements rendering by setting a DOM node's [innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML). When the input changes it rerenders again, using the input value to update the span's text. This part works.

*However*, as a result of blowing away and recreating the DOM the input's caret position also gets lost. Oops!

A smart library won't blow away the DOM and rebuild it for this reason as well as performance reasons. That's why answering the when to render question is so critical.

## Approaches

Below are a few of the common solutions to this problem. There might be others out there I'm not aware of. If you know of something I missed, let me know!

### Observables

Nowadays most people think of the term *observable* as meaning reactive event streams like those provided by [RxJS](https://rxjs-dev.firebaseapp.com/). Way before such ideas had entered the mainstream there was a different type of observable, some times called __key/value observables__ which are objects that track dependencies between other observable objects. When a value changes that dependency tracking information is used to know *what other* properties/values need to update.

This technique has a long history in JavaScript view libraries. It is used by [Knockout](https://knockoutjs.com/), [Vue](https://vuejs.org/), [CanJS](https://canjs.com/) and likely many many more.

These libraries are able to connect the observable objects to DOM nodes within the view. So they are able to know that, for example, {% raw %}`<span>{{ name }}</span>`{% endraw %} the `name` value here is actually a property on some observable object. With that they can then ask the observable to let them know when `name` changes. When it does so they can simply modify this span's [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text) node, which is the smallest possible change.

The result of this approach is the miminal possible change to the DOM. One downside to this approach is that setting up these observable objects; keeping track of dependencies, setting up event listeners for when things change, etc. can be expensive. That extra work results in slower *first render* often (this is not to say that ever library using observables will have slower first render).

### Render functions

Another approach is that of [React](https://reactjs.org/) and similar libraries. React provides the imperative `setState()` method in class components and the similar imperative APIs in the hooks based function components.

Calling these functions results in a "render function" being rerun and the results of that function being diffed against a previous version and then the changes being applied.

How libraries implement diffing can be quite different, but the when to render part is the same, a call to the `setState()` sort of API results in a full rerender.

With React the diffing is against two virtual trees of nodes. [LitElement](https://lit-element.polymer-project.org/) (through lit-html) takes a different approach. Since its views are tagged template strings it is able to know exactly what DOM nodes are able to be changed.

```js
return html`<span>${name}</span>`;
```

Therefore lit-html is able to avoid diffing DOM nodes that are static and never change. Instead it diffs the *values*, in the above example it would check if `name === oldName`.

Back to LitElement, like React it makes the decision to rerender based on an imperative state change. It does this by having tracked properties; when those properties change a render cycle is queued.

The advantage to the __render function__ approach is that you can use plain JavaScript objects and do things in a more direct and imperative fashion.

----

Interestingly, [Mobx](https://mobx.js.org/) is a library within the React ecosystem that implements observables as a layer on top of `setState()`. The observable layer exists for the sake of creating declarative view models, but does not play into the when to render problem.

### lit-html

A brief sidebar on lit-html. Above I explained how LitElement, through lit-html, prevents diffing static DOM nodes. It's interesting to me that lit-html, which I think of as a view library, actually doesn't answer the when to render problem at all. If you were to use lit-html directly, *you* would be responsible for rerendering as part of your event listeners.

I find this to be a nice way to layer. lit-html solves the declarative view problem and allows other libraries like [LitElement](https://lit-element.polymer-project.org/) and [Haunted](https://github.com/matthewp/haunted) to solve the when to render problem.

### Glimmer

Ember (through Glimmer) has a slightly different approach to any of those listed above. It's somewhat similar to the observable approach but deserves its own section.

Glimmer has [tracked properties](https://glimmerjs.com/guides/tracked-properties) which are properties that react to being changed. Unlike in the observable approach, which tracks dependencies between objects by using an event system, Glimmer instead uses timestamps to know when the last time a property changes. For dependant values (think [computed properties](https://vuejs.org/v2/guide/computed.html) in Vue) it calculates its timestamp by comparing the timestamps of its dependencies.

You can think about this system as being similar to the etag header for HTTP caching.

When the view is updated it simply walks through all of the bindings and checks if the timestamp is greater than the last time the view was updated. If it is, it knows to update that DOM node.

### Compilers

This is the approach of [Svelte](https://svelte.dev/) and [Imba](http://imba.io/), where the code is compiled to minimal DOM manipulation. The user is able to write code in an imperative style which brings a similar advantage as the render function approach.

```html
<script>
	let count = 0;

	function handleClick() {
		count += 1;
	}
</script>

<button on:click={handleClick}>
	Clicked {count} {count === 1 ? 'time' : 'times'}
</button>
```

However this code is transformed at build time and replaced by minimal imperative DOM manipulation. Svelte knows when to render because it is aware that `count` is used in the template and is modified in the `handleClick` method.

The downside to this approach is that it doesn't work in the browser and must be precompiled. This means that the code you write is quite a bit different from what actually gets run.

## Conclusion

I spend a lot time working on front-end views at the lowest levels and have written and contributed to many libraries like those discussed above. It's exciting to me how there's still innovation in this space and new ways to solve the when to render problem continue to be invented.

Of particular interest to me at this moment is how a view library could choose *not to solve* the when to render problem at all, but rather provide an imperative update API. This is interesting because it results in decoupling the programming style from the view layer. So instead of *having* to use a hooks based approach, a view model based approach, etc. the when to render problem could be solved in the state management layer.

Imagine for example, a finite state machine being connected directly to the view library. Something to explore in the future. 😏