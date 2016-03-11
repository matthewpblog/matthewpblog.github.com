+++
categories = "stealjs modules javascript"
date = "2015-10-08T00:00:00.000Z"
slug = "how-hot-swapping-works"
title = "How hot module swapping works"

+++

[Steal](http://stealjs.com/) added hot module swapping (aka live reload, aka hot module replacement) about 6 months ago, but how it works isn't obvious, so I thought I'd write about it. You can read more about the feature and how to use it [here](http://blog.bitovi.com/hot-module-replacement-comes-to-stealjs/).  This article is more technical and explains what happens under the hood. Don't worry, there's nothing overly complex here and it's rather easy to understand once you understand dependency graphs.

## Dependency graph

When you load your app using Steal (or any other module loader) it saves the modules in a registry.  A registry is just an object where the keys are the module names (like **lodash**) and the values are the module values (like a function or an object; whatever it is you export from the module).

With Steal we retain another data structure that lists modules (by their module name) and metadata about them, specifically what their dependencies are. We call this the **dependency graph**.  It looks something like this:

```js
{
  "lodash": {
    "dependencies": []
  },
  "jquery": {
    "dependencies": []
  },
  "my/custom/element": {
    "dependencies": ["jquery", "lodash"]
  },
  "my/main/app": {
    "dependencies": ["jquery", "my/custom/element"]
  }
}
```

It's pretty simple.  Each key is a module name and the value is an object that contains metadata; most importantly is an array of the module's dependencies.

## File watcher

To know when a module changes we need a server that watches for file changes. This is what happens when you run `steal-tools live-reload`.

The live-reload server gets the dependency graph of your project and listens for file changes to each module. The dependency graph shown above also has a property called **address** that is the path to the module's file. We add a file watcher to every file in the graph so that we know when work has been saved.

When you open a page in your app with the live-reload server running it establishes a connection to that server with a [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API). By default it uses port 8012.

The file watcher will see changes to the files in the dependency graph and send a message through the WebSocket back to the browser with the name of the module that changed.

## Tearing down the graph

Back on the browser side, it receives the WebSocket message with the name of the module that changed. Since the module changed we need to re-import it. But we also need to re-import it's parent modules (the modules that import it) and the parent's then need to import their parents, etc. all the way up the graph.

This might sound wrong to you; why do you need to re-import the parent modules?  Consider this example:

### Module A

```js
module.exports = function(){
  return "foo";
};
```

### Module B

```js
var moduleA = require("module-a");

moduleA(); // -> "foo"
```

And then consider that module A changes to this:

### Module A

```js
module.exports = function(){
  return "bar";
};
```

If we don't re-import Module B then it will continue to have a reference to the old Module A function that returns "foo". In JavaScript once you have a reference to an object or a function that reference can never be changed by external code.

So to solve this we simply walk up the dependency graph and get a list of modules that need to be reloaded. Consider the original example graph:

```js
{
  "lodash": {
    "dependencies": []
  },
  "jquery": {
    "dependencies": []
  },
  "my/util": {
    "dependencies": []
  },
  "my/custom/element": {
    "dependencies": ["jquery", "lodash", "my/util"]
  },
  "my/main/app": {
    "dependencies": ["jquery", "my/custom/element"]
  }
}
```

Let's say my/util changes. Its only has one parent (the modules that depend on it), my/custom/element. However my/main/app depends on my/custom/element so we have to reload that as well. We tear down the graph by removing these modules from the registry. Afterwards the graph looks like:

```js
{
  "lodash": {
    "dependencies": []
  },
  "jquery": {
    "dependencies": []
  }
}
```

Just lodash and jquery remain. We reimport the top-level parent module after walking all the way up the graph, in our case it is my/main/app. By reimporting the top-level parent it will reimport the modules that have been deleted from the registry, here it is my/custom/element and my/util. However any other dependencies, such as jquery and lodash, are not reimported because they are already in the registry.

Steal contains several optimizations that makes the reloading blazing fast. For most changes you'll see your changes reflected in under 100ms.

The basic operation of what Steal does to reload modules is quite simple. The hard work comes from plugins and code that use the live-reload APIs. In the future I'd like to write a bit more on what these plugins do and how *they* work as well.