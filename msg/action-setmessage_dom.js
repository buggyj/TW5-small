/*\
title: $:/core/modules/widgets/action-sentmessage_dom.js
type: application/javascript
module-type: dom_method

Action widget to send a message

\*/
(function(){
exports["as"] = function(id,aux) {
// this is the upstream dynamic method - just passes data thru to the down stream 
	// Dispatch the message
	this.dispatchIdEvent(aux.Id+'/'+aux.type,aux);
};
})();
