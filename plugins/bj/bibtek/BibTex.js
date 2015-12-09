/*\
title: $:/bj/modules/widgets/action-bibtex.js
type: application/javascript
module-type: widget



\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var BibtekWiget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
BibtekWiget.prototype = new Widget();

/*
Render this widget into the DOM
*/
BibtekWiget.prototype.render = function(parent,nextSibling) {
	this.computeAttributes();
	this.execute();
};

/*
Compute the internal state of the widget
*/
BibtekWiget.prototype.execute = function() {
	this.source = this.getAttribute("source");
};

/*
Refresh the widget by ensuring our attributes are up to date
*/
BibtekWiget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes["source"]) {
		this.refreshSelf();
		return true;
	}
	return this.refreshChildren(changedTiddlers);
};

/*
Invoke the action associated with this widget
*/
BibtekWiget.prototype.invokeAction = function(triggeringWidget,event) {
	var 	newtid = run(this.source);
	this.wiki.addTiddler(new $tw.Tiddler(this.wiki.getCreationFields(),newtid));

	return true; // Action was invoked
};

exports["action-bibtex"] = BibtekWiget;






/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var run = function(ref) {
	/*
The MIT License (MIT)

Copyright (c) 2010 Henrik Muehe

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
*/
// Original work by Henrik Muehe (c) 2010
//
// CommonJS port by Mikola Lysenko 2013
//
//

// Issues:
//  no comment handling within strings
//  no string concatenation
//  no variable values yet

// Grammar implemented here:
//  bibtex -> (string | preamble | comment | entry)*;
//  string -> '@STRING' '{' key_equals_value '}';
//  preamble -> '@PREAMBLE' '{' value '}';
//  comment -> '@COMMENT' '{' value '}';
//  entry -> '@' key '{' key ',' key_value_list '}';
//  key_value_list -> key_equals_value (',' key_equals_value)*;
//  key_equals_value -> key '=' value;
//  value -> value_quotes | value_braces | key;
//  value_quotes -> '"' .*? '"'; // not quite
//  value_braces -> '{' .*? '"'; // not quite
function BibtexParser() {
  this.pos = 0;
  this.input = "";
  
  this.entries = {};
  this.comments = [];
  this.strings = {
      JAN: "January",
      FEB: "February",
      MAR: "March",      
      APR: "April",
      MAY: "May",
      JUN: "June",
      JUL: "July",
      AUG: "August",
      SEP: "September",
      OCT: "October",
      NOV: "November",
      DEC: "December"
  };
  this.currentKey = "";
  this.currentEntry = "";
  

  this.setInput = function(t) {
    this.input = t;
  }
  
  this.getEntries = function() {
      return this.entries;
  }

  this.isWhitespace = function(s) {
    return (s == ' ' || s == '\r' || s == '\t' || s == '\n');
  }

  this.match = function(s) {
    this.skipWhitespace();
    if (this.input.substring(this.pos, this.pos+s.length) == s) {
      this.pos += s.length;
    } else {
      throw "Token mismatch, expected " + s + ", found " + this.input.substring(this.pos);
    }
    this.skipWhitespace();
  }

  this.tryMatch = function(s) {
    this.skipWhitespace();
    if (this.input.substring(this.pos, this.pos+s.length) == s) {
      return true;
    } else {
      return false;
    }
    this.skipWhitespace();
  }

  this.skipWhitespace = function() {
    while (this.isWhitespace(this.input[this.pos])) {
      this.pos++;
    }
    if (this.input[this.pos] == "%") {
      while(this.input[this.pos] != "\n") {
        this.pos++;
      }
      this.skipWhitespace();
    }
  }

  this.value_braces = function() {
    var bracecount = 0;
    this.match("{");
    var start = this.pos;
    while(true) {
      if (this.input[this.pos] == '}' && this.input[this.pos-1] != '\\') {
        if (bracecount > 0) {
          bracecount--;
        } else {
          var end = this.pos;
          this.match("}");
          return this.input.substring(start, end);
        }
      } else if (this.input[this.pos] == '{') {
        bracecount++;
      } else if (this.pos == this.input.length-1) {
        throw "Unterminated value";
      }
      this.pos++;
    }
  }

  this.value_quotes = function() {
    this.match('"');
    var start = this.pos;
    while(true) {
      if (this.input[this.pos] == '"' && this.input[this.pos-1] != '\\') {
          var end = this.pos;
          this.match('"');
          return this.input.substring(start, end);
      } else if (this.pos == this.input.length-1) {
        throw "Unterminated value:" + this.input.substring(start);
      }
      this.pos++;
    }
  }
  
  this.single_value = function() {
    var start = this.pos;
    if (this.tryMatch("{")) {
      return this.value_braces();
    } else if (this.tryMatch('"')) {
      return this.value_quotes();
    } else {
      var k = this.key();
      if (this.strings[k.toLowerCase()]) {
        return this.strings[k];
      } else if (k.match("^[0-9]+$")) {
        return k;
      } else {
        throw "Value expected:" + this.input.substring(start);
      }
    }
  }
  
  this.value = function() {
    var values = [];
    values.push(this.single_value());
    while (this.tryMatch("#")) {
      this.match("#");
      values.push(this.single_value());
    }
    return values.join("");
  }

  this.key = function() {
    var start = this.pos;
    while(true) {
      if (this.pos == this.input.length) {
        throw "Runaway key";
      }
    
      if (this.input[this.pos].match("[a-zA-Z0-9_:\\./-]")) {
        this.pos++
      } else {
        return this.input.substring(start, this.pos).toLowerCase();
      }
    }
  }

  this.key_equals_value = function() {
    var key = this.key();
    if (this.tryMatch("=")) {
      this.match("=");
      var val = this.value();
      return [ key, val ];
    } else {
      throw "... = value expected, equals sign missing:" + this.input.substring(this.pos);
    }
  }

  this.key_value_list = function() {
    var kv = this.key_equals_value();
    this.entries[this.currentEntry][kv[0]] = kv[1];
    while (this.tryMatch(",")) {
      this.match(",");
      // fixes problems with commas at the end of a list
      if (this.tryMatch("}")) {
        break;
      }
      kv = this.key_equals_value();
      this.entries[this.currentEntry][kv[0]] = kv[1];
    }
  }

  this.entry_body = function(d) {
    this.currentEntry = this.key();
    this.entries[this.currentEntry] = { entryType: d.substring(1) };
    this.match(",");
    this.key_value_list();
  }

  this.directive = function () {
    this.match("@");
    return "@"+this.key();
  }

  this.string = function () {
    var kv = this.key_equals_value();
    this.strings[kv[0].toLowerCase()] = kv[1];
  }

  this.preamble = function() {
    this.value();
  }

  this.comment = function() {
    var start = this.pos;
    while(true) {
      if (this.pos == this.input.length) {
        throw "Runaway comment";
      }
    
      if (this.input[this.pos] != '}') {
        this.pos++
      } else {
        this.comments.push(this.input.substring(start, this.pos));
        return;
      }
    }
  }

  this.entry = function(d) {
    this.entry_body(d);
  }

  this.bibtex = function() {
    while(this.tryMatch("@")) {
      var d = this.directive().toLowerCase();
      this.match("{");
      if (d == "@STRING") {
        this.string();
      } else if (d == "@PREAMBLE") {
        this.preamble();
      } else if (d == "@COMMENT") {
        this.comment();
      } else {
        this.entry(d);
      }
      this.match("}");
    }

    this.entries['@comments'] = this.comments;
  }
}


//Runs the parser
function doParse(input) {
  var i, b = new BibtexParser(), ent={};
  b.setInput(input)
  b.bibtex()
  for (i in b.entries) {
	if (i != "@comments" ) {
		ent = b.entries[i];
		ent["reference"] = i;
		break;
	}
  }
  return ent;
}
return doParse(ref)
}

})();
