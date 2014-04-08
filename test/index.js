
var assert = require('better-assert')
var raw = require('../');

describe('raw-stacktrace', function(){
  it('emits on throw', function(done){
    var traces = raw();

    traces.on('trace', function(err, callsites){
      assert(err.message === "testing this");
      assert(callsites)
      assert(callsites[0])
      assert(callsites[0].type)
      done();
    });

    try {
      throw new Error("testing this");
    } catch(e) {
      e.stack.toString()
    }
  });
});
