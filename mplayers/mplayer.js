/*\
title: $:/bj/modules/widgets/mplayer.js
type: application/javascript
module-type: widget



\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */


var Widget = require("$:/core/modules/widgets/widget.js").widget;

var MPlayerWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
	this.addEventListeners([
	{type: "tm-mff", handler: "handleFFEvent"},
	{type: "tm-mrw", handler: "handleRWEvent"},
	{type: "tm-mstop", handler: "handleStopEvent"},
	{type: "tm-mpause", handler: "handlePauseEvent"},
	{type: "tm-mvup", handler: "handleVolUpEvent"},
	{type: "tm-mvdwn", handler: "handleVolDwnEvent"},
	{type: "tm-mply", handler: "handlePlayEvent"}]);
};

/*
Inherit from the base widget class
*/
MPlayerWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
MPlayerWidget.prototype.render = function(parent,nextSibling) {
	var self = this;
	this.currentplayer = false;
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	this.pNode = this.document.createElement("div");
	this.audiodomNode = this.document.createElement("audio");
	this.audiodomNode.addEventListener("ended",function (event) {
		if (self.onEnd){
			self.dispatchEvent({
			type: self.onEnd
			});	
		}		
	});
	this.pNode.appendChild(this.audiodomNode);	
	this.cNode = this.document.createElement("div");
	this.pNode.appendChild(this.cNode);
	// Insert element
	parent.insertBefore(this.pNode,nextSibling);
		this.renderChildren(this.cNode,null);
	this.domNodes.push(this.pNode);
	this.pNode.setAttribute("hidden","true");
};

MPlayerWidget.prototype.ourmedia = function(event) {
		var tid;
		if ((tid = this.wiki.getTiddler(event.tiddler)) && (tid.hasField("_canonical_uri"))
			&& (tid.fields.type === "audio/mp3")) {
			return true;
		}
		return false;
}
MPlayerWidget.prototype.invokeAction = function(triggeringWidget,event) {
	if (event.type == "preStart" && this.currentplayer && !this.ourmedia(event)) { 
		this.domNodes[0].setAttribute("hidden","true");
		this.currentplayer = false;
		this.handleStopEvent();
	}
	if (event.type == "start" && this.ourmedia(event)) {
		if (!this.currentplayer) {
			this.currentplayer = true;
			this.domNodes[0].removeAttribute("hidden");
		}
		this.handleStartEvent(event);
	}

	return true; // Action was invoked
};
/*
Compute the internal state of the widget
*/
MPlayerWidget.prototype.execute = function() {
	// Get our parameters
	this.volume = 1.0;
	this.onStart = this.getAttribute("onStart");
	this.onEnd = this.getAttribute("onEnd");
    this.deltas =this.getAttribute("deltas",10);
    this.startTime =this.getAttribute("startTime",0.0);
    // Construct the child widgets
	this.makeChildWidgets();
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
MPlayerWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes["startTime"] ) {
		this.refreshSelf();
		return true;
	}
	else {
		return this.refreshChildren(changedTiddlers);
	}
};
MPlayerWidget.prototype.handleStartEvent = function(event) {
	var player = this.audiodomNode;
	var self = this,additionalFields,track,tid;

	{
		additionalFields = event;
		if ((tid = this.wiki.getTiddler(additionalFields.tiddler)) && (tid.hasField("_canonical_uri"))) {
			track = tid.fields._canonical_uri;
			self.equalize = tid.fields.equalize || 1.0;
		}	
	}
	try {
	player.src = track;
	player.controls ="controls";
	
	player.load();
	player.play();
	if (this.onStart){
		this.dispatchEvent({
		type: this.onStart
		});	
	}
	if (true) {
		player.addEventListener("canplay",(function() { 
			player.currentTime =  parseFloat(self.startTime);
			player.removeEventListener('canplay', arguments.callee);
			player.volume =  self.volume * self.equalize;
		}));
	}
	} catch(e) {};
	

	return false;//always consume event
};
MPlayerWidget.prototype.handleStopEvent = function(event) {
	var player = this.audiodomNode;
	try {
	player.pause();
    player.currentTime = 0;	
    } catch(e) {};
	return false;//always consume event
};
MPlayerWidget.prototype.handlePlayEvent = function(event) {
	var player = this.audiodomNode;
	try {	
	if (player.paused) {
		player.play();
	}
    } catch(e) {};
	return false;//always consume event
};
MPlayerWidget.prototype.handlePauseEvent = function(event) {
	var player = this.audiodomNode;
	try {
	if (!player.paused) {
		player.pause();
	}
	} catch(e) {};
	return false;//always consume event
};

MPlayerWidget.prototype.handleVolUpEvent = function(event) {
	var player = this.audiodomNode;
	var self = this,additionalFields,track;
	try {
	if (this.volume < 0.91) {
		this.volume+=0.1;
		player.volume = this.volume * this.equalize;
	}
	} catch(e) {};
	return false;//always consume event
};
MPlayerWidget.prototype.handleVolDwnEvent = function(event) {
	var player = this.audiodomNode;
	var self = this,additionalFields,track;
	try {
	if (this.volume>0.1) {
		this.volume-=0.1;
		player.volume = this.volume * this.equalize;
	}
	} catch(e) {};
	return false;//always consume event
};
MPlayerWidget.prototype.handleFFEvent = function(event) {
	var player = this.audiodomNode;
	try {
	player.currentTime += this.deltas;
	} catch(e) {};
	return false;//always consume event
};
MPlayerWidget.prototype.handleRWEvent = function(event) {
	var player = this.audiodomNode;
	try {
	player.currentTime -= this.deltas;
	} catch(e) {};
	return false;//always consume event
};
exports.mplayer = MPlayerWidget;

})();
