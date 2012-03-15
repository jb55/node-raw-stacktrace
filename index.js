var EventEmitter = require('events').EventEmitter
  , traceback = require('traceback')
  , path = require('path')
  , _  = require('underscore')._
  ;

//
// taken from traceback since they were not exported
//
function simpleCallsite(callSite) {
  var frame = Object.create(callSite);

  frame["this"]   = frame.getThis();
  frame.type      = frame.getTypeName();
  frame.isTop     = frame.isToplevel();
  frame.isEval    = frame.isEval();
  frame.origin    = frame.getEvalOrigin();
  frame.script    = frame.getScriptNameOrSourceURL();
  frame.fun       = frame.getFunction();
  frame.name      = frame.getFunctionName();
  frame.method    = frame.getMethodName();
  frame.path      = frame.getFileName();
  frame.line      = frame.getLineNumber();
  frame.col       = frame.getColumnNumber();
  frame.isNative  = frame.isNative();
  frame.pos       = frame.getPosition();
  frame.isCtor    = frame.isConstructor();

  frame.file = path.basename(frame.path);
  //frame.self = frame.this

  frame.toJSON = toJSON;

  return frame;
}

function toJSON() {
  var self = this;

  var result = {};
  Object.keys(self).forEach(function(key) {
    var val = self[key];

    if(key == 'toJSON')
      return;
    else if(key == 'this')
      result[key] = "" + val;
    else if(typeof val == 'function')
      result[key] = "" + val;
    else
      result[key] = self[key];
  });

  return result;
}
//
// end code from traceback
//

module.exports = function TraceEmitter(opts){
  opts = opts || {};
  var emitter = new EventEmitter();
  var old = Error.prepareStackTrace;
  var hasCustomFormatter = !!opts.formatter;
  var formatter = opts.formatter || old || traceback.v8.FormatStackTrace;
  var rawCallSites = !opts.rawCallSites? false : !!opts.rawCallSites;

  emitter.formatter = function(fn) {
    hasCustomFormatter = true;
    formatter = fn;
  };
  
  Error.prepareStackTrace = function customPrepare(err, callsites){
    var sites = rawCallSites? callsites : _.map(callsites, simpleCallsite);
    emitter.emit("trace", err, sites);
    return formatter(err, hasCustomFormatter? sites : callsites);
  };
  
  return emitter;
}


