---
layout: post.njk
title: Towards a Post HTML Web
date: 2019-11-24
tags: post
permalink: programming/a-post-html-web.html
description: Recent criticisms of web components have highlighted the limitations of HTML as it is today and raised the question of whether the will exists to fix them. A replacement might be a more likely candidate.
---

The web component debate is has risen its ugly head again on Twitter this weekend. This time I chose not to participate because having done so in the past my feeling is that it is an ultimately fruitless endeavor. Rather than letting the toxicity engulf my weekend I chose to ignore it, and for the most part I was able to do so.

I feel that writing in a permanent place that I own is a good way to spend the energy that exists within me on this topic. There are legitimate problems with web components, and the people speaking them have highlighted some of those things.

However, upon close examination most of the criticisms boil down to problems with *HTML*. Since custom elements is an API for extending HTML it naturally inherits all of the strengths and weaknesses of HTML.

## The Problems with HTML

Some of the criticisms I've read include:

* HTML has __attributes__ and elements when used from JavaScript also have __properties__ (like all JavaScript objects). This is due to the fact that HTML does not have types likes strings or numbers or objects. So the thing on the right-hand side of an attribute is considered a DOMString, it's not an identifier to something else like you have in JavaScript.
* HTML cannot be placed inside of SVG. *Note* that while people say you can't put web components inside of SVG it's actually the case with other HTML elements as well. If you put a `div` inside of SVG it will end the SVG element and be placed as a sibiling. This is because HTML and SVG do not have a unified parser.
* All new elements have to be closed. Self-closing custom elements are not possible.

Those are some of the direct problems. But the *real* problem is why these problems exist in the first place.

Having read dozens of discussions on the above over the years my impression is that there is not much desire to make changes to the HTML parser (which is the source of these issues). Security is often cited as a reason to be cautious about HTML parser changes.

## HTML Probably Won't Be Fixed

I've recently read a suggestion that perhaps a bundle of changes could all be done together at once. I think of this as an *HTML 6* level change. This only came from one browser vendor and they were not volunteering to lead the initiative.

I haven't seen anything else to indicate that other browser vendors are interested in leading or even accepting such an idea. Apple, which effectively has a veto-power on web standards (and has used it in the past), seems most resistent. This is not a criticism, just an observation.

Another idea that I have seen floated is an update to XML that fixes some of the problems that HTML has. This is from Anne van Kesteren of Mozilla and he calls it [XML 5](https://annevankesteren.nl/2019/10/case-for-xml5). This seems like an interesting idea because HTML doesn't have to be well-formed. Not being well-formed is the primary reason why it can't be (easily) updated.

The XML 5 idea might fix many of the issues with HTML but it doesn't address reactivity which is the major ask that web developers have. With that being the case I question how much enthusiasm and adoption it would receive.

## If not HTML, What?

HTML might be unfixable, or more correctly the desire to fix it might not be there, which is effectively the same thing. If we posit that it won't be fixed we have to start looking for a replacement.

Recent developments in the native app world include new types of UIs built for reactivity such as [Swift UI](https://developer.apple.com/xcode/swiftui/) and [Jetpack Compose](https://developer.android.com/jetpack/compose). Both of these allow you to define tree structures that are bound (reactive) to values. This is the thing everyone wants on the web and the reason people use frameworks. Swift UI looks like this:

```swift
List {
  ForEach(menu) { section in
    Text(section.name)

    ForEach(section.items) { item in
      Text(item.name)
    }
  }
}
```

This works great for reactivity but a replacement for HTML needs to be more than that. A key advantage to HTML is that it can be processed while streaming in. The browser is able to start painting the page before the page is fully downloaded. Giving that up for better reactivity would be a huge loss, but it might be our only choice.

I'd love a replacement that embodied the good qualities of HTML like streaming and also addressed the lack of reactivity, but I haven't been able to find any prior art for such a system. Maybe I just haven't looked hard enough.

As much as I would like to end this post on a positive note, I'm not sure that I can. Things look pretty bleak from where I sit. It seems rather likely that we are going to continue spinning our wheels for the forseeable future. By the time the will exists to act on a replacement, it might be too late for the web.