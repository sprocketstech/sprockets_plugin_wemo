"use strict";
var SDK = require('sprockets-sdk');
var OUTLET_OUTPUT_ID = 'OUTLET_OUTPUT';

var WemoSwitch = function(name, instance, id, api) {
    this.instance = instance;
    this.api = api;
    this.id = id;
    instance.addControl(new SDK.Devices.DeviceBooleanComponent(OUTLET_OUTPUT_ID, name + ' Output', SDK.DeviceType.OUTLET));
};

WemoSwitch.prototype.start = function() {
    var that = this;
    var client = this.api.getDevice(this.id);

    client.on('binaryState', function(value) {
        var state = (value === '1') ? true : false;
        that.instance.updateControlValue(OUTLET_OUTPUT_ID, state);
    });
};

WemoSwitch.prototype.shutdown = function() {
};


WemoSwitch.prototype.setComponentValues = function(newVals) {
    if (newVals.controls.hasOwnProperty(OUTLET_OUTPUT_ID)) {
        var client = this.api.getDevice(this.id);
        var o1 = newVals.controls[OUTLET_OUTPUT_ID].value;
        var newVal;
        newVal = (o1 === 'true' || o1 === true) ? 1 : 0;

        //set the val
        client.setBinaryState(newVal);
        this.instance.updateControlValue(OUTLET_OUTPUT_ID, newVal === 1);
    }
};

module.exports = WemoSwitch;

