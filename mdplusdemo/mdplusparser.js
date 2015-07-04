/*\
title: $:/plugins/bj/mdplusdemo/parsers/PostMd.js
type: application/javascript
module-type: parser

to support inclusions
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var PostMd = function(type,text,options) {

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

exports["text/x-Md"] = PostMd;

})();

