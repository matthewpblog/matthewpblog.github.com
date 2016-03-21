---
title: Removing a Folder on Windows
---

I don't use Windows as my main OS any more, but still do use it regularly enough to test out libraries I work on. One thing I regularly find frustrating is trying to remove a large folder. Using Explorer always seems to be slow, and I'd prefer to use the command-line anyways. On a Unix machine a simple `rm -rf folder/` does the trick. 

## rmdir

The answer you'll typically see in [StackOverflow answers](http://stackoverflow.com/questions/186737/whats-the-fastest-way-to-delete-a-large-folder-in-windows) is to use rmdir, specifically:

```
rmdir /s /q folder
```

The **/s** makes it be recursive and **/q** makes it be quiet. This will still fail when there are large file names, something you often see with Node projects. Usually at this point I give up and open an Explorer window in Adminstrative Mode and delete it that way.

## rimraf

I had long since accepted my fate when I learned that [rimraf](https://github.com/isaacs/rimraf), a Node module I already use, can be installed as a global and used to remove anything at all:

```
npm install -g rimraf
```

Then to use:

```
rimraf folder/
```

I haven't tried to compare it with `rmdir` in terms of speed, but it feels fairly fast to me. Even if it's a bit slower, the fact that it seems to "just work" without getting errors for long file names or anything else, is enough for me.
