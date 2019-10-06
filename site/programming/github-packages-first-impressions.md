---
layout: post.njk
title: First Impressions of GitHub Package Registry
date: 2019-10-06
tags: post
permalink: programming/github-packages-first-impressions.html
description: My first impressions after trying out the GitHub Package Registry.
---

I recently received an invite to GitHub's new [Package Registry](https://github.com/features/package-registry) and have been itching for an opportunity to try it out. For those unaware, GitHub Package Registry is a new feature that allows publishing packages for many programming environments including  RubyGems, Maven, and npm. I was most interested in npm.

For context, when I worked on [Robot](https://thisrobot.life/) I was unable to get the package name `robot` because it was being name squatted. The same for `robot2` in fact! So I went with `robot3`.

I didn't go through the conflict resolution process because I previously attempted that on another project back in August and have still never received a reply from npm (other than the initial automated reply). It seems that company turmoil is affecting their custom support.

So being a little bitter I strongly considered the idea of just releasing my projects under scoped names from now on. I like the idea that GitHub *only* has scoped package names, so there's less of a "land grab" for good names.

## Publishing a First Package

In one of my side projects using [Eleventy](https://www.11ty.io/) I had a need to build a plugin. It seemed like a plugin that was very specific to my needs and not necessarily something that others would find useful, and probably not something I wanted to maintain in a very public sort of way. To me this is a great use-case for a scoped package.

Previously I've published scoped packages to npm, but this gave me a great chance to try out GitHub Package Registry. So I created a new repo, threw in a `console.log('hello world')` and tried to publish.

The [directions for publishing](https://help.github.com/en/articles/configuring-npm-for-use-with-github-package-registry#publishing-a-package) are fairly good, but for me it didn't work the first time. I actually published it to npm by mistake. Oops! I was able to get it to work the second time when I added the [publishConfig](https://docs.npmjs.com/files/package.json#publishconfig) option. I'm not sure if that's required or not, but it was for me.

After publishing I tried to add the package to the project that needed it. Again here the documentation was quite good, but again it didn't work the first time. I had to blow away my `node_modules/` as well as the `package-lock.json` and then it finally did work.

## Pitfalls

I ran into a few pitfalls along the way but overall the experience was fairly seamless. Some problems I experienced:

* It instructs you to add your access token to a `~/.npmrc` file, but for me that file already had a token for the npm registry. Was I supposed to remove the other token? Is it one per file? This was unclear. I eventually did remove the other so now I'm not sure if that means I won't be able to publish to regular npm or not.
* Unable to install in an existing npm-based project. This one makes sense after thinking about it. If you have an existing project that is using npm as the registry you first need to delete your package-lock.json so a new one can be created. Once you do that it works well.
* Doesn't work with [pnpm](https://pnpm.js.org/). The project I was installing into used pnpm but I was unable to get pnpm to work. It uses the same configuration files as npm so I'm not sure why. It could very well be my fault. This makes me curious if it works with [Yarn](https://yarnpkg.com/lang/en/) or not, I didn't try it.

## Conclusion

After having used it in a test I definitely think I would try it again. One key feature is that GitHub Package Registry actually *proxies* npm, which means you can use npm packages in your GH projects. Whether you can depend on GH packages in your npm packages is a bit more blurry to me, probably not.

I see this as particularly useful for private packages, since this way you don't have to worry about maintaining a separate npm account, it all goes through GitHub.

Another question is whether I would use it for open source projects and the answer there is *maybe*. At least for open-source projects that are small in scale and I don't care if they become popular or not, this becomes more and more enticing. We'll see.

Would recommend. 👍