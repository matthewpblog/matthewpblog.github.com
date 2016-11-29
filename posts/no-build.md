---
title: "No Build"
---

Builds as part of development workflow hinder your ability to write small, well tested, modules. When you use need to always build you tend to do all of your development within the full application. In order to test out a widget you are currently working on you need to drill down to where that widget exists, test out your changes, and repeat. This makes for a poor feedback loop. There are a variety of tools that have been created to workaround this problem that builds create; hot module swapping is one, stuff like [React Storybook](https://github.com/storybooks/react-storybook) are another.

Without the shackles of a build process, you can develop your widgets in isolation easily just by creating new HTML files. Create `widget.html`, add the necessary scripts and styles, and develop. I've talked with various people in the React/WebPack ecosystem and they tell me that working on a widget in isolation either means bootstrapping a new repository or using one of these framework-specific libraries mentioned before.

HTML is really one of the most underappreciated tools we have on the web. If your framework makes creating new HTML pages cheap, you're more likely to have robust, well tested modules.

I'm not against builds as a production optimization. I still use builds to minify my code, to create service worker scripts and to do various other things that will make my sites just a little bit faster for the end user.
