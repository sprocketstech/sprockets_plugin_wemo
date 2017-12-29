"use strict";
var Wemo = require('wemo-client');
var wemo = new Wemo();
var util = require('util');
var WemoAPI = function() {
    this.devices = {};
    this._discover();
    this._discover();
    this._discover();
};

WemoAPI.prototype.getDevices = function() {
    return this.devices;
};

WemoAPI.prototype.getDevice = function(id) {
    var inst = wemo.client(this.devices[id].device);
    return inst;
};


WemoAPI.prototype.getDeviceType = function(id) {
    return this.devices[id].type;
};

WemoAPI.prototype.getDeviceName = function(id) {
    return this.devices[id].name;
};

WemoAPI.prototype.refresh = function(callback) {
    this._discover();
    var devs = [];
    for (var k in this.devices) {
        devs.push({
            id: this.devices[k].id,
            name: this.devices[k].name,
            type: this.devices[k].type
        });
    }
    callback(devs);
};

WemoAPI.prototype._discover = function() {
    var that = this;
    wemo.discover(function(err, deviceInfo) {
        if (deviceInfo) {
            if (!that.devices.hasOwnProperty(deviceInfo.serialNumber)) {
                that.devices[deviceInfo.serialNumber] = {};
                that.devices[deviceInfo.serialNumber].id = deviceInfo.serialNumber;
            }
            that.devices[deviceInfo.serialNumber].name = deviceInfo.friendlyName;
            switch (deviceInfo.deviceType) {
                case Wemo.DEVICE_TYPE.Switch:
                    that.devices[deviceInfo.serialNumber].type = "Switch";
                    break;
                case Wemo.DEVICE_TYPE.Bridge:
                    that.devices[deviceInfo.serialNumber].type = "Bridge";
                    break;
                case Wemo.DEVICE_TYPE.Motion:
                    that.devices[deviceInfo.serialNumber].type = "Motion";
                    break;
                case Wemo.DEVICE_TYPE.Maker:
                    that.devices[deviceInfo.serialNumber].type = "Maker";
                    break;
                case Wemo.DEVICE_TYPE.Insight:
                    that.devices[deviceInfo.serialNumber].type = "Insight";
                    break;
                case Wemo.DEVICE_TYPE.LightSwitch:
                    that.devices[deviceInfo.serialNumber].type = "Light Switch";
                    break;
                case Wemo.DEVICE_TYPE.Dimmer:
                    that.devices[deviceInfo.serialNumber].type = "Dimmer";
                    break;
                case Wemo.DEVICE_TYPE.Humidifier:
                    that.devices[deviceInfo.serialNumber].type = "Humidifier";
                    break;
                case Wemo.DEVICE_TYPE.HeaterB:
                    that.devices[deviceInfo.serialNumber].type = "Heater";
                    break;
                default:
                    that.devices[deviceInfo.serialNumber].type = "Unknown";
                    break;

            }
            that.devices[deviceInfo.serialNumber].device = deviceInfo;

        }
    });
}

module.exports = new WemoAPI();