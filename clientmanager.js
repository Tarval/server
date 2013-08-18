var EventEmitter = require("events").EventEmitter;

var ClientManager = function() {
    var self = this;

    self.passPhoneEvent = function(name, connection) {
        return function(e) {
            connection.sendEvent(name, { v: e.v });
        }
    }

    self.on("bindPin", function(connection, data) {
        data.pin = parseInt(data.pin);
        console.log("[" + data.pin + "] Bound by client");

        // Listen for the phone doing things
        self.phone_manager.on(data.pin + ":keyUp", self.passPhoneEvent("keyUp", connection));
        self.phone_manager.on(data.pin + ":keyDown", self.passPhoneEvent("keyDown", connection));
        self.phone_manager.on(data.pin + ":tilt", self.passPhoneEvent("tilt", connection));

        self.phone_manager.on(data.pin + ":phoneReady", function() {
            connection.sendEvent("phoneReady");
        });

        self.phone_manager.on(data.pin + ":phoneClose", function() {
            connection.sendEvent("phoneClose");
        });

        connection.sendEvent("pinBound", { pin: data.pin });

        console.log(self.phone_manager.bound_pins);
        if(self.phone_manager.bound_pins.indexOf(data.pin) != -1) {
            console.log("Phone connected");
            connection.sendEvent("phoneReady");
        }
    });
}

ClientManager.prototype.__proto__ = EventEmitter.prototype;

exports.ClientManager = ClientManager;
