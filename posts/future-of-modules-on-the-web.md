---
title: "The Future of Modularity on the Web"
date: "2016-07-19"
---

Today, modularity on the web is completely broken. The web, in fact, doesn't support modules at all. Since modularity is such an important part of building large applications we have various work-arounds for having modules on the web; module loaders and module bundlers being the big two.

The result of the lack of native module support has led to an ecosystem where the web is mostly an afterthought; a compilation target that you build for. Having worked on a module loader, [Steal](http://stealjs.com/), that attempts to support modules on [npm](https://www.npmjs.com/) I have seen first-hand how the web has become an afterthought. Aside from the module syntaxes that the web doesn't support (like `import` and `require()`) a suprisingly large amount of libraries in the JavaScript ecosystem **depend** on Node.js APIs like `process` and `Buffer` and `EventEmitter` to even run. Popular libraries like [lodash](https://lodash.com) and [React](https://facebook.github.io/react/) even have these types of dependencies, it's not just outliers or backend-focused libraries.

Indeed, you could even argue that the web is no longer JavaScript's primary platform, Node is. As bleak as things seem today, I think the web will regain its position once native module loading is supported.

## script[type=module]

I've written about [script[type=module] before](loading-app-with-script-module), but as a refresher this is an upcoming browser feature that allows you to write JavaScript that imports other JavaScript like:

### app.js

```js
import foo from './foo.js';
```

and then import it into your html like:

```
<script type="module" src="app.js"></script>
```

Which will load and execute the entire dependency tree, finally giving you native module support in the browser. For the first time ever you won't need a build process or a heavy module loader to use modules in the browser.

I think this is going to be huge for the community. Once bundlers and loaders aren't *requirements* they will quickly lose their appeal for a lot of developers. They'll lose their appeal for me.

### Package management

One thing that script[type=module] doesn't do is tell you how to acquire libraries for use in your application; it just loads modules from urls you point to. This means we still will need package managers to provide the ability to share modules with others.

npm is the most popular package manager for web development today. However, most modules on npm will not load in the browser without a build step. Even if you were to change all of the `require()` statements to `import` they would still not load for a variety of reasons including:

* Use of Node-specific APIs like `process` and `EventEmitter`.
* Not including the extension in imports like: `import foo from './foo';`. This can't be loaded by script[type=module] because while Node can try several different extensions to find the module (it will try `./foo.js` then `./foo/index.js` at the very least), the browser can't.

To that end, I think we need browser-focused tooling in this area. Since npm is so large I don't think it makes sense to build a new package manager from scratch the way [jspm](http://jspm.io/) does, nor do I think it makes sense to support every Node.js quirk in the browser the way we do today with [StealJS](http://stealjs.com/).

Instead what we really need is a tool that integrates with the npm repository to:

* Put modules in a folder structure that makes sense for the web (it needs to be flat).
* Rewrites CommonJS `require()` syntax to ES `import` syntax (Over time this feature can go away and more and more modules convert to `import`).
* Rewrites import statement identifiers to point to where the modules actually are; meaning if the identifier is `./foo` change that to `./foo.js`. If the identifier is `jquery` change that to `../path/to/jquery/jquery.js`.
* Resolves semver conflicts and give the user a chance to deal with them (I'm not exactly sure how so some handy-waveyness here).

This type of tool would be non-trivial to create, but the investment will be worth it because once users regain the ability to ctrl/cmd+f5 to refresh, they won't want to go back to the old, bulky ways of module loading.

## HTML imports

HTML imports are a feature that have come out of Web Components. They allow you to import HTML into your page like:

```
<link rel="import href="./foo.html">
```

Think of this as the HTML equivalent of script[type=module]. The primary purpose of an HTML import is to allow you to package up a template, CSS, and JavaScript together so that users of your widget only need to load your distributed html file.

We try to simulate this today with bundlers/loaders that support things like `require('./styles.css')`. These plugins will load CSS and instead of executing it as JavaScript they will inject the CSS into the page. While useful this is a bit of a hack.

HTML imports get things more correct; HTML already has mechanisms for loading JavaScript (`<script>`) and CSS (`<link rel="stylesheet">` or just `<style>` tags) so it's the natural *entry point* for loading a widget. A widget, **tabs.html**, might look like:

```html
<template>
  <ul class="tabs">
   <li class="tab">
  </ul>
</template>
<link rel="stylesheet" href="./tabs.css">
<script type="module">
import util from '../util.js';

// Make your tabs widget here
</script>
```

Unfortunately only Chrome and Opera currently support HTML Imports. Other browsers are waiting to see what happens with ES Modules before looking into HTML; hopefully they will quickly realize that the two go well together and implement HTML Imports, or something like it.

## Opportunity

When the web finally catches up with other platforms and provides a native way to load modules (whether they be JavaScript or HTML) it will open up opportunities to tooling authors. I already talked about package managers and how they will need to become more focused on the web browser as being the loading mechanism.

Additionally I can see opportunity for:

* Service Workers which do things like aggressively pre-fetch resources that you know are needed for a page.
* Build tools that analyze the dependency graph and creates seperate bundles that can be loaded in production by script[type=module] to reduce the number of network requests.
* Tools that will analyze the dependency graph and provide metadata that an HTTP2 server can use in order to HTTP Push all resources needed for a page.
* Service Workers that transpile code written in another language to JavaScript before it is executed by the browser's module system.

## Regaining focus

At the beginning of the article I stated that the web has lost its position in the JavaScript community. Not in terms of users or even developers, but in terms of *focus*.

When native module support lands in browsers it will bring such a drastically simplified workflow that we'll see an explosion in interest in web development. No longer will new developers give up when they can't figure out how to configure WebPack, or when they aren't sure what Babel plugins to install.

This will provide more potential users for all web library authors.
