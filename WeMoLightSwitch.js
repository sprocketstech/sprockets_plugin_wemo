"use strict";
var SDK = require('sprockets-sdk');
var SWITCH_STATE = 'SWITCH_STATE';

var WemoLightSwitch = function(name, instance, id, api) {
    this.instance = instance;
    this.api = api;
    this.id = id;
    instance.addControl(new SDK.Devices.DeviceBooleanComponent(SWITCH_STATE, name + ' State', SDK.DeviceType.SWITCH));
};

WemoLightSwitch.prototype.start = function() {
    var that = this;
    var client = this.api.getDevice(this.id);

    client.on('binaryState', function(value) {
        var state = (value === '1') ? true : false;
        that.instance.updateControlValue(SWITCH_STATE, state);
    });
};

WemoLightSwitch.prototype.shutdown = function() {
};


WemoLightSwitch.prototype.setComponentValues = function(newVals) {
    if (newVals.controls.hasOwnProperty(SWITCH_STATE)) {
        var client = this.api.getDevice(this.id);
        var o1 = newVals.controls[SWITCH_STATE].value;
        var newVal;
        newVal = (o1 === 'true' || o1 === true) ? 1 : 0;

        //set the val
        client.setBinaryState(newVal);
        this.instance.updateControlValue(SWITCH_STATE, newVal === 1);
    }
};

module.exports = WemoLightSwitch;

