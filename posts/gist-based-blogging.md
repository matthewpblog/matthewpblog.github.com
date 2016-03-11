+++
categories = "blogging"
date = "2015-09-03T00:00:00.000Z"
title = "Building a gist-based blogging tool"

+++

## Motivation

For the past several years I have been using [Cabin](http://www.cabinjs.com/) for my personal blog. Cabin works like most other static site generators in the vein of [Jekyll](http://jekyllrb.com/); you write your posts in markdown in a posts folder, your templates in a template folder, run a script and it generates the HTML for your blog. Simple enough.

The problem I've always had with this setup is that it has just enough friction that I wind up not blogging as often as I would like. During your "draft" stage you still have most of the same steps as when you finally deploy. You have to clone your site, create a branch to write a new post in, write, commit and push. When I have inspiration to write I want to just write, not manage a project.

So what I usually do is write my posts in Gist or Google Docs and then move them to my site project when I'm done. I started thinking, what if I could remove the blog engine entirely?

My first thought was to set up a server that just served Gists directly. To this end I set up an [Express](http://expressjs.com/) server that did exactly that.  I had a Gist that I [used as my index](https://gist.github.com/matthewp/695b163d39f68ec73678) of all Gists I wanted to be served. The front page was just a list of links to each article with the url containing the Gist id.

To make this work with my existing posts I needed to convert them to gists. This was more work than I expected. Cabin uses a non-standard front-matter format. Most blog engines use YAML but Cabin uses a JavaScript-like syntax.  I would have expected it to be JSON but it's not, the keys are not strings. To figure out how they did this I had to dig through their source and found it [buried in a Grunt task](https://github.com/CabinJS/grunt-pages/blob/4cd264fce21fb8d90198edadeccb3961b37537bc/tasks/pages.js#L269). It was easy enough to extract this code and reuse it for my needs. Each gist contains the markdown content (minus the front-matter) and a `metadata.json` file containing the front-matter (now json).

This all worked well enough but I felt uneasy about pulling directly from Gist to serve the blog posts. It just felt wasteful, even if I included caching that prevented it from fetching the gists on each requests. Additional it broke my old links. I played around with the idea of having a "slug" that would serve as the id for a post, but this meant I would need to pull that index gist to find out which gist id the slug referred to. Again, not terrible, just more code than I wanted.

## One thing well

I've always been a fan of the Unix philosophy of doing one thing well, so I started to think why not construct the posts using basic cli tools already available. You can easily pull down a gist using the GitHub API and then use a series of other tools to generate the html. The full bash script can be seen below, but here's the pseudo-code of what happens:

```shell
curl https://api.github.com/gists/$GIST_ID | \
jq '.files[.files | keys[0]].content' | \
marked | hb -i post.handlebars
```

It's pretty simple, let me explain what easy step does:

### curl api.github.com

Luckily pulling down gists is really easy with the GitHub API. Unless you are doing it a lot, and likely programmatically, you don't even need to set up an auth token, but you can do this if you want. It returns a JSON containing a lot of data, but we really just want the post content.

### jq

[jq](http://stedolan.github.io/jq/) is an amazing command-line JSON parser. In its simplest form jq can be used as a prettifier, but you can do advanced stuff to extract just the parts that you need.

Its power is shown here because the gist JSON structure makes it slightly difficult to extract the post content. This is because instead of having an array of `files` it has an object where the file name is the key. This is fine for when you know the name of a file, but in my case I just wanted to assume that the first file in a gist is the markdown.

Lucky jq can easily handle this. Consider the structure is like this:

```json
{
  "files": {
    "foo.md": {
      "something": "else",
      "content": "# Title\nsome test\n* a list"
    }
  }
}
```

With jq you can run `jq '.files[.files | keys[0]].content'`. This gets `.files` and then uses the `keys` function to get all of the keys of the files object and uses the key indexed 0 to get the "foo.md" object and finally we want `.content` which is the markdown.

### marked

[marked](https://github.com/chjj/marked) is the premier markdown compiler (to html) for JavaScript. Luckily it include a command-line tool that takes markdown from stdin and spits out html to stdout. Perfect.

One downside is that it doesn't include a way to highlight code. If using the Node.js API you can set options which includes using a highlighter of your choice. I usually use [hightlight.js](https://highlightjs.org/). With that the code would be something like:

```js
var marked = require("marked");

marked.setOptions({
  highlight: function(){
    return require("highlight.js").highlightAuto(code).value;
  }
});
```

This is an [open issue](https://github.com/chjj/marked/issues/110) about how this could be used with the cli. My suggestion was to provide a module that exports options. This way you could write the above code as:

```js
var marked = require("marked");

module.exports = {
  highlight: function(){
    return require("highlight.js").highlightAuto(code).value;
  }
};
```

And feed that option into the `marked` cli.  It becomes:

```
cat my-post.md | marked --options /path/to/options.js
```

They [haven't yet accepted](https://github.com/chjj/marked/pull/613) this change but I do have it working in my own fork.

### hb

Having gone from gist into json into markdown into html, the final step is to run the produced html through a template engine so that the article is contained within a full page. Since I'm already very familiar with the Mustache syntax in my day job I decided to use [handlebars](http://handlebarsjs.com/) for templates. A simple post template can be:

```handlebars
<html>
<head>
  <title>{{title}} | My Blog</title>
  <link href="some.css" rel="stylesheet">
</head>
<body>
  <article>
    {{{content}}}
  </article>
</body>
</html>
```

We just need to feed the generated html through this template to generate a post. I couldn't find a project that did exactly what I need; take json and a template and produce html, so I forked a close-enough project and adjusted it, creating [handlebars-render](https://www.npmjs.com/package/handlebars-render) which does this.  You can use it like:

```shell
echo '{"foo": "bar"}' | hb -i page.handlebars
```

The output of **marked** is fed into this script. I use a `metadata.json` file in my gist that provices the post date, title, and tags (which I don't currently support, but could in the future).  Usage winds up like:

```shell
DATA="{\"id\": $ID, \"title\": $TITLE, \"content\": $HTML, \"metadata\": $METADATA, \"date\": $DATE}"
echo $DATA | hb -i templates/post.handlebars
```

There's probably a better way to create a json string (perhaps with jq) but this works well enough for my needs.

## Putting it all together

And that's it! With those core scripts I can easily put everything together that generates html. My script is simple:

```shell
#!/bin/bash
GIST_ID=$1

IFS='%'

GIST_JSON=`curl -H "Authorization: token $GITHUB_TOKEN" -s https://api.github.com/gists/$GIST_ID`

CONTENT=`echo $GIST_JSON | jq '.files[.files | keys[0]].content'`
METADATA=`echo $GIST_JSON | jq -r '.files["metadata.json"].content'`
HTML=`echo $CONTENT | jq -r '.' | marked --options marked_options.js | jq -s -R '.'`

# Get the title either from metadata.title or .description
TITLE=`[[ "$METADATA" == "null" ]] && echo $GIST_JSON | jq '.description' || echo $METADATA | jq '.title'`
ID=`echo $GIST_JSON | jq ".id"`
DATE=\"`[[ "$METADATA" == "null" ]] && echo "foo" || echo $METADATA | jq -r '.date' | xargs -I{} gdate -d {} +%Y-%m-%d`\"

DATA="{\"id\": $ID, \"title\": $TITLE, \"content\": $HTML, \"metadata\": $METADATA, \"date\": $DATE}"

echo $DATA | hb -i templates/post.handlebars
```

There's some backwards compatible stuff happening in the script or it would be even shorter; but even as it stands I'll take a fairly easy to read 20 LOC script as the basis for my blog any day. All that is needed is a environment variable `GITHUB_TOKEN` and a gist id provided as the first parameter and the script will spit out html.

I've got other scripts that do things like generate the index.html page and a script that will generate all posts (I keep a `posts` file that just lists the gist id and slug for these purposes). 

I'm relatively happy that I've been able to create an extremely light weight "static site generate" that's just scripted small utilities.
