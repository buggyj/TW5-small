
/*\
title: $:/bj/modules/widgets/refresh.js
type: application/javascript
module-type: widget

refreshWiget - 

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var refreshWiget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
refreshWiget.prototype = new Widget();

/*
Render this widget into the DOM
*/
refreshWiget.prototype.render = function(parent,nextSibling) {
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	this.renderChildren(parent,nextSibling);
};

/*
Compute the internal state of the widget
*/
refreshWiget.prototype.execute = function() {
	// Get our parameters
    this.msg=this.getAttribute("msg");
    if (this.msg) {
		this.eventListeners = {};
		this.addEventListeners([
			{type: this.msg, handler: "handleRefreshEvent"}
		]);
	}
    // Construct the child widgets
	this.makeChildWidgets();
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
refreshWiget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes["msg"] ) {
		this.refreshSelf();
		return true;
	}
	else {
		return this.refreshChildren(changedTiddlers);
	}
};

refreshWiget.prototype.handleRefreshEvent = function(event) {
	var list = {},additionalFields,title;
		if(typeof event.paramObject === "object") {
			additionalFields = event.paramObject;
			title = additionalFields.title;
		}
		if (title) {
			list[title] =  {};
			list[title]["modified"] = true;
		}
		this.refreshChildren(list);

	return false;//always consume event
};

exports.refresh = refreshWiget;

})();
