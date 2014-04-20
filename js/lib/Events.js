define([
    "underscore",
    "jquery",
    "ui"
], function(_, $, ui, config, people) {

    var events = {};
    events.AbstractEventSource = function() {
        var eventListenersByEvent = {};
        this.on = function (event, listener) {
            var listeners = eventListenersByEvent[event];
            if (!listeners) {
                listeners = [];
                eventListenersByEvent[event] = listeners;
            }
            listeners.push(listener);
        };

        this.trigger = function (event, data) {
            var listeners = eventListenersByEvent[event];
            if (listeners) {
                _.each(listeners, function (listener) {
                    listener(event, data);
                });
            }
        };
    };

    return events;
});
