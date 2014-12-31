/*\
title: $:/bj/modules/widgets/wikiadapter.js
type: application/javascript
module-type: global

overrides for wiki.js

\*/
(function(){
var wiki = require("$:/core/modules/wiki.js");
 wiki.oldenqueueTiddlerEvent = wiki.enqueueTiddlerEvent;
wiki.enqueueTiddlerEvent = function(title,isDeleted) {
	if (title.substring(0,13) !== "$:/temp/priv/") this.oldenqueueTiddlerEvent(title,isDeleted);
};
})();
