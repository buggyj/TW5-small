/*\
title: $:/mcore/modules/widgets/submit_handler.js
type: application/javascript
module-type: dom_method
\*/
(function(){
exports["do-submit"] = function(upstream,here) {
	
	var vals = $tw.domextra.serialize(upstream.domNode, upstream.e);
	alert(JSON.stringify(vals))//$tw.wiki.setTiddlerData (here.tiddler,vals);
};
})();
