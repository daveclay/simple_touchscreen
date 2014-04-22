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

        var nameUI = ui.span("person-name");
        nameUI.text(person.getName());

        var bioUI = ui.div("person-bio");
        bioUI.text(person.getBio());

        var donationUI = ui.div("person-donation");
        donationUI.text(person.getDonation());

        var photoUI = ui.div("person-photo-container");
        var img = ui.img(person.getPhoto(), "person-photo");
        photoUI.append(img);

        var uiElement = ui.div("person-display");
        uiElement.onceOnAnimationEnd(function(event) {
            bioUI.addClass("person-bio-selected");
            // bioUI.removeClass("person-bio-selected");
        });

        uiElement.click(function() {
            self.toggleName();
        });

        uiElement.append(nameUI);
        uiElement.append(donationUI);
        uiElement.append(bioUI);
        uiElement.append(photoUI);

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
            uiElement.addClass("person-display-deselected");
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