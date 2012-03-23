
# node-raw-stacktraces

Get raw stack traces when errors are thrown.

Optionally customize the format of stack traces.

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


