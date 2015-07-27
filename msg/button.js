/*\
title: $:/core/modules/widgets/setbutton.js
type: application/javascript
module-type: widget

Button widget

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/bj/modules/widgets/msgwidget.js").msgwidget;

var ButtonWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
ButtonWidget.prototype = new Widget();
var count = 0;
/*
Render this widget into the DOM
*/
ButtonWidget.prototype.render = function(parent,nextSibling) {
	var self = this;
	// Remember parent
	this.parentDomNode = parent;
	// Compute attributes and execute state
	this.computeAttributes();
	this.execute();
	// Create element
	var tag = "button";
	if(this.buttonTag && $tw.config.htmlUnsafeElements.indexOf(this.buttonTag) === -1) {
		tag = this.buttonTag;
	}
	var domNode = this.document.createElement(tag);
	// Assign classes
	var classes = this["class"].split(" ") || [];


	domNode.className = classes.join(" ");
	// Assign other attributes
	if(this.style) {
		domNode.setAttribute("style",this.style);
	}
	if(this.tooltip) {
		domNode.setAttribute("title",this.tooltip);
	}
	if(this["aria-label"]) {
		domNode.setAttribute("aria-label",this["aria-label"]);
	}
	//need to generate id for domnode and pass it to action setmessage widgets
	/////////////	
	count++;
    this.domnodeId = "bt"+count;
	///////////
	// Add a click event handler
	domNode.addEventListener("click",function (event) {
		//the id and aux will need to be in the dom. - why is the aux used
		self.dispatchIdEvent(self.domnodeId+"/bjm-null",Object.create(null));	
		return true;
	},false);
	// Insert element
	parent.insertBefore(domNode,nextSibling);
	this.renderChildren(domNode,null);
	this.domNodes.push(domNode);


	domNode.setAttribute("id",this.domnodeId);//link the dom with the callback
	domNode.setAttribute("data-event",this.domnodeId+"/bjm-null");
	this.invokeInitActions(this,{id:this.domnodeId, msgType:"bjm-null"})
};

ButtonWidget.prototype.invokeInitActions = function(triggeringWidget,event) {
	// For each child widget
	for(var t=0; t<this.children.length; t++) {
		var child = this.children[t];
		// We need to pass the id and message type to each each child, which will
		// use them to register addIdEventListeners
		// after this we can then use the msg mechanism to send them messages using id/msg-type
		if(child.invokeInitAction) child.invokeInitAction(triggeringWidget,event);
	}
};
/*
We don't allow actions to propagate because we trigger actions ourselves
*/
ButtonWidget.prototype.allowActionPropagation = function() {
	return false;
};

ButtonWidget.prototype.getBoundingClientRect = function() {
	return this.domNodes[0].getBoundingClientRect();
};

/*
Compute the internal state of the widget
*/
ButtonWidget.prototype.execute = function() {
	// Get attributes

	this.hover = this.getAttribute("hover");
	this["class"] = this.getAttribute("class","");
	this["aria-label"] = this.getAttribute("aria-label");
	this.tooltip = this.getAttribute("tooltip");
	this.style = this.getAttribute("style");
	this.defaultSetValue = this.getAttribute("default","");
	this.buttonTag = this.getAttribute("tag");
	// Make child widgets
	this.makeChildWidgets();
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
ButtonWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(Object.keys(changedAttributes).length) {
		this.refreshSelf();
		return true;
	}
	return this.refreshChildren(changedTiddlers);
};

exports.mbutton = ButtonWidget;

})();
