---
title: "Handling the next Stream in the Pipe Queue"
---

While working on [done-ssr](https://github.com/donejs/done-ssr) I wanted to make a simple API where a [Stream](https://nodejs.org/api/stream.html) is created for each request and piped into the response. The API should be as simple as:

```js
var http = require('http');
var render = require('done-ssr')();

var server = http.createServer(function(request, response){
  render(request).pipe(response);
});

server.listen(8080);
```

This describes the intent verbatim. You want to *render* the *request* and *pipe* the result into the *response*. It says exactly what it does.

A problem with this approach is that [Writable streams](https://nodejs.org/api/stream.html#stream_class_stream_writable) (for which an HTTP Response is) only receive in a Buffer, which in our case is the rendered HTML. A complete response needs more than just the body, however, such as the headers and the statusCode. I wanted done-ssr to be able to handle everything needed to complete the response.

It turns out you can do this with streams. I learned the trick from the [response module](https://github.com/mikeal/response). Since a Stream is a constructor function, `pipe` can be implemented to keep track of the response(s) being piped to. With that my Readable stream the code looks like:

```js
var Readable = require('stream').Readable;
var inherits = require('util').inherits;

var RenderStream = function(){
  Readable.call(this);

  this.responses = [];
};

inherits(RenderStream, Readable);

RenderStream.prototype.pipe = function(response){
  this.responses.push(response);
  return Readable.prototype.pipe.call(this, response);
};
```

This might seem obvious but if you primarily use Streams with third party modules like [through2](https://www.npmjs.com/package/through2) it's easy to forget that they are constructors.

In this example you can see that I am keeping an array of responses that my RenderStream is being piped into. This means when I have the statusCode I can simply loop over my array and set the status on the object. Same goes for headers or anything else.

```js
RenderStream.prototype._read = function(){
  // Do whatever to push into the stream
  this.responses.forEach(function(response){
    response.statusCode = 200;
  });
};
```
