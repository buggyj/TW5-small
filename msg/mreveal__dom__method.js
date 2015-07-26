/*\
title: $:/bj/modules/widgets/mrevealdom_method.js
type: application/javascript
module-type: dom_method



\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";
exports["rv"] = function(event,aux,domNode) {
	var state = event.paramObject.state;//event.paramObject.state is the changed state (in a string) sent to use from the source.
	var internals = aux;
	var refreshed = false,
		toOpen;

	switch(internals.type) {
		case "match":
			toOpen = state === internals.text;//alert(state+" state M toopen="+toOpen);
			break;
		case "nomatch":
			toOpen = state === internals.text;//alert(state+" state noM toopen"+toOpen);
			toOpen = !toOpen;
			break;
	}
	if(toOpen !== internals.isOpen) {

		
		// Animate our DOM node
		if(!internals.isOpen) {
			domNode.removeAttribute("hidden");
			if (typeof $tw !== "undefined" && $tw.anim) $tw.anim.perform(internals.openAnimation,domNode);
			internals.isOpen = true;
		} else {
			if (typeof $tw !== "undefined" && $tw.anim) {
				$tw.anim.perform(internals.closeAnimation,domNode,{callback: function() {
					domNode.setAttribute("hidden","true");
				}});
			} else domNode.setAttribute("hidden","true");
			internals.isOpen = false;
		} 
		
	} else {}//alert(state+" state M isopen"+this.isOpen +" toopen"+toOpen+"text"+this.text);}
};


})();
