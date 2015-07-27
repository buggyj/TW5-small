/*\
title: $:/core/modules/widgets/action-sentmessage.js
type: application/javascript
module-type: widget

Action widget to send a message

\*/
(function(){
alert = function () {};
/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";
var count = 0;

var Widget = require("$:/bj/modules/widgets/msgwidget.js").msgwidget;

var SendMessageWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
	if(!SendMessageWidget[this.label]) {
		SendMessageWidget.prototype[this.label] = $tw.modules.applyMethods("dom_method")[this.label];
	}	
};


/*
Inherit from the base widget class
*/
SendMessageWidget.prototype = new Widget();

SendMessageWidget.prototype.label = "as";
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

	
	this.here = Object.create(null);//hold the values for the dowmsteam dynamic
	this.here.sendId = this.getAttribute("$sendOn");
	this.here.sendType = this.getAttribute("$action");

	// Assemble the attributes as a hashmap
	this.here.paramObject = Object.create(null);
	$tw.utils.each(this.attributes,function(attribute,name) {
		if(name.charAt(0) !== "$") {
			self.here.paramObject[name] = attribute;
		}
	});

	this.here.tiddlerTitle = this.getVariable("currentTiddler");
	this.here.storyTiddler = this.getVariable("storyTiddler");
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
		{handler: this.handlename, id:this.id+'/'+ this.msgType}
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
		/////////////	
	count++;
	this[this.label+count] = this.handlesetvalEvent;
	this.handlename = this.label+count;
	///////////	



//pass the state of the widget into the central table via here (as the upstream listener) - this is the dynamic structure.

	this.addIdEventListeners([
		{ handler: this.handlename, id:this.id+'/'+this.msgType, aux:this.here}
	]);

};
/*
Invoke the down stream action associated with receiving an upstream event
*/
SendMessageWidget.prototype.handlesetvalEvent = function(event,aux) {

	// Dispatch the message to the outbound
	this[this.label](event,aux);

}

exports["action-sentmessage"] = SendMessageWidget;

})();
