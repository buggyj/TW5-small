/*\
title: $:/plugins/bj/mdaltdemo/parsers/markapdaper.js
type: application/javascript
module-type: parser

to support inclusions
\*/

(function(){

var marked = require("$:/plugins/bj/mdaltdemo/markdown.js");

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var PostMd = function(type,text,options) {
	var opts;
	if (!!options) {opts = options.parserrules;}
	this.tree = [{
		type: "element",
		tag: "pre",
		children: [{
			type: "text",
			text: marked(text,opts)
		}]
	}];
};

exports["text/x-Md"] = PostMd;

})();

