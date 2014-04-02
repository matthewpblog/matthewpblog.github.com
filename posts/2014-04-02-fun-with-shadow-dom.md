{
  "title": "Fun with Shadow DOM",
  date: "2014-04-02",
  "categories": "javascript webcomponents"
}

**Update**: To do this demo you first need to enable experimental web platform features [in chrome://flags](chrome://flags/#enable-experimental-web-platform-features).

Now that Chrome has shipped Shadow DOM we can start experimenting with what possibilities are going to open up to developers. Consider this a beginner/intermediate post about Shadow DOM. I assume you already know Shadow DOM is a way to "hide" an element's structure while opening up insertion points to its inner content.

With that in mind, this is a simple exercise in seeing the weirdness that is Shadow DOM. So open up a text editor and create an HTML file with these contents:

```html
<html>
<head>
  <title>Fun with Shadow</title>
</head>
<body>
<div id="container"></div>
<template id="tmpl">
  <style>div { color: red; }</style>
  <div>Hello <span class="name">Matthew</span></div>
</template>
<template id="tmpl2">
  <div>Welcome to the internet</div>
  <shadow></shadow>
</template>
</body>
</html>
```

From here on the rest of the tutorial is done from Chrome's DevTools. So open your brower and navigate to the page you just created and open the DevTools. This is a simple page with a container div and a couple of templates.

You should see nothing on your page at this point, but we'll change that. The element `<div id="container"></div>` is the root element we're going to play around with so go ahead and get a reference to it.

```javascript
c = document.querySelector('#container');
```

Next we're going to create this div's [shadow root](http://www.w3.org/TR/shadow-dom/#dfn-shadow-root). The shadow root is the place where you can append stuff to the div and not have to worry about the page's styling interfering (among other advantages).

Before we create the shadow root, type this into the console and hit enter:

```javascript
c.shadowRoot
```

It should return `null`, as the div doesn't have a shadow root yet. So let's go ahead and change that. Create the shadow root and keep a reference for later:

```javascript
root1 = c.createShadowRoot();
```

Should return (in the console):

```
#shadow-root
```

This also updates `c.shadowRoot`. Test it by doing:

```javascript
root1 === c.shadowRoot
```

And you'll get `true`. Awesome. Now that you have a shadow root you'll want to add stuff to it. This works like any other element. You can use `innerHTML`, `appendChild`, `insertBefore`, etc. to add content to the shadow. Let's use our first template to attach some content:

```javascript
root1.appendChild(document.querySelector('#tmpl').content)
```

The immediate effect you'll see is the words "Hello Matthew" in red on the page. This is because the template contains a `<style>` tag that styles the content within the template.

You'll also notice that we *didn't* append the template, we appended the template's `content` property. This is a read-only property containing a document fragment of the template's content.

If you navigate to the DevTools' **Elements** tab and expand the `#container` div you'll see... nothing at all. This is because shadow root is hidden by default. You can change this by going into Settings -> Elements and selecting *Show Shadow DOM*. Now go back to **Elements** and you'll see a `#shadow-root` nested under your div. Yay!

## Deeper down the rabbit hole

We could stop here and you'd have a good idea of what the Shadow DOM allows you to do, and how to use an element's shadow root. But we're going to take it one step further. When we created the shadow root you might have asked yourself why there is a method `createShadowRoot` in the first place. Does it mean you can have multiple shadow root's in an element? It does!

So let's go ahead and create a second shadow root to further our experimentation:

```javascript
root2 = c.createShadowRoot();
```

This will return a new shadow root. But what you might also notice is that the words "Hello Matthew" disappeared from the page. What's going on? First use the **Elements** tab and expand your `#container` div and there should now be two shadow roots. The first is `root1` and its contents are still there. That's good, but why can't we see it?

The reason is that the browser only renders the *last* shadow tree. The others are still there, you just can't see them. In your console do this:

```javascript
c.shadowRoot == root1
c.shadowRoot == root2
```

As you can see, the div's new shadowRoot is now `root2`. You might be asking how this is useful... I'll get to an explanation but it might be better to show you. Go ahead and attach that other template to the new root:

```javascript
root2.appendChild(document.querySelector('#tmpl2').content);
```

Ah! The first shadow's content is back. This is because `#tmpl2` has an insertion point with `<shadow></shadow>`. This says "insert the previous shadow here", more or less. You may also notice that the second template's div is not in red. This is because the `<style>` tag in the first template is scoped to only content within that template. This is the beauty of templates.

Back to the question, how is multiple shadow trees useful anyways? A big part of web components is going to be extending existing components. Shadow DOM provides an excellent way to do that. Let's say I created `<super-calendar>` and it was awesome... but ugly. You might want to come around and create `<pretty-calendar>` that modified part of the DOM structure a little bit, applied some prettyier scoped `<style>` but left my JavaScript alone. With `<shadow>` and `select` you can do all of that, keeping just the parts of my ugly calendar that are needed to function.

Hopefully this has taught you a little bit about what is possible thanks to Shadow DOM. More important, however, is that you see how easy it is to experiment with emerging web technologies thanks to the awesome developer tools Chrome and Firefox provide us.

Send your thoughts/hacks to *matthew@matthewphillips.info*.
