var EventEmitter = require("events").EventEmitter;

var PhoneManager = function() {
    var self = this;
    self.bound_pins = [];

    self.on("getPin", function(connection, data) {
        connection.pin = (Math.random(1) * 1000).toFixed(0);
        connection.sendEvent("setPin", { pin: connection.pin });
        self.emit(connection.pin + ":phoneReady");

        self.bound_pins.push(parseInt(connection.pin));
    });

    self.on("close", function(connection, data) {
        if(!connection.pin) {
            return;
        }

        console.log("[" + connection.pin +"] Closed");
        self.emit(connection.pin + ":phoneClose");
        self.bound_pins.splice(self.bound_pins.indexOf(connection.pin), 1);
    });

    self.on("restorePin", function(connection, data) {
        connection.pin = data.pin;
        connection.sendEvent("setPin", { pin: connection.pin });
        self.emit(connection.pin + ":phoneReady");

        console.log("[" +connection.pin + "] Restored pin");
    });

    self.on("keyDown", function(connection, data){
        console.log("[pin:" + connection.pin + "] Event keyDown on " + data.v);
        self.emit(connection.pin + ":keyDown", { v: data.v });
    });

    self.on("keyUp", function(connection, data){
        console.log("[pin:" + connection.pin + "] Event keyUp on " + data.v);
        self.emit(connection.pin + ":keyUp", { v: data.v });
    });

    self.on("tilt", function(connection, data) {
        console.log("[pin:" + connection.pin + "] Event tilt on " + data.v);
        self.emit(connection.pin + ":tilt", { v: data.v });
    });
}

PhoneManager.prototype.__proto__ = EventEmitter.prototype;

exports.PhoneManager = PhoneManager;
