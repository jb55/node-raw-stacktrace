
# node-raw-stacktraces

Get raw stack traces when errors are thrown.

Optionally customize the format of stack traces.

[![Build Status](https://travis-ci.org/jb55/node-raw-stacktrace.png)](https://travis-ci.org/jb55/node-raw-stacktrace)

## How it works

node-raw-stacktrace works by hooking into v8's prepareStackTrace call. v8 calls
this function when code accesses the Error.stack property to render it to a
string.

This means that Error.stack needs to be accessed or events will not be emitted.
Usually this is not an issue if it gets logged to a file or stdout, but it's
something to keep in mind.

## methods

```js
var raw = require('raw-stacktrace');
```

### var traces = raw(opts={})

Return an `EventEmitter` that emits an array of either raw or formatted
CallSites. You can read about v8's [CallSite API here](http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi#Customizing_stack_traces)

`opts` may contain:

* `rawCallSites`: `true` if you just want the raw array of callsites,
  defaults to `false`. When `false`, the callsites are formatted to objects.

* `formatter`: \[optional\] a `function(err, callsites)` that formats stack
  traces, usually returns a string but it doesn't have to.

## Example

```js
var raw = require('raw-stacktrace');
var traces = raw();

traces.on("trace", function(err, callsites){
  console.log(callsites[0]);
});

traces.formatter(function(err, callsites){
  return "custom stack trace output";
});

(function testError(){ 
  throw new Error("test");
}).bind({ context: "someContext" })();
```

### Output

```js
{ this: { context: 'someContext' },
  type: 'Object',
  isTop: false,
  isEval: false,
  origin: '/Users/jb55/src/js/node-raw-stacktrace/example.js',
  script: '/Users/jb55/src/js/node-raw-stacktrace/example.js',
  fun: [Function: testError],
  name: 'testError',
  method: null,
  path: '/Users/jb55/src/js/node-raw-stacktrace/example.js',
  line: 11,
  col: 9,
  isNative: false,
  pos: 277,
  isCtor: false,
  file: 'example.js',
  toJSON: [Function: toJSON] }
custom stack trace output
```

## Adding callsites to the Error object

```js
var raw = require('raw-stacktrace');
var traces = raw();

traces.on("trace", function(err, callsites){
  err.callsites = callsites;
});
```

### License

```
The MIT License (MIT)

Copyright (c) 2013 William Casarin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

