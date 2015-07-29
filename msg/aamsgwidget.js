/*\
title: $:/bj/modules/widgets/msgwidget.js
type: application/javascript
module-type: widget

Widget base class

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;
/*
Create a widget object as a basic for message widgets
/*
Add a list of event listeners from an array [{type:,handler:},...]
*/
Widget.prototype.addIdEventListeners = function(listeners) {
	var self = this;
	$tw.utils.each(listeners,function(listenerInfo) {
		self.addIdEventListener(listenerInfo.id,listenerInfo.handler,listenerInfo.aux);
	});
};
/*
Add a message event listener
*/
//bj should throw an error if action[id] already exists - should be unque otherwise it will cause an error
Widget.prototype.addIdEventListener = function(id,handler,aux) {
	var self = this;
	var newitem ={name:null,handle:null,next:null,aux:null}

	if(typeof handler === "string") { // The handler is a method name on this widget
		newitem.aux = aux; //data to be passed back to the user
		newitem.handle= function(event, aux) {
			return self[handler].call(self,event,aux);
		};
		newitem.name = handler; //save name so we can del later

	} else { // The handler is a function
		newitem.handle = function(event) {
			return handler.call(self,event);
		};
	}
	if (!action[id]) {
		action[id] = newitem;
	} else {
		var next = action[id];
		    while (next.next) next = next.next;
		    next.next = newitem;
	}
	
};

Widget.prototype.delIdEventListeners = function(listeners) {
	var self = this;
	//action = {}; return;
	$tw.utils.each(listeners,function(listenerInfo) {
		self.delIdEventListener(listenerInfo.id,listenerInfo.type,listenerInfo.handler);
	});
};

Widget.prototype.delIdEventListener = function(id,type,handler) {
	var self = this;

	if (!action[id]) { alert ("no entry found "+id)
		return;
	} else {
		var next = action[id];
		if (typeof handler === "string") {//alert ("str"+handler)
			if (handler == next.name) {
				 action[id] = next.next;
				 if (action[id] == null) delete (action[id]);
				return;
			} else {
				while (next.next) {
					if (handler == next.next.name) break;
					next = next.next;
				}
				if (!next.next) {
					alert("not found str");return;
					}

				next.next = next.next.next;
				return;				

			}
		} else 	{
			if (handler == next.handle) {
				action[id] = next.next;
				return;
			} else {
				while (next.next) {
					if (handler == next.next.handle) break;
					next = next.next;
				}
				if (!next.next) {//alert("not found ");return;
					}
			
				next.next = next.next.next;
				return;				

			}
		} 
	}
	
};

var actions = {};//global actions table


/*
Dispatch an event to a widget. If the widget doesn't handle the event then it is also dispatched to the parent widget
*/
Widget.prototype.dispatchIdEvent = function(id, event) {
	var listener = action[id], e, aux;

	//if (typeof event.$isRef === "undefined" || event.$isRef !== true) {
		//e = JSON.parse(JSON.stringify(event));//clone to stop unintentional linking thru object referencing
	//}
	//else 
	e = event;

	while (listener) {
		
		listener.handle(e,listener.aux);
		//pass thru dynamic content

		if(!listener.next) {
			return true;
		}
		listener = listener.next
	}
	return true;
};
Widget.prototype.getTable = function () {
	return action;
}

var action=Object.create(null);;

exports.msgwidget = Widget;
$tw.msgwidgettable = action;

})();
