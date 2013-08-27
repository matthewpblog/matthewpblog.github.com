; @layout post
; @title Using Cloud Drives on Chromebooks
; @categories chromebook chromeos raspberrypi

tldr; you can't. However what you can do is use an old computer to sync between Google Drive and your other cloud drives, providing (close to) the same effect. I set up a Raspberry Pi, which was previously setting in my basement looking pretty and acting as a Cloud Print server but nothing else, as a WebDAV server which has worked out rather nicely. The one downside is that Chromebooks only support Google Drive as a cloud drive service.

It's rather nice how well Drive is integrated into ChromeOS. And eventually, hopefully, they'll open up an API that allows other cloud services to have similar integration. That would really change the way you think about ChromeOS, pulling it a few steps closer to "real computer" territory.

Alas that's not the case today, but what you can do is take an old computer, or raspberry pi, and have it act as a synchronization server between your services. This will work with Dropbox, SkyDrive, Ubuntu One, or any provider that supports WebDAV.

# Syncing Google Drive to your server

I won't get into how to set up your other cloud services to sync, most either have first or third party clients that are easy enough to set up. As is the case with Google Drive. First there is the proprietary app [Insync](https://www.insynchq.com/) that works pretty well and has added features such as multiple account support. If your needs are simpler then [Grive](http://www.lbreda.com/grive/start) should do the trick, and it is what I use.

On a Raspberry Pi setting everything up was somewhat complicated as it requires several dev packages (strangely including QT4). [This guide](http://www.stuffaboutcode.com/2013/03/raspberry-pi-google-drive-grive.html) does a good job of walking you through the process, although I had to apply the fix shown in [this issue](https://github.com/Grive/grive/issues/168) to get it to finally compile.

Once install `grive` is still a little strange to use. It requires that its binary be stored in the root of Google Drive, and it must be run from within that directory. So just remember that when you want to sync Drive to do `cd ~/googledrive && ./grive` or just create a script that does that for you.

Since `grive` only syncs when you run it you'll want to set up a cron job to do it periodically. Type `crontab -e` and do something like this:

```
*/5 * * * * ~/update-grive.sh >> ~/log/grive.log
```

This tells cron to run the script every 5 minutes. Doing it a little more often probably isn't a problem, I'm just being conservative for now.

# Syncing with other cloud provider

First a word of warning; anything you choose to sync with Drive will exist in Drive; meaning it will count against your storage. For this reason I only sync text files. But it's your storage, do with it what you want.

Once you've set up sync with your other cloud provider you should have a folder on your server with it's contents. It would be nice if a simple symlink did the trick, but alas grive won't sync down changes from Drive that propogate to the symlink's destination.

Instead I'd recommend the handly utility [Unison](http://www.cis.upenn.edu/~bcpierce/unison/) for two-way sync. So any changes you make to one drive will be merged over into the other. I'm not sure how it handles conflicts, but more than likely you won't be editing the same file in two different services at the same time anyways.

Once you've installed Unison you'll want to go through the process of running it through the ui the first time:

```
unison ~/webdav/reviews ~/googledrive/webdav_stuff
```

Remember that there is no source and destination here so it doesn't matter which you list first. After the first synchronization you'll want to run unison silently so that it doesn't prompt you for instructions. You can achieve this with the `-batch` flag:

```
unison -batch ~/webdav/reviews ~/googledrive/webdav_stuff
```

Add this to cron the same way you did previously with grive:

```
*/5 * * * * ~/sync-folders.sh >> ~/log/unison.log
```

And that's it! From now on you can work on your files no matter what computer you're on. When I'm on a traditional PC I edit files on my WebDAV drive, and when on a Chromebook I use Google Drive (which is how I'm writing this article now).

## Conclusion

The recent updates to Chromebooks and the new packaged apps 2.0 is opening a lot of the possibilities to the platform. Additionally it is showing some of the warts, such as the inability to work on files from _other_ sources. Although I think these holes will eventually be filled, in the mean time we need to do workarounds such as this in order to work the way we want to work. I plan on writing about more of these tricks as I use the platform.
