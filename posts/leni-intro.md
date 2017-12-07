---
title: "Leni - A small library for worker communication"
date: "2017-12-06"
---

> __tdlr;__ check out [leni](https://github.com/matthewp/leni), a low-level tool for communicating with web workers.

Web Workers are one of the most underused features on the web. There's a strong chance that if you're reading this you're an experienced JavaScript developer. There's an equally strong chance that you've never used Web Workers. I barely have, and I go out of my way to look for reasons to use them 😅!

One of the problems with Workers is that they are weird to communicate with; a single event `message` is how all communication is done. If you want your Worker to do more than just 1 thing, this means clumsy code like:

__app.js__

```js
let worker = new Worker('./worker.js');

worker.postMessage({
  type: 'ADD_ONE',
  value: 3
});
```

__worker.js__

```js
self.addEventListener('message', function(ev){
  let msg = ev.data;

  switch(msg.type) {
    case 'ADD_ONE':
      addOne(msg.value);
      break;
  }
});

function addOne(num) {
  let value = 1 + num;
  postMessage({
    type: 'ADD_ONE_RESULT',
    value
  });
}
```

These sort of switches are then required on both sides.

What is this really doing, though? These are just events, right? You listen to events and emit events.

## Leni

A new library I wrote called [leni](https://github.com/matthewp/leni) removes all of this boilerplate, and lets you more easily save state within a worker.

It does this by providing a string *tag*. You can think of a tag as just an identifier for a particular event emitter that you want to be created on the other side.

This helps you organize a set of functionality around a given *tag*. It works like this:

__app.js__

```js
import { connect } from 'https://unpkg.com/leni/leni.js';

let worker = new Worker('./worker.js');
let ee = connect('calculator', worker);

ee.addEventListener('value', val => {
  // val is 7
})

ee.post('state', 3);

ee.post('add', 4);
```

__worker.js__

```js
importScripts('https://unpkg.com/leni/leni.js');

function makeCalc(ee) {
  let state;

  ee.addEventListener('state', val => {
    state = val;
  });

  ee.addEventListener('add', function(num){
    state += num;
    ee.post('value', state);
  });
}

leni.subscribe('calculator', makeCalc);
```

As you can see from the above, leni is very low-level, and only handles creating instances of event emitters. Every time you call `connect(tag, worker)` a new emitter will be created both in the main thread and within the worker.

Given this, we can add more abstractions on top. I can imagine using proxies to make these events feel more like direct method calls:

```js
import { connect } from 'https://unpkg.com/leni/leni.js';

function proxyToWorker(emitter) {
  return new Proxy({}, {
    get(target, key) {
      return new Proxy(function(){}, {
        apply(target, thisArg, args) {
          return new Promise(resolve => {
            emitter.addEventListener(`${key}-response`, resolve);
            emitter.emit(key, args);
          });
        }
      });
    }
  })
}

async function startApp() {
  let worker = new Worker('./worker.js');
  let ee = connect('calculator', worker);

  let calc = proxyToWorker(ee);

  let value = await calc.addOne(3);
}

startApp();
```

Please check out Leni and let me know what you think. You can find me on Twitter as [matthewcp](https://twitter.com/matthewcp).
