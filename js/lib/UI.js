define([
    "underscore",
    "jquery"
], function(_, $) {
    return (function() {

        function UI() {

            var triggeredAnimationEndEventIds = {};
            var triggeredTransitionEndEventIds = {};

            $.fn.extend({
                onceOnTransitionEnd: function(callback) {
                    this.on("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function(event) {
                        if (!triggeredAnimationEndEventIds[event.timeStamp]) {
                            triggeredAnimationEndEventIds[event.timestamp] = true;
                            callback(event);
                        }
                    });
                },

                onceOnAnimationEnd: function(callback) {
                    this.on('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(event) {
                        if (!triggeredTransitionEndEventIds[event.timestamp]) {
                            triggeredTransitionEndEventIds[event.timeStamp] = true;
                            callback(event);
                        }
                    });
                },

                containsCssClass: function(cssClass) {
                    var cssClasses = this.attr("class").split(" ");
                    return _.contains(cssClasses, cssClass);
                },

                translate: function(coordinates) {
                    var x = coordinates.x || 0;
                    var y = coordinates.y || 0;
                    var z = coordinates.z || 0;
                    var transform = "translate3d(" + x + "px," + y + "px, " + z + "px)";
                    this.css({
                        WebkitTransform: transform
                    });
                    /*
                     uiElement.style.transform = transform;
                     uiElement.style.oTransform = transform;
                     uiElement.style.msTransform = transform;
                     uiElement.style.mozTransform = transform;
                     uiElement.style.webkitTransform = transform;
                     */
                }
            });

            var newElement = function(elemType, cssClass, id) {
                var elem = $("<" + elemType + "/>");
                if (cssClass) {
                    elem.addClass(cssClass);
                }
                if (id) {
                    elem.attr("id", id);
                }
                return elem;
            };

            this.button = function(cssClass, id) {
                return newElement("button", cssClass, id);
            };

            this.img = function(src, cssClass, id) {
                var element = newElement("img", cssClass, id);
                element.attr("src", src);
                return element;
            };

            this.div = function(cssClass, id) {
                return newElement("div", cssClass, id);
            };

            this.span = function(cssClass, id) {
                return newElement("span", cssClass, id);
            };
        }

        return new UI();
    })();
});
