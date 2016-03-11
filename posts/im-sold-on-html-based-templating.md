+++
categories = "web html javascript"
date = "2015-01-27T00:00:00.000Z"
title = "I'm Sold on HTML-based Templating"

+++



I've finally come around to liking HTML-based templates. I've been a hold-out for a long time but I'm finding it harder and harder to resist the tide and I'm officially calling it today; HTML templates have won.

What am I talking about? If you've done heavy JavaScript developer since, well the dawn of time, you're probably used to creating templates a lot like this:

    <script type="text/mustache" id=template">
      <div><span>Hello</span> {{name}}</div>
    </script>

This is a hack, always has been. The script tag was never intended to hold arbitrary strings for later processing, but it does, so it's always been a good fit for templates. Then Web Components came around (which I've written about [here](http://dailyjs.com/2014/03/10/components-controls/)) and introduced the `<template>` tag. The template tag brought some major benefits; namely that the content is parsed but not executed. This means that a template can have `<script>` tags with JavaScript, CSS, etc. and none of it is ran until the template is inserted into the page.

This is great! This means you can define, for example, a custom element and it's template, then have some JavaScript to execute on insert. Then to activate a template all you have to do is use `document.importNode` and insert it anywhere you like and *boom*, it's like inserting new HTML into the page.

## How Things Changed

The problem with templates has always been that they do not define a data-binding strategy. And for obvious reasons they can't. Can you imagine Mozilla, Google, Microsoft, Apple and others all agreeing on, for example, Mustache as the data-binding language for templates? No way! Never going to happen. And because of that we only get basic HTML. The problem is that basic HTML isn't all that great for dynamic creation. It's just XML, and XML just has tags and attributes. That doesn't have the power of a string-concatenation-based templating language like Mustache.

But it doesn't matter. Angular has shown that HTML-based templating can work. And devs have spoken; we like to put the HTML straight into the page. Adding script tags or importing HTML from a module-loader feels foreign and weird.

So the question becomes, will there be a standard developed around HTML-based templates? Probably not. But there are certainly a variety of patterns that are emerging, such as `for-each="items"` to iterate a list. One of my colleagues [David Luecke](https://twitter.com/daffl) released [HTML Breezy](http://daffl.github.io/breezy/) recently, a Virtual-DOM backed HTML based templating engine that runs in both Node and the browser. So me, I'm sold. My next templating language will be HTML. The `<template>` tag is too compelling to continue to ignore.
