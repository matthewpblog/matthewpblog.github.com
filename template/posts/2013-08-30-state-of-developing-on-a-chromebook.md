; @layout post
; @title State of Developing on a Chromebook
; @categories chromebook development chromeos

I've been developing on a Chromebook for quite a while so I feel I have a pretty good grasp on the strengths and weaknesses as they exist today. The tldr; is that, yes, you can develop on Chromebook and depending on what you consider to be "developing on a Chromebook" the experience can either be on-par with other computers or a tad... funky.

To start, I want to clearly define what it means to "develop on a Chromebook" because it's important to the conversation. There are 4 routes that you can go. I won't spend a lot of time on the first 3 as they are obvious and less interesting to discuss, but the 4th is where the meat of this post belongs. Without further ado the four methods are:

## **[Crouton](https://github.com/dnschneid/crouton)**

This gives you a chroot environment with which you can install Ubuntu and do whatever you want. Some people really like doing this. Which is fine, but at this point you're not really using ChromeOS to develop on, even if you do dual-boot.

## **SSH**

Using [Secure Shell](https://chrome.google.com/webstore/detail/secure-shell/pnhechapfaindjhompbnflcldabbghjo?hl=en), a Native Client enabled SSH client, you can login into a remote computer and work using usual command-line tools like Tmux and Vim. This is currently the primary way I code on a Chromebook. While it works rather well, it's not always ideal as, for example, it's difficult to develop Chrome packaged apps this way. Getting the `crx` file from your server to your Chromebook is tricky.

The best way to work this way is to use [Grive](http://www.lbreda.com/grive/start), a Google Drive sync client for Linux. Once you've created the `crx` simply copy it to a folder in Drive. From there you can open the file in Chrome's File Manager and it will prompt to be installed. Still, this is a slow process, as the file has to be uploaded to Drive, then downloaded back down from Drive on the Chromebook and installed.

But for certain types of programmers, particularly system programmers, who are always programming from an ssh session anyways, this works out as well as any other computer. Perhaps even better, Secure Shell is a very slick "terminal emulator" (for the lack of a better term).

## Web IDE

This is the first *real* way to program on a Chromebook. For a lot of people this works nicely. There are a lot of choices out there, two that stand out are [Cloud9](https://c9.io/) and [Nitrous.io](https://www.nitrous.io). I have used Cloud9 a bit and it works rather nicely. For people who are used to using desktop IDE's like Eclipse then this might work well for you. My only complaint is that when you use a SaaS client you kind of have to use it for everything. That's just not my style though. I prefer a seperate application for each task, that way I can swap out the pieces I don't like. With a Web IDE if you don't like any one piece your own recourse is to switch to an entirely different IDE.

## Working locally

Which brings me to the last way to work, the most interesting way to work, and the most frustrating way to work on a Chromebook. Despite the complaints that are to follow I want to make it clear that the future looks bright for this category. There are many applications and APIs under development (as I'll discuss) that are going to dramatically improve the experience of developing locally on a Chromebook.

Since packaged apps are still in their young days there aren't a million options for text editors, but there are already a few. The best of which is probably Google's own [Text](https://chrome.google.com/webstore/detail/text/mmfbcljfglbokpmkimbfghdkjmjhdgbg?hl=en) (of which I'm an inactive contributor). It's not great, but it's just fine for the earlier stages of things.

However, you run into trouble when you start thinking about workflow. This is the area that Chrome needs to round out with better APIs. Let's say you are starting a new project on your Chromebook, where do you store it? Well, on many Chromebooks there is little hard drive space so having a lot of development projects on it might be a bad idea (my Chromebook considers it's entire hard drive to be a "Downloads" folder, indicating that it is intended for temporary storage only). The alternative is to use Google Drive, which is probably the best option for now. You can even mark files as available offline in Drive and not have to worry about losing an internet connection.

This is still not quite ideal, though. Drive is limited, you have to manage how much stuff you keep there. And perhaps your work uses Dropbox. There is no way to use Dropbox (besides the web app) on a Chromebook. This is why I've long wanted an API for filesystems, so that WebDAV or Dropbox or whatever can live right beside Google Drive in the File Manager and file picker menus. Luckily there has been some movement on this issue lately with some Googlers [discussing the idea](https://docs.google.com/document/d/1VkaRYDP3RMESygl6Po0ajimXqijejZNF2p9rCszYEew/edit). It's not evidence that it will be coming soon, it's just a positive sign that they are thinking about the same things.

Even if you are able to develop locally how do you share that code? How do you use source control? This is one area where things look positive. The developer Tim Caswell has been working on [js-git](https://github.com/creationix/js-git), a reimplementation of `git` in JavaScript (including the use of Chrome socket APIs) for the past few months. Although still in early stages I can see this project becoming very usable in the near term.

Suddenly the workflow starts to look a bit nicer. Imagine have a Git web-app (powered by `js-git`) that manages a git repo, then doing developing with Text or another editor, then going back to the git app to commit and push. What would be even better is if a git repo could become a "filesystem" that sits in the filepicker. That way it could be always connected (perhaps a save operation prompted a commit) and therefore always up to date in the cloud.

This just leaves out one area of a developer's workflow; testing. If you're developing for the browser you're in luck ;) There's a nice one sitting in front of your face. For everyone else... perhaps a Chromebook isn't what you need. Still, it might be possible in the future to compile a small linux environment like busy box down to a JavaScript blob and even install things like Python on it. I'm getting a bit a head of myself, and those things would (likely) never be very fast, but it's something we can see happening. Certainly languages that compile to JavaScript are already flourishing, and most have the ability to compile within a browser, so as long as you are using browser APIs you're set.
