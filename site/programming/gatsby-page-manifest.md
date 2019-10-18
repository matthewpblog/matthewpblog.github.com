---
layout: post.njk
title: Writing on your Gatsby blog leads to JavaScript bloat
date: 2019-01-17
tags:
  - post
  - noindex
permalink: programming/gatsby-pages-manifest.html
description: Every time you post to your Gatsby blog your JavaScript grows by 100 bytes.
---

> <time>10/18/2019</time> update: The issue outlined in this post was fixed [a few months ago](https://github.com/gatsbyjs/gatsby/issues/4746). The page in question now loads 10 page-data.json files totally __256kB__ instead. I haven't dug into how this affects performance. This post remains to highlight some of the problems that can arise with using SPAs for static sites.

Gatbsy's popularity as a blogging platform has been rising rapidly over the last year or so. If you aren't familiar, Gatbsy is built on top of React and allows you to build your blog (or any other type of site I imagine) as a single-page app using React.

Using the SPA method on a blog may sound odd to many, but it shouldn't be surprising given how the SPA has become the hammer of web development. In any case I was curious to see how this affected performance.

So I'll just cut to the chase; every time you create a new post or page in your Gatsby blog a manifest file that contains metadata about every page grows by roughly __100 bytes__ (being generous on this number).</p>

You can see for yourself, look at [Gatbsy's own blog](https://www.gatsbyjs.org/blog/2019-01-14-modern-publications-with-gatsby-ghost/) for an example. Their manifest is __103KB__.

This file looks like so:

```js
(window.webpackJsonp = window.webpackJsonp || []).push([[33], {
  696: function(a) {
    a.exports = {
      pages: [{
        componentChunkName: "component---src-pages-index-js",
        jsonName: "index",
        path: "/"
      }, {
        componentChunkName: "component---src-pages-404-js",
        jsonName: "404-html-516",
        path: "/404.html"
      }, {
        componentChunkName: "component---src-pages-404-js",
        jsonName: "404-22d",
        path: "/404/"
      }, {
        componentChunkName: "component---src-templates-template-docs-markdown-js",
        jsonName: "readme-445",
        path: "/README/"
      }
      ...
```

And of course this goes on and on to contain every page on your site. This means that with every new post this config grows by another object (and there's also another mapping further down in the file). Every page on the site loads this metadata file.

All in all, the Gatsby blog loads 424kb of JavaScript on this particular blog post. The result is that when viewing on a 3G connection there is a *jump* that occurs after the code has loaded that pushes the user back to the top of the page. Below is a video of what that looks like.

<figure>
  <video controls autoplay>
    <source type="video/webm" src="../images/gatsby-manifest/jump.webm">  
    <source type="video/mp4" src="../images/gatsby-manifest/jump.mp4">
  </video>
  <figcaption>Jump caused by slow loading JavaScript.</figcaption>
</figure>

I went back on forth on whether I should write about this problem or just let it go. Ultimately I decided it was fair to do so for two reasons:

* Gatsby is a VC backed startup.
* They are gaining significant ground as a blogging platform. Any problems Gatsby has will affect all readers of the web.