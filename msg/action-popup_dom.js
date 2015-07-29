/*\
title: $:/core/modules/widgets/action-popup_dom.js
type: application/javascript
module-type: dom_method

Action widget to send a message

\*/
(function(){
exports["ap"] = function(upstream,here) {
	$tw.popup.triggerPopup({
		domNode: upstream.domNode,
		title: here.popup,
		msg: true,
		wiki: null//not needed when sending msg
	});
};
})();
