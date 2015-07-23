/*\
title: $:/core/modules/widgets/action-sentmessage.js
type: application/javascript
module-type: widget

Action widget to send a message

\*/
(function(){
//alert = function () {};
/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/bj/modules/widgets/msgwidget.js").msgwidget;

var SendMessageWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
SendMessageWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
SendMessageWidget.prototype.render = function(parent,nextSibling) {
	this.computeAttributes();
	this.execute();
};

/*
Compute the internal state of the widget
*/
SendMessageWidget.prototype.execute = function() {
	var self = this;
	this.oAux = {};//hold the values for the dowmsteam dynamic
	this.outId = this.getAttribute("$Id");
	this.oActionMessage = this.getAttribute("$message");
	this.oActionParam = this.getAttribute("$param");
	this.oActionName = this.getAttribute("$name");
	this.oActionValue = this.getAttribute("$value","");
	// Get the string parameter
	this.oAux.param = this.oActionParam;
	// Assemble the attributes as a hashmap
	this.oAux.paramObject = Object.create(null);
	$tw.utils.each(this.attributes,function(attribute,name) {
		if(name.charAt(0) !== "$") {
			self.oAux.paramObject[name] = attribute;
		}
	});
	// Add name/value pair if present
	if(this.oActionName) {
		this.oAux.paramObject[this.oActionName] = this.oActionValue;
	}
	this.oAux.Id = this.outId;
	this.oAux.type = this.oActionMessage;
	this.oAux.tiddlerTitle = this.getVariable("currentTiddler");
	this.oAux.navigateFromTitle = this.getVariable("storyTiddler");
};

/*
Refresh the widget by ensuring our attributes are up to date
*/
SendMessageWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(Object.keys(changedAttributes).length) {
		this.refreshSelf();
		return true;
	}
	return this.refreshChildren(changedTiddlers);
};

/*Remove event handlers
*/
SendMessageWidget.prototype.removeChildDomNodes = function() {
//no childern with this widget - just remove event handler
	this.delIdEventListeners([
		{type: this.msgType, handler: this.handlename, id:this.id}
	]);
};
/*
Invoke the init action associated with this widget
*/
SendMessageWidget.prototype.invokeInitAction = function(triggeringWidget,event) { //use addIdEventListener
// set up the static part of the upstream.- 
// receive the item to listen for
// setup incomming messge	
	this.id = event.id;//incomming id
	this.msgType = event.msgType;
		
//expose the name of the event in the central table
	this[this.id] = this.handlesetvalEvent;
	this.handlename = this.id;

//pass the state of the widget into the central table via oAux (as the upstream listener) - this is the dynamic structure.

	this.addIdEventListeners([
		{type: this.msgType, handler: this.handlename, id:this.id, aux:this.oAux}
	]);

};
/*
Invoke the down stream action associated with receiving an upstream event
*/
SendMessageWidget.prototype.handlesetvalEvent = function(event,aux) {

	// Dispatch the message to the outbound
	this.setmessage(aux.Id,aux);

}


SendMessageWidget.prototype.setmessage = function(id,aux) {
// this is the upstream dynamic method - just passes data thru to the down stream 
	// Dispatch the message
	this.dispatchIdEvent(id,aux);
};
exports["action-sentmessage"] = SendMessageWidget;

})();
