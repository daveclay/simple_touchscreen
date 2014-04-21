define([
    "underscore",
    "jquery",
    "ui",
    "events",
    "app/config",
    "app/people"
], function(_,
            $,
            ui,
            events,
            config,
            people) {

    function Person(data) {

        var id = data.name.replace(/\W+/g, "");

        this.getId = function() {
            return id;
        };

        this.getName = function() {
            return data.name;
        };

        this.getImage = function() {
            return config.getImagePath() + this.getId();
        };
    }

    function PersonUI(person) {
        var self = $.extend(this, new events.AbstractEventSource());
        var selected = false;

        var nameUI = ui.span("person-name");
        nameUI.text(person.getName());

        var uiElement = ui.div("person-display");
        /*
        uiElement.onTransitionEnd(function(event) {
            console.log(event.originalEvent.timestamp);
        });
         uiElement.on("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function(event) {
         alert(event.originalEvent.propertyName);
         });
        */
        uiElement.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(event) {
            alert(event.originalEvent.propertyName);
        });

        uiElement.click(function() {
            self.toggleName();
        });

        uiElement.append(nameUI);

        this.getUI = function() {
            return uiElement;
        };

        this.toggleName = function() {
            if ( ! selected) {
                this.select();
                this.trigger("select", this);
            } else {
                this.deselect();
                this.trigger("deselect", this);
            }
        };

        this.select = function() {
            uiElement.addClass("person-display-selected");
            selected = true;
        };

        this.deselect = function() {
            uiElement.removeClass("person-display-selected");
            selected = false;
        };
    }

    function Display() {
        var self = this;
        var uiElement = ui.div("display");
        var personDisplays = [];

        this.getUI = function() {
            return uiElement;
        };

        this.deselectOthers = function(personDisplay) {
            _.each(personDisplays, function(other) {
                if (personDisplay !== other) {
                    other.deselect();
                }
            });
        };

        this.addPersonDisplay = function(personDisplay) {
            personDisplay.on("select", function() {
                self.deselectOthers(personDisplay);
            });

            personDisplays.push(personDisplay);
            uiElement.append(personDisplay.getUI());
        };
    }

    var display = new Display();
    _.each(people, function(data) {
        var person = new Person(data);
        var personUI = new PersonUI(person);

        display.addPersonDisplay(personUI)
    });

    var displayElement = display.getUI();
    $('body').append(displayElement);
});