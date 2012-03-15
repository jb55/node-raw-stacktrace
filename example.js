
var raw = require('./index');
var traces = raw();

traces.on("trace", function(err, callsites){
  console.log(callsites[0]);
});

(function testError(){ 
  throw new Error("test");
}).bind({ context: "someContext" })();
