
# node-raw-stacktraces

Get raw stack traces when errors are thrown.

Optionally customize the format of stack traces.

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
  origin: '/Users/jb55/src/coffeescript/node-raw-stacktrace/example.js',
  script: '/Users/jb55/src/coffeescript/node-raw-stacktrace/example.js',
  fun: [Function: testError],
  name: 'testError',
  method: null,
  path: '/Users/jb55/src/coffeescript/node-raw-stacktrace/example.js',
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


