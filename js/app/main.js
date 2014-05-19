define([
    "underscore",
    "jquery",
    "hammer",
    "ui",
    "events",
    "app/config",
    "app/people"
], function(_,
            $,
            hammer,
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

        uiElement.click(function() {
            self.toggleName();
        });

        uiElement.append(nameContainerUI);
        uiElement.append(infoUI);

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

    function Display() {
        var self = this;
        var uiElement = ui.div("display");
        var personDisplays = [];

        var currentPosition = 0;
        var y = 0;

        var hammertime = Hammer(uiElement, {
            transform_always_block: true,
            transform_min_scale: 1,
            drag_block_horizontal: true,
            drag_block_vertical: true,
            drag_min_distance: 0
        });

        hammertime.on('dragup dragdown swipeup swipedown release', function(ev) {
            ev.gesture.preventDefault();
            switch(ev.type) {
                case 'dragup':
                case 'dragdown':
                    /*
                    // stick to the finger
                    var pane_offset = -(100/pane_count)*current_pane;
                    var drag_offset = ((100/pane_width)*ev.gesture.deltaX) / pane_count;

                    // slow down at the first and last pane
                    if((current_pane == 0 && ev.gesture.direction == "down") ||
                        (current_pane == pane_count-1 && ev.gesture.direction == "up")) {
                        drag_offset *= .4;
                    }

                    setContainerOffset(drag_offset + pane_offset);
                    */
                    y = currentPosition + ev.gesture.deltaY;
                    uiElement.translate({
                        y: y
                    });
                    break;

                case 'swipeup':
                    console.log("swipeup");
                    ev.gesture.stopDetect();
                    break;

                case 'swipedown':
                    console.log("swipedown");
                    ev.gesture.stopDetect();
                    break;

                case 'release':
                    // more then 50% moved, navigate
                    currentPosition = y;
                    console.log("current y: " + currentPosition);
                    /*
                    if(Math.abs(ev.gesture.deltaX) > pane_width/2) {
                        if(ev.gesture.direction == 'right') {
                            self.prev();
                        } else {
                            self.next();
                        }
                    }
                    else {
                        self.showPane(current_pane, true);
                    }
                    */
                    break;
            }

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