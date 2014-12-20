/*\
title: $:/plugins/bj/small/mdaltdemo/parsers/markapdaper.js
type: application/javascript
module-type: parser

to support inclusions
\*/

(function(){

var marked = require("$:/plugins/bj/small/mdaltdemo/markdown.js");

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var PostMd = function(type,text,options) {


	this.tree = [{
		type: "element",
		tag: "pre",
		children: [{
			type: "text",
			text: marked(text)
		}]
	}];
};

exports["text/x-Md"] = PostMd;

})();

