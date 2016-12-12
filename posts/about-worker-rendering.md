---
title: "Thoughts on Worker Rendering"
date: "2016-12-12"
---

I've been thinking a lot about web worker rendering lately. If you haven't heard of the term, worker rendering refers to using a [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker) to calculate a page's UI, leaving the main thread (what I usually refer to simply as the **window**) only for patching changes and handling events.

Last year I wrote a library, [worker-render](https://github.com/canjs/worker-render), which allows you to run jQuery apps in a web worker and have changes be automatically synced with the window. I've talked to others (mostly via Twitter) who have also tried out worker rendering. Most of these types of projects (including worker-render) fizzled out.

Lately I've been thinking more about the topic as new data has come out about mobile performance. I'm also experimenting again with new approaches. I plan on writing more about the topic as I continue to explore, but I first wanted to get out my initial thoughts on what worker rendering is trying to accomplish and why it has (thus far) not caught on.

## Why Use Workers for UI

Modern JavaScript applications (single-page apps especially) need to run a lot of code to boot up. This works includes things like generating a component tree and setting up event listeners. Often times the cost is mostly up-front, but not always, virtual DOM frameworks need to do a lot of work to diff their virtual trees, and data-binding frameworks need to do a lot of work to generate data change events. There are ways to mitigate the cost, of course, but that doesn't mean its easy, and you have to be diligent.

As apps scale or you do things like add a component per table cell, you can start to run into performance problems. Many JavaScript APIs are dangerous to use, even those [built not to be](https://twitter.com/slightlylate/status/803368667123740678). There are only 2 CSS properties that are safe to animate. You shouldn't need to know these things to create fast websites, *but you do*. It's sad, our jobs as web developers are really hard.

Worker thread rendering doesn't make the hard things any less hard, it just gives you more space to operate. Most approaches to worker rendering are based on the idea that your *app*, the overwhelming majority of the code that you actually write, will be run in a worker. This means that if you do something bad and make a mistake, the worst case is that it's at least running off-thread and not causing page jank.

If you can focus on your domain knowledge and let the hard part of figuring out how to effectively render in the hostile `window` environment to experts, that would be a huge win for everyone.

## Why Worker Rendering Hasn't Taken Off

Given the benefits you would think that we'd see more of this happening in the wild by now, but we haven't. There are downsides to worker rendering that are worth mentioning namely:

* Event handling has to be different. Events are synchronous and you have to decide if you want to `preventDefault` or `stopPropagation` immediately. Since Workers are off thread and are communicated with using messaging (asynchronously), you can't make that decision. So your worker rendering framework has to make it for you. A lot of code is required to try and make this work, it can come close but there are caveats abound.
* The debugging experience is worse. If you use something like React you probably use devtools extensions. None of this will work if your components run in a worker. There's a disconnect between the components that you write and the DOM that is rendered.
* The performance isn't that much better (and is often worse). At least in the types of benchmarks that we usually write. Worker rendering is about protecting worse-case-scenario (that is actually all too common in the wild) but that's hard to reproduce in example apps.

All in all, people experiment and find that the cost outweighs the benefits. A common thread that I've noticed is that there is an **uncanny valley** when it comes to worker rendering. That's what happens when you take a model (components) that's built for one environment and try to transport it to another.

Which brings me to my final point today...

## A Different Paradigm

I believe that for worker rendering to find its feet, it needs to be built on a new abstraction. Not the same abstractions where we have direct access to the pixels our users see. 

What we need, is worker-first libraries.

A worker-first library would have an abstraction that assumes async. It *might* let you work with a proxy for DOM nodes, but it might not. I'm inspired by several ideas, new and old:

* Smalltalk, which introduced MVC. I can see strong **controllers** playing an important role here.
* [AnimationWorklet](https://github.com/WICG/animation-worklet) which allows animations to be performed off-thread.
* Traditional server rendering which has no access to the DOM but still allows for fairly sophisticated applications.

As I explore this domain more I want to continue to write about my experience. I'm playing with the idea in a project I call [fritz](https://github.com/matthewp/fritz). I plan to iterate on ideas rapidly, so what you see there today will likely not survive to what it will look like even a month from now.

I'm excited to talk to others who are trying out similar ideas, so we can share in what works and what doesn't. Hit me up [on Twitter](https://twitter.com/matthewcp)!
