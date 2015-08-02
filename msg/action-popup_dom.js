/*\
title: $:/core/modules/widgets/action-popup_dom.js
type: application/javascript
module-type: dom_method

Action widget to send a message

\*/
(function(){
exports["do-popup"] = function(upstream,here) {
	/*
	// Assign classes
	alert("classas"+upstream.domNode.getAttribute("class"))
	var classes = upstream.domNode.getAttribute("class").split(" ") || [],
		isPoppedUp = here.popup && $tw.popup.isPoppedUp(here.popup);
alert("** **"+$tw.popup.isPoppedUp(here.popup))
	if(isPoppedUp) {
		$tw.utils.pushTop(classes,"tc-popup-handle");
	}
	upstream.domNode.className = classes.join(" ");
	*/
	$tw.popup.triggerPopup({
		domNode: upstream.domNode,
		title: here.popup,
		msg: true,
		wiki: null//not needed when sending msg
	});
};
})();
