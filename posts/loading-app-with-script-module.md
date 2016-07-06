---
title: Loading a Modern Application with &lt;script type=module&gt;
---

A couple of days ago on the WHATWG Blog there was [a post](https://blog.whatwg.org/js-modules) about a new value being added to the script tag: `type=module`. You can use it like this:

```html
<script type="module" src="/my/app.js"></script>
```

Where **/my/app.js** looks like:

```js
import utils from "./utils.js";

...
```

And so on. This is awesome. You might be thinking this means you can load your React / Angular / [DoneJS](https://donejs.com/) app using &lt;script type=module&gt; and not have to use a bundler for development. Unfortunately that's not the case. If you tried to do:

```js
import _ from "lodash";
```

You would receive an error. As the [spec explains](https://html.spec.whatwg.org/multipage/webappapis.html#resolve-a-module-specifier), a module specifier must start with either `./`, `../` or `/`. Unlike most places that take urls, omitting one of these characters doesn't make it be implicitly relative with &lt;script type=module&gt;. As it explains:

> This restriction is in place so that in the future we can allow custom module loaders to give special meaning to "bare" import specifiers, like import "jquery" or import "web/crypto". For now any such imports will fail, instead of being treated as relative URLs.

The custom module loaders this is referring to would be defined in the [WHATWG Loader](http://whatwg.github.io/loader/) specification. It's been in development for a while but probably (in my estimation) won't be implemented in any browsers for quite a while.

# Loading a real app

So, if all we are going to have for a while is &lt;script type=module&gt; and it defines only a [very simple algorithm](https://html.spec.whatwg.org/multipage/webappapis.html#fetch-a-module-script-tree) for what can be loaded and it is not at all extensible, what can we do?

First let's take a look at a couple of basic requirements needed to load a modern app:

1. It has to be able to load packages, that is the "bare" import specifiers described in the spec. Most likely we need to support loading from the **node_modules/** folder as [npm](https://www.npmjs.com/) use is ubiqutous these days for front end.
2. We need some way to dynamically load code at runtime. With [StealJS](http://stealjs.com/) we have `System.import`, WebPack I believe uses `require.ensure` for the same effect. Progressive loading is done so that you don't have a larger script payload than needed. Everything outside of your "main" code is split into bundles and loaded on demand.

There's a lot more that you probably *want* like the ability to import CSS but I think these two are the most challenging aspects and what I want to focus on.

*Note*: I realize that in production you almost definitely want to build -- concat, minify, etc. -- all of your scripts, I'm really talking about a simpler dev workflow here.

# Hooks

In order to load "bare" import specifiers like `lodash` we need some hooks into the module loading process so that we can say that "lodash" resolves to `node_modules/lodash/lodash.js` (and to do various other things). The WHATWG Loader gives us these hooks, but we don't have the WHATWG Loader so what can we do with only &lt;script type=module&gt; ?

## Service Workers to the rescue

Even though &lt;script type=module&gt; is not extensible and doesn't provide any hooks to help us out, we do have *one* hook available to us, Service Workers allow us to [intercept network requests](https://github.com/slightlyoff/ServiceWorker/blob/master/explainer.md#network-intercepting) by listening to the **fetch** event inside of our service worker.

We can actually do a lot with this. Let's walk through the steps of what it might take to load **node_modules** using the service worker hook. First, you add the script tag to your page:

```html
<script type="module" src="/my/app.js"></script>
```

Our service worker intercepts this request with:

```js
self.addEventListener('fetch', function(event) {
  event.request.url; // -> '/my/app.js'
});
```

Inside this event handler we'll want to first fetch the `package.json` so that we know which dependencies your app has, so we can do that now:

```js
self.addEventListener('fetch', function(event) {
  fetch('package.json')
    .then(function(res){
      return res.json();
    })
    .then(function(pkg){
      // We have the package.json
    });
});
```

With the package.json we can now inspect your `dependencies` and `devDependencies`. You might be thinking that it's impossible to implement the node_modules algorithm in the browser but it is not, [StealJS](http://stealjs.com/) already does this today.

Ok, now we can fetch the script:

```js
fetch(event.request.url)
  .then(function(res){
    return res.text();
  })
  .then(function(src){
    // 
  });
```

Let's say the script's source code looks like this:

```js
import _ from 'lodash';

...
```

Remember, &lt;script type=module&gt; doesn't allow these bare import specifiers and will throw an error when it encounters them. But since we've intercepted the request we can modify the source code at this point.

Given we have the package.json we can discover that lodash is a dependency and change the source code to be:

```js
import _ from './node_modules/lodash/lodash.js';

...
```

And we'll hear no more complaints. This is basically it, the basis for our algorithm to import an app that uses npm packages. Note that we'll need to recursively fetch every package's own **package.json** as they'll have their own dependencies. But we can lazily do this as we intercept the various script requests and see what packages need to be loaded.

## Dynamic loading

With the hard part out of the way the main thing left is the ability to dynamically load modules. Basically we want to be able to do something like:

```js
var page = location.href.split('/').pop();

switch(page) {
  case 'home':
    IMPORT('/home.js');
  case 'cart':
    IMPORT('/cart.js');
}
```

However &lt;script type=module&gt; only does static importing (importing an entire dependency tree). So we'll have to define our own API for dynamic importing. Above I called this API **IMPORT** which is a hideous name. Here's how you might be able to implement it:

```js
IMPORT = function(src){
  return new Promise(function(resolve, reject){
    var script = document.createElement('script');
    script.setAttribute('type', 'module');
    script.setAttribute('src', src);

    script.onload = resolve;
    script.onerror = reject;

    document.body.appendChild(script);
  });
};
```

And that's really it. We have no way to execute modules ourselves (this capable is part of the WHATWG Loader though), but we can (hopefully) inject type=module scripts into the page dynamically and that's all we really need.

# Caveats with a dash of hope

Note that the basis for all of this is the fetch hook provided by Service Workers. To do more advanced things than outlined above you would want hooks before a module gets executed (maybe you want to set up some globals for example) and &lt;script type=module&gt; just doesn't provide that at all. I don't think you could load CommonJS modules for this reason. But I think some of these issues could be worked around by rewriting the src; CommonJS modules (of which almost all npm dependencies are) could be rewritten in `import` syntax.

With that being said there's some hope here. The fact that &lt;script type=module&gt; is so simple is both a blessing and a curse. It doesn't provide us the power that the WHATWG Loader does, but it's also a lot simpler to understand and most importantly will be available soon. And you really *can* do [a lot](https://github.com/bahmutov/babel-service) with just fetch.

The web has always been the easiest platform to develop for because all you really need is a text editor and a web browser. To "recompile" you just refresh your browser. In the last few years we've kind of lost that and running complex build scripts during development has become the norm. Now with &lt;script type=module&gt; and Service Workers, I'm hopefully we'll get our refresh mojo back.
