---
title: "Flora - Streaming templates for Node.js"
date: "2017-11-08"
---

> __tdlr;__ check out [flora](https://github.com/matthewp/flora), a templating engine that allows you to stream HTML.

A greatly under-appreciated feature of HTML is that it can be streamed. The browser can begin parsing and displaying part of the page while the rest is still being downloaded.

However most server-side frameworks and template engines assume that creating HTML is done synchronously. This means if you need to do anything slow, like make a database request, your users won't start seeing content until *all of that is done*. This is a travesty!

Think about this; you display the user's name on the page and you need to make a database request to get the name. While you are making that request you *could be* sending this HTML:

```html
<!doctype html>
<html lang="en">
<head>
  <title>My app!</title>
  <link href="/styles/site.css">
  <script src="/scripts/app.js" async></script>
<body>
  <nav class="navbar"> ... </nav>
  <header> ... </header>
```

All of the above HTML *does not* depend on the database request. This means that, while the request is in flight your user could be:

* Downloading the CSS the page is going to need.
* Downloading the scripts that will later run.
* Seeing the site's "skeleton", stuff like a navigation bar, some heading elements.
* Maybe more! You can, of course, design your site to take advantage of streaming, by deferring loading stuff if you don't want to block.

Node.js' support for streaming is __awesome__. The *response* object in a request is a writable stream. You can write data to it incrementally.

*However* Node's ecosystem support for streaming HTML is, frankly, terrible. Now we see the major frameworks competing to see who can have the best async/await approach. But async is the *wrong model* for web servers. Web server should *never* block rendering of HTML. Only block when you absolutely have to. I'll save this rant for a future article.

# Enter flora

[flora](https://github.com/matthewp/flora) is a library I've been working on that allows you to stream HTML. It allows you to provide promises and streams as data to the template. This allows it to *flush out* any HTML that is not waiting on these promises and streams, making sure your HTML is as fast possible. It looks like this:

```js
const {html} = require('flora-tmpl');

function template({name}) {
  return html`
    <!doctype html>
    <html lang="en">
    <title>My app!</title>
    <link href="/styles/site.css">
    <script src="/scripts/app.js" async></script>

    <nav class="navbar"> ... </nav>
    <header> ... </header>
    <div class="user">${name}</div>
  `;
}

async function getUserName() {
  let user = await db.getUser();
  return user.name;
}

require('http').createServer(function(request, response){
  let name = getUserName();

  template({ name }).pipe(response);
}).listen(8080);
```

What is happening here is:

* When we get a request we asynchronously make our database call with `getUserName()`.
* We pass the promise into the template as the `name` property.
* Using the `html` tagged template function to render the HTML. It returns a [readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) that can be directly piped into the response (or any other writable stream).

# Native JavaScript templates

I spent quite a bit of time going back-and-forth deciding on a templating syntax for flora before I realized that I didn't need to create one; JavaScript has templates baked in through tagged template functions. This was quite a revelation for me!

Instead of learning a new template language you can just use normal JavaScript template interpolation.

Flora includes a special `map` function which takes a stream and a callback, allowing you to produce HTML for each item that comes through the stream. It looks like this:

```js
const {html, map} = require('flora-tmpl');

function template({stream}) {
  return html`
    <!doctype html>
    <html lang="en">
    <title>Todo list</title>
    <main>
      <h1>Todo list</h1>
      <ul>
        ${map(stream, item => (
          html`
            <li>${item}</li>
          `
        ))}
      </ul>
    </main>
  `;
}

template({stream: getTodos()}).pipe(process.stdout);
```

Producing this:

![Streaming HTML](https://user-images.githubusercontent.com/361671/32578154-2abd05a6-c4aa-11e7-95bd-1dc39729c8fc.gif)

Please check out [flora](https://github.com/matthewp/flora) and tell me what you think. And next time you write a back-end the same old blocking way, know that there is a better way, with streams!
