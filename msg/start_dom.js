/*\
title: $:/core/modules/widgets/head_dom.js
type: application/javascript
module-type: head_method

Action start of static dom - in the head eare

\*/
var exports = {};
window.onload = function()
//setTimeout(function()
{	
	var mod = exports;
	//alert("load")
	// first link to central table
	var json = document.getElementById("jsontable");//alert(json.textContent)
	var action = JSON.parse(json.textContent); //alert(action["bt1/bjm-null"])



// next connenct button clicks
	var elements = document.getElementsByClassName("bt");//alert(elements.length)
	for(var i=0; i<elements.length; i++) { 
			elements[i].addEventListener("click",function (event) {
			//the id and aux will need to be in the dom. - why is the aux used
			mod.dispatchIdEvent(this.getAttribute("data-event"),{});	
			//alert(this.id+this.getAttribute("data-event")) 
			return true;
		},false);
	}

mod.dispatchIdEvent = function(id, event) {
	var listener = action[id], domNode;
	while (listener) {
//alert(listener.name.substring(0, 2)) 
		//domNode indicates that we have a destination needing connecting to the dom
		if (('domNode' in listener.aux) && (!listener.aux['domNode'])) {
			listener.aux['domNode'] = document.getElementById(listener.name);
		}
		//each widget needs to expose its dom modifying code via a naming convention
		//eg as = action set message,these are used to find their code in the reduced runtime
		mod[listener.name.substring(0, 2)](event,listener.aux,listener.aux['domNode']);
		if(!listener.next) {
			return true;
		}
		listener = listener.next
	}
	return true;
}; 

}
