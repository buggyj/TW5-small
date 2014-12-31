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
	{type: "tm-mstart", handler: "handleStartEvent"},
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
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	this.pNode = this.document.createElement("div");
	this.audiodomNode = this.document.createElement("audio");
	this.audiodomNode.addEventListener("ended",function (event) {
		var handled = false;
		if(self.invokeActions(event)) {
			handled = true;
		}
	});
	this.pNode.appendChild(this.audiodomNode);	
	this.cNode = this.document.createElement("div");
	this.pNode.appendChild(this.cNode);
	// Insert element
	parent.insertBefore(this.pNode,nextSibling);
		this.renderChildren(this.cNode,null);
	this.domNodes.push(this.pNode);
	var player = this.audiodomNode;
	self.invokeActions({type:"start"});
	/*function run(uri, player){
		player.src = "file:///media/buggyj/FIRELITE/iTunes/iTunes%20Music/The%20Velvet%20Underground/The%20Velvet%20Underground%20&%20Nico/01%20Sunday%20Morning.mp3"
        player.controls ="controls";
		player.load();
		player.play();
	//}*/

};

/*
Compute the internal state of the widget
*/
MPlayerWidget.prototype.execute = function() {
	// Get our parameters
    this.deltas =this.getAttribute("deltas",10);
    this.startTime =this.getAttribute("startTime");
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
	var self = this,additionalFields,track;

		if(typeof event.paramObject === "object") {
			additionalFields = event.paramObject;
			track = additionalFields.track
		}
		player.src = track;
		player.controls ="controls";
	    
		player.load();
		player.play();
		if (this.startTime) {
			player.addEventListener("canplay",(function() { 
				player.currentTime =  parseFloat(self.startTime);
				player.removeEventListener('canplay', arguments.callee);
			}));
		}


	return false;//always consume event
};
MPlayerWidget.prototype.handleStopEvent = function(event) {
	var player = this.audiodomNode;
	var self = this,additionalFields,track;
	player.pause();
    player.currentTime = 0;	
	return false;//always consume event
};
MPlayerWidget.prototype.handlePlayEvent = function(event) {
	var player = this.audiodomNode;
	var self = this,additionalFields,track;
	if (player.paused) {
		player.play();
	}
	return false;//always consume event
};
MPlayerWidget.prototype.handlePauseEvent = function(event) {
	var player = this.audiodomNode;
	var self = this,additionalFields,track;
	if (!player.paused) {
		player.pause();
	}
	return false;//always consume event
};

MPlayerWidget.prototype.handleVolUpEvent = function(event) {
	var player = this.audiodomNode;
	var self = this,additionalFields,track;

	if (player.volume < 0.91) player.volume+=0.1;
	
	return false;//always consume event
};
MPlayerWidget.prototype.handleVolDwnEvent = function(event) {
	var player = this.audiodomNode;
	var self = this,additionalFields,track;

	if (player.volume>0.1) player.volume-=0.1;
	
	return false;//always consume event
};
MPlayerWidget.prototype.handleFFEvent = function(event) {
	var player = this.audiodomNode;

	player.currentTime += this.deltas;
	return false;//always consume event
};
MPlayerWidget.prototype.handleRWEvent = function(event) {
	var player = this.audiodomNode;

	player.currentTime -= this.deltas;
	return false;//always consume event
};
exports.mplayer = MPlayerWidget;

})();
