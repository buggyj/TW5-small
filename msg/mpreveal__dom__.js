/*\
title: $:/bj/modules/widgets/mprevealdom.js
type: application/javascript
module-type: widget

Reveal widget

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";
//alert = function () {};
var count = 0;
var Widget = require("$:/bj/modules/widgets/msgwidget.js").msgwidget;

var RevealWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
		if(!RevealWidget[RevealWidget.prototype.label]) {
			//$tw.modules.applyMethods("mrevealdom_method",RevealWidget.prototype);
			RevealWidget.prototype[this.label] = $tw.modules.applyMethods("dom_method")[this.label];
		}
};

/*
Inherit from the base widget class
*/
RevealWidget.prototype = new Widget();


RevealWidget.prototype.label = "pr";


/*
Render this widget into the DOM
*/
RevealWidget.prototype.render = function(parent,nextSibling) {
	this.statea = null;
	this.isOpen = false;
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	var tag = this.parseTreeNode.isBlock ? "div" : "span";
	if(this.revealTag && $tw.config.htmlUnsafeElements.indexOf(this.revealTag) === -1) {
		tag = this.revealTag;
	}
	var domNode = this.document.createElement(tag);
	var classes = this["class"].split(" ") || [];
	classes.push("tc-reveal");
	domNode.className = classes.join(" ");
	if(this.style) {
		domNode.setAttribute("style",this.style);
	}
	parent.insertBefore(domNode,nextSibling);
	this.renderChildren(domNode,null);//if there is not a matching default then there will not be children - see execute.

	domNode.setAttribute("hidden","true");

	this.domNodes.push(domNode);//alert("ren"+this.domNodes.length)
	/////////////	
	//bj meditation: hid this name mangling with a method in base class
	count++;
	this[this.label+count] = this.handlesetvalEvent;
	this.handlename = this.label+count;
	///////////
	domNode.setAttribute("id",this.handlename);//link the dom with the callback
	domNode.setAttribute("data-event",this.Id+"/mtm-popup");
	//the value fof domNode below is added by the reduce runtime to the table enties, when it add the replacement for handlesetvalEvent
	
	var aux = {domNode:null,isOpen:this.isOpen, type:this.type, text:this.text,closeAnimation:this.closeAnimation,openAnimation:this.openAnimation,position:this.position};
	
	//bj addIdEventListeners adds callback function handleNavigateEvent to this widget instance with key = id/type
	// there will be a removeIdEventListeners ([{type: "tm-navigate", id:this.id}]) which widget calls on closing down
	if (this.Id) {	//alert("set "+this.Id+"/mtm-popup")		
		this.addIdEventListeners([
			{handler: this.handlename, id:this.Id+"/mtm-popup", aux:aux}
		]);
	}
};

/*
Compute the internal state of the widget
*/
RevealWidget.prototype.execute = function() {
	// Get our parameters

	this.state = this.getAttribute("state");
	this.Id = this.getAttribute("recvOn");
	this.revealTag = this.getAttribute("tag");
	this.type = this.getAttribute("type");
	this.text = this.getAttribute("text");
	this.position = this.getAttribute("position");
	this["class"] = this.getAttribute("class","");
	this.style = this.getAttribute("style","");
	this["default"] = this.getAttribute("default","");
	this.animate = this.getAttribute("animate","no");
	this.openAnimation = this.animate === "no" ? undefined : "open";
	this.closeAnimation = this.animate === "no" ? undefined : "close";
	// Compute the title of the state tiddler and read it
	this.stateTitle = this.state;

	// Construct the child widgets
	var childNodes = this.parseTreeNode.children;//Note that when rending there can be no children
	this.hasChildNodes = true;
	this.makeChildWidgets(childNodes);
};


/*Remove any DOM nodes created by this widget or its children
*/
RevealWidget.prototype.removeChildDomNodes = function() {
//alert(this.text+ "dom remove")
	// If this widget has directly created DOM nodes, delete them and exit. This assumes that any child widgets are contained within the created DOM nodes, which would normally be the case
	$tw.utils.each(this.children,function(childWidget) {
			childWidget.removeChildDomNodes();
		});
	if(this.domNodes.length > 0) {
		$tw.utils.each(this.domNodes,function(domNode) {
			domNode.parentNode.removeChild(domNode);
		});
		this.domNodes = [];
	}
	this.delIdEventListeners([
		{ handler: this.handlename, id:this.Id+"/mtm-popup"}
	]);
};


RevealWidget.prototype.handlesetvalEvent = function(event,aux) {
	//bj meditation: in the reduced case, the domnode with be passed here? or will be place in table?
	//the runtime will have to connect this up to the table up - better use table
	var domNode = aux.domNode?aux.domNode:this.domNodes[0];
	this[this.label](event,aux, domNode);
}

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
RevealWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(Object.keys(changedAttributes).length) {
		this.refreshSelf();
		return true;
	} else {
		return this.refreshChildren(changedTiddlers);
	}
};


exports["mpreveal"] = RevealWidget;

})();