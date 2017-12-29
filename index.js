"use strict";

var SDK = require('sprockets-sdk');
var util = require('util');
var wemoAPI = require('./WeMoAPI.js');
var WemoSwitch = require('./WeMoSwitch.js');
var WemoLightSwitch = require('./WeMoLightSwitch.js');
var WemoUnknown = require('./WeMoUnknown.js');
var WeMoInstance = function(id, config, services) {
    SDK.Devices.DeviceInstance.call(this, id);
    this.config = config;
    this.instance = null;

    
    //this.loggingService = services.resolve('loggingService');
};

util.inherits(WeMoInstance, SDK.Devices.DeviceInstance);

/*Overrides of Device Instance */

WeMoInstance.prototype.start = function() {
    this._getInstance().start();
};

WeMoInstance.prototype.shutdown = function() {
    this._getInstance().shutdown();
};


WeMoInstance.prototype.setComponentValues = function(newVals) {
    this._getInstance().setComponentValues(newVals);
};

WeMoInstance.prototype.invokeCommand = function(commandId) {
    //no commands
};

WeMoInstance.prototype._getInstance = function() {
    if (!this.instance) {
        var deviceType = wemoAPI.getDeviceType(this.config.id);
        var deviceName = wemoAPI.getDeviceName(this.config.id);
        switch (deviceType) {
            case "Switch":
                this.instance = new WemoSwitch(deviceName, this, this.config.id, wemoAPI);
                break;
            case "Light Switch":
                this.instance = new WemoLightSwitch(deviceName, this, this.config.id, wemoAPI);
                break;
            default:
                this.instance = new WemoUnknown(deviceName, this, this.config.id, wemoAPI);
                break;
        };
    }
    return this.instance;
};

var WeMoPlugin = function() {
    SDK.Devices.DevicePlugin.call(this, 'WeMo® Device');
    this.setUIModule('sprockets.plugin.wemo', 'wemoUI.js');
    this.setUIConfigHTML('wemoConfig.html');
    wemoAPI.refresh(function() {});
};

util.inherits(WeMoPlugin, SDK.Devices.DevicePlugin);


WeMoPlugin.prototype.createInstance = function(id, config, services) {
    return new WeMoInstance(id, config, services);
};


WeMoPlugin.prototype.loadConfig = function(config, callback) {
    var retVal = {
        availableDevices: []
    };
    setTimeout(function() {
        wemoAPI.refresh(function(devices) {
            retVal.availableDevices = devices;
            callback(retVal);
        });
    }, 500);
};


module.exports = new WeMoPlugin();