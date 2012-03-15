
var raw = require('./index');
var traces = raw();

traces.on("trace", function(err, callsites){
  console.log(callsites[0]);
});

traces.formatter(function(err, st){
  return "custom stack trace";
});

(function testError(){ 
  throw new Error("test");
}).bind({ context: "someContext" })();
