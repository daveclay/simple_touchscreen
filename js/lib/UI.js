define([
    "underscore",
    "jquery"
], function(_, $) {
    return (function() {

        function UI() {

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

            this.div = function(cssClass, id) {
                return newElement("div", cssClass, id);
            };

            this.span = function(cssClass, id) {
                return newElement("span", cssClass, id);
            }
        }

        return new UI();
    })();
});