define([
    "underscore",
    "jquery",
    "hammer",
    "transit",
    "ui",
    "events",
    "app/config",
    "app/people"
], function(_,
            $,
            hammer,
            transit,
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

        this.getDonation = function() {
            return data.donation;
        };

        this.getBio = function() {
            return data.bio;
        };

        this.getPhoto = function() {
            if (data.photo) {
                return config.getImagePath() + data.photo;
            }
            return config.getImagePath() + this.getId() + ".jpg";
        };

    }

    function PersonUI(person) {
        var self = $.extend(this, new events.AbstractEventSource());
        var selected = false;

        var nameUI = ui.div("person-name");
        nameUI.text(person.getName());

        var donationUI = ui.div("person-donation");
        donationUI.text(person.getDonation());

        var nameContainerUI = ui.div("person-name-container");
        nameContainerUI.append(nameUI);
        nameContainerUI.append(donationUI);

        var bioUI = ui.div("person-bio");
        bioUI.text(person.getBio());

        var photoUI = ui.div("person-photo-container");
        var img = ui.img(person.getPhoto(), "person-photo");
        img.on('dragstart', function(event) { event.preventDefault(); });
        photoUI.append(img);

        var infoUI = ui.div("person-info");
        infoUI.append(photoUI);
        infoUI.append(bioUI);

        var uiElement = ui.div("person-display");
        uiElement.onceOnAnimationEnd(function(event) {
            if (selected) {
                infoUI.addClass("person-info-selected");
            }
        });

        uiElement.append(nameContainerUI);
        uiElement.append(infoUI);
        uiElement.display = this;

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
            uiElement.removeClass("person-display-deselected");
            selected = true;
        };

        this.deselect = function() {
            if (selected) {
                uiElement.addClass("person-display-deselected");
                uiElement.removeClass("person-display-selected");
                infoUI.addClass("person-info-deselected");
                infoUI.removeClass("person-info-selected");
                selected = false;
            }
        };
    }

    function DisplayElementMap() {
        var self = this;
        var elementToUIs = [];

        this.addUI = function(ui, element) {
            elementToUIs.push({
                element: element,
                ui: ui
            });
        };

        this.getUIByElement = function(element) {
            var found = _.find(elementToUIs, function(item) {
                return item.element[0] === element;
            });

            if (found) {
                return found.ui;
            }
        };

    }

    function Display() {
        var self = this;
        var uiElement = ui.div("display");
        var personDisplays = [];
        var displayElementMap = new DisplayElementMap();

        var currentPosition = 0;
        var y = 0;

        var findPersonUIFromTarget = function(target) {
            var personDisplayElement;
            if ($(target).containsCssClass("person-display")) {
                personDisplayElement = target;
            } else {
                personDisplayElement = $(target).parents('.person-display')[0];
            }
            return displayElementMap.getUIByElement(personDisplayElement);
        };

        var handleGestureEvent = function(ev) {
            ev.gesture.preventDefault();
            var gesture = ev.gesture;
            switch(ev.type) {
                case 'dragup':
                case 'dragdown':
                    console.log("dragging");
                    y = currentPosition + gesture.deltaY;
                    if (y > 0) {
                        y = 0;
                    }
                    uiElement.translate({
                        y: y
                    });
                    break;

                case 'swipeup':
                case 'swipedown':
                    gesture.stopDetect();
                    var deltaY = gesture.deltaY;
                    var newPosition = currentPosition + deltaY + deltaY;
                    if (newPosition > 0) {
                        newPosition = 0;
                    }
                    currentPosition = newPosition;

                    // TODO: velocity will maybe just dictate how fast to move, not distance to move.
                    var velocity = gesture.velocityY;

                    console.log("swipe: " + deltaY);
                    uiElement.transition({
                        y: currentPosition
                    });
                    break;

                case 'dragend':
                    gesture.stopDetect();
                    console.log("dragend event, y: " + y + " current: " + currentPosition);
                    currentPosition = y;
                    break;
                case 'tap':
                    console.log("tap");
                    var target = ev.target;
                    var ui = findPersonUIFromTarget(target);
                    if (ui) {
                        ui.toggleName();
                    } else {
                        console.log("Could not find ui for target");
                        console.log(target);
                    }
                    break;
            }
        };

        var hammertime = Hammer(uiElement, {
            tapMaxDistance: 10,
            swipeVelocityY: .3 // this sort of adjusts for the velocity of the touchscreen hardware
        });

        hammertime.on('swipeup swipedown dragup dragdown dragend tap', function(ev) {
            handleGestureEvent(ev);
        });

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

        this.addPersonDisplay = function(personUI) {
            personUI.on("select", function() {
                self.deselectOthers(personUI);
            });

            personDisplays.push(personUI);
            var personUIElement = personUI.getUI();
            uiElement.append(personUIElement);
            displayElementMap.addUI(personUI, personUIElement);
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