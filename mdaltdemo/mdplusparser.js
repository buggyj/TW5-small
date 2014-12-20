/*\
title: $:/plugins/bj/small/mdaltdemo/parsers/PostMd.js
type: application/javascript
module-type: parser

to support inclusions
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var PostMd = function(type,text,options) {
       var left = "\[\=\[", right = "\]\=\]";
	if (!!options.parserrules) {
		var leftreg =  new RegExp(options.parserrules.leftOfMacro||left,"mg");
		var rightreg =  new RegExp(options.parserrules.rightOfMacro||right,"mg");
		text = 	text.replace(leftreg,"<<").replace(rightreg,">>");
	}

	this.tree = [{
		type: "element",
		tag: "pre",
		children: [{
			type: "text",
			text: text
		}]
	}];
};

exports["text/x-PostMd"] = PostMd;

})();

