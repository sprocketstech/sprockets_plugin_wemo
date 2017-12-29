var rewire = require('rewire');
var util = require('util');
var WemoSwitch = require('../WeMoSwitch.js');
var WemoLightSwitch = require('../WeMoLightSwitch.js');

describe('wemo-plugin', function() {

    beforeEach(function() {
    });

    afterEach(function() {
    });

    it('loadConfig should return devices', function(done) {
        var wemoPlugin = rewire('../index.js');
        //mock out wemoapi
        var mock = {
            refresh: function(callback) {
                callback([
                    {id: 1},
                    {id: 2}
                ]);
            }
        };
        
        wemoPlugin.__set__("wemoAPI", mock);

        wemoPlugin.loadConfig({}, function(devices) {
            expect(devices.availableDevices.length).toBe(2);
            expect(devices.availableDevices[0].id).toBe(1);
            done();
        });
    });

    it('createInstance should return an instance', function(done) {
        var wemoPlugin = rewire('../index.js');
        //mock out wemoapi
        var mock = {
            refresh: function(callback) {
                callback([
                    {id: 1},
                    {id: 2}
                ]);
            }
        };

        wemoPlugin.__set__("wemoAPI", mock);

        var instance = wemoPlugin.createInstance(123, {}, {});
        expect(instance).not.toBe(null);
        done();
    });

    it('createInstance should set the id', function(done) {
        var wemoPlugin = rewire('../index.js');
        //mock out wemoapi
        var mock = {
            refresh: function(callback) {
                callback([
                    {id: 1},
                    {id: 2}
                ]);
            }
        };

        wemoPlugin.__set__("wemoAPI", mock);

        var instance = wemoPlugin.createInstance(123, {}, {});
        expect(instance.id).toBe(123);
        done();
    });

    //************************************************************************************************
    // Switch
    //************************************************************************************************


    it('createInstance should create switch type on start', function(done) {
        var wemoPlugin = rewire('../index.js');
        //mock out wemoapi
        var mock = {
            getDeviceType: function(id) {
                return "Switch";
            },
            getDeviceName: function(id) {
                return "Test Switch";
            },
            getDevice: function(id) {
                return {
                    on: function() {

                    }
                }
            }
        };

        wemoPlugin.__set__("wemoAPI", mock);
        var instance = wemoPlugin.createInstance(123, {}, {});
        instance.start();
        expect(instance.instance instanceof WemoSwitch).toBe(true);
        done();
    });

    it('switch type should create outlet control', function(done) {
        var wemoPlugin = rewire('../index.js');
        //mock out wemoapi
        var mock = {
            getDeviceType: function(id) {
                return "Switch";
            },
            getDeviceName: function(id) {
                return "Test Switch";
            },
            getDevice: function(id) {
                return {
                    on: function() {

                    }
                }
            }
        };

        wemoPlugin.__set__("wemoAPI", mock);
        var instance = wemoPlugin.createInstance(123, {}, {});
        instance.start();
        expect(instance._metadata.controls.OUTLET_OUTPUT.controlType).toBe('boolean');
        expect(instance._metadata.controls.OUTLET_OUTPUT.deviceType).toBe('outlet');
        expect(instance._metadata.controls.OUTLET_OUTPUT.monitor).toBe(true);

        done();
    });

    it('switch type should update control value on change', function(done) {
        var wemoPlugin = rewire('../index.js');
        var changeCallback = null;
        //mock out wemoapi
        var mock = {
            getDeviceType: function(id) {
                return "Switch";
            },
            getDeviceName: function(id) {
                return "Test Switch";
            },
            getDevice: function(id) {
                return {
                    on: function(name, callback) {
                        changeCallback = callback;
                    }
                }
            }
        };

        wemoPlugin.__set__("wemoAPI", mock);
        var instance = wemoPlugin.createInstance(123, {}, {});
        instance.eventBus = {
            publish: function(messageName, data) {
            },
            subscribe: function() {}
        };

        instance.start();
        changeCallback('1');
        expect(instance._values.controls.OUTLET_OUTPUT.value).toBe(true);
        done();
    });


    it('switch type should set control value on true', function(done) {
        var wemoPlugin = rewire('../index.js');
        var changeCallback = null;
        var setVal = null;
        //mock out wemoapi
        var mock = {
            getDeviceType: function(id) {
                return "Switch";
            },
            getDeviceName: function(id) {
                return "Test Switch";
            },
            getDevice: function(id) {
                return {
                    on: function(name, callback) {
                        changeCallback = callback;
                    },
                    setBinaryState: function(val) {
                        setVal = val;
                    }
                }
            }
        };

        wemoPlugin.__set__("wemoAPI", mock);
        var instance = wemoPlugin.createInstance(123, {}, {});
        instance.eventBus = {
            publish: function(messageName, data) {
            },
            subscribe: function() {}
        };

        instance.start();
        instance.setComponentValues({
            controls: {
                OUTLET_OUTPUT: {
                    value: true
                }
            }
        });
        expect(instance._values.controls.OUTLET_OUTPUT.value).toBe(true);
        expect(setVal).toBe(1);
        done();
    });


    it('switch type should set control value on "true"', function(done) {
        var wemoPlugin = rewire('../index.js');
        var changeCallback = null;
        var setVal = null;
        //mock out wemoapi
        var mock = {
            getDeviceType: function(id) {
                return "Switch";
            },
            getDeviceName: function(id) {
                return "Test Switch";
            },
            getDevice: function(id) {
                return {
                    on: function(name, callback) {
                        changeCallback = callback;
                    },
                    setBinaryState: function(val) {
                        setVal = val;
                    }
                }
            }
        };

        wemoPlugin.__set__("wemoAPI", mock);
        var instance = wemoPlugin.createInstance(123, {}, {});
        instance.eventBus = {
            publish: function(messageName, data) {
            },
            subscribe: function() {}
        };

        instance.start();
        instance.setComponentValues({
            controls: {
                OUTLET_OUTPUT: {
                    value: "true"
                }
            }
        });
        expect(instance._values.controls.OUTLET_OUTPUT.value).toBe(true);
        expect(setVal).toBe(1);
        done();
    });


    it('switch type should set control value on false', function(done) {
        var wemoPlugin = rewire('../index.js');
        var changeCallback = null;
        var setVal = null;
        //mock out wemoapi
        var mock = {
            getDeviceType: function(id) {
                return "Switch";
            },
            getDeviceName: function(id) {
                return "Test Switch";
            },
            getDevice: function(id) {
                return {
                    on: function(name, callback) {
                        changeCallback = callback;
                    },
                    setBinaryState: function(val) {
                        setVal = val;
                    }
                }
            }
        };

        wemoPlugin.__set__("wemoAPI", mock);
        var instance = wemoPlugin.createInstance(123, {}, {});
        instance.eventBus = {
            publish: function(messageName, data) {
            },
            subscribe: function() {}
        };

        instance.start();
        instance.setComponentValues({
            controls: {
                OUTLET_OUTPUT: {
                    value: false
                }
            }
        });
        expect(instance._values.controls.OUTLET_OUTPUT.value).toBe(false);
        expect(setVal).toBe(0);
        done();
    });


    it('switch type should set control value on "false"', function(done) {
        var wemoPlugin = rewire('../index.js');
        var changeCallback = null;
        var setVal = null;
        //mock out wemoapi
        var mock = {
            getDeviceType: function(id) {
                return "Switch";
            },
            getDeviceName: function(id) {
                return "Test Switch";
            },
            getDevice: function(id) {
                return {
                    on: function(name, callback) {
                        changeCallback = callback;
                    },
                    setBinaryState: function(val) {
                        setVal = val;
                    }
                }
            }
        };

        wemoPlugin.__set__("wemoAPI", mock);
        var instance = wemoPlugin.createInstance(123, {}, {});
        instance.eventBus = {
            publish: function(messageName, data) {
            },
            subscribe: function() {}
        };

        instance.start();
        instance.setComponentValues({
            controls: {
                OUTLET_OUTPUT: {
                    value: "false"
                }
            }
        });
        expect(instance._values.controls.OUTLET_OUTPUT.value).toBe(false);
        expect(setVal).toBe(0);
        done();
    });

    //************************************************************************************************
    // Light Switch
    //************************************************************************************************


    it('createInstance should create light switch type on start', function(done) {
        var wemoPlugin = rewire('../index.js');
        //mock out wemoapi
        var mock = {
            getDeviceType: function(id) {
                return "Light Switch";
            },
            getDeviceName: function(id) {
                return "Test Switch";
            },
            getDevice: function(id) {
                return {
                    on: function() {

                    }
                }
            }
        };

        wemoPlugin.__set__("wemoAPI", mock);
        var instance = wemoPlugin.createInstance(123, {}, {});
        instance.start();
        expect(instance.instance instanceof WemoLightSwitch).toBe(true);
        done();
    });

    it('light switch type should create switch control', function(done) {
        var wemoPlugin = rewire('../index.js');
        //mock out wemoapi
        var mock = {
            getDeviceType: function(id) {
                return "Light Switch";
            },
            getDeviceName: function(id) {
                return "Test Switch";
            },
            getDevice: function(id) {
                return {
                    on: function() {

                    }
                }
            }
        };

        wemoPlugin.__set__("wemoAPI", mock);
        var instance = wemoPlugin.createInstance(123, {}, {});
        instance.start();
        expect(instance._metadata.controls.SWITCH_STATE.controlType).toBe('boolean');
        expect(instance._metadata.controls.SWITCH_STATE.deviceType).toBe('switch');
        expect(instance._metadata.controls.SWITCH_STATE.monitor).toBe(true);

        done();
    });

    it('light switch type should update control value on change', function(done) {
        var wemoPlugin = rewire('../index.js');
        var changeCallback = null;
        //mock out wemoapi
        var mock = {
            getDeviceType: function(id) {
                return "Light Switch";
            },
            getDeviceName: function(id) {
                return "Test Switch";
            },
            getDevice: function(id) {
                return {
                    on: function(name, callback) {
                        changeCallback = callback;
                    }
                }
            }
        };

        wemoPlugin.__set__("wemoAPI", mock);
        var instance = wemoPlugin.createInstance(123, {}, {});
        instance.eventBus = {
            publish: function(messageName, data) {
            },
            subscribe: function() {}
        };

        instance.start();
        changeCallback('1');
        expect(instance._values.controls.SWITCH_STATE.value).toBe(true);
        done();
    });


    it('light switch type should set control value on true', function(done) {
        var wemoPlugin = rewire('../index.js');
        var changeCallback = null;
        var setVal = null;
        //mock out wemoapi
        var mock = {
            getDeviceType: function(id) {
                return "Light Switch";
            },
            getDeviceName: function(id) {
                return "Test Switch";
            },
            getDevice: function(id) {
                return {
                    on: function(name, callback) {
                        changeCallback = callback;
                    },
                    setBinaryState: function(val) {
                        setVal = val;
                    }
                }
            }
        };

        wemoPlugin.__set__("wemoAPI", mock);
        var instance = wemoPlugin.createInstance(123, {}, {});
        instance.eventBus = {
            publish: function(messageName, data) {
            },
            subscribe: function() {}
        };

        instance.start();
        instance.setComponentValues({
            controls: {
                SWITCH_STATE: {
                    value: true
                }
            }
        });
        expect(instance._values.controls.SWITCH_STATE.value).toBe(true);
        expect(setVal).toBe(1);
        done();
    });


    it('light switch type should set control value on "true"', function(done) {
        var wemoPlugin = rewire('../index.js');
        var changeCallback = null;
        var setVal = null;
        //mock out wemoapi
        var mock = {
            getDeviceType: function(id) {
                return "Light Switch";
            },
            getDeviceName: function(id) {
                return "Test Switch";
            },
            getDevice: function(id) {
                return {
                    on: function(name, callback) {
                        changeCallback = callback;
                    },
                    setBinaryState: function(val) {
                        setVal = val;
                    }
                }
            }
        };

        wemoPlugin.__set__("wemoAPI", mock);
        var instance = wemoPlugin.createInstance(123, {}, {});
        instance.eventBus = {
            publish: function(messageName, data) {
            },
            subscribe: function() {}
        };

        instance.start();
        instance.setComponentValues({
            controls: {
                SWITCH_STATE: {
                    value: "true"
                }
            }
        });
        expect(instance._values.controls.SWITCH_STATE.value).toBe(true);
        expect(setVal).toBe(1);
        done();
    });


    it('light switch type should set control value on false', function(done) {
        var wemoPlugin = rewire('../index.js');
        var changeCallback = null;
        var setVal = null;
        //mock out wemoapi
        var mock = {
            getDeviceType: function(id) {
                return "Light Switch";
            },
            getDeviceName: function(id) {
                return "Test Switch";
            },
            getDevice: function(id) {
                return {
                    on: function(name, callback) {
                        changeCallback = callback;
                    },
                    setBinaryState: function(val) {
                        setVal = val;
                    }
                }
            }
        };

        wemoPlugin.__set__("wemoAPI", mock);
        var instance = wemoPlugin.createInstance(123, {}, {});
        instance.eventBus = {
            publish: function(messageName, data) {
            },
            subscribe: function() {}
        };

        instance.start();
        instance.setComponentValues({
            controls: {
                SWITCH_STATE: {
                    value: false
                }
            }
        });
        expect(instance._values.controls.SWITCH_STATE.value).toBe(false);
        expect(setVal).toBe(0);
        done();
    });


    it('light switch type should set control value on "false"', function(done) {
        var wemoPlugin = rewire('../index.js');
        var changeCallback = null;
        var setVal = null;
        //mock out wemoapi
        var mock = {
            getDeviceType: function(id) {
                return "Light Switch";
            },
            getDeviceName: function(id) {
                return "Test Switch";
            },
            getDevice: function(id) {
                return {
                    on: function(name, callback) {
                        changeCallback = callback;
                    },
                    setBinaryState: function(val) {
                        setVal = val;
                    }
                }
            }
        };

        wemoPlugin.__set__("wemoAPI", mock);
        var instance = wemoPlugin.createInstance(123, {}, {});
        instance.eventBus = {
            publish: function(messageName, data) {
            },
            subscribe: function() {}
        };

        instance.start();
        instance.setComponentValues({
            controls: {
                SWITCH_STATE: {
                    value: "false"
                }
            }
        });
        expect(instance._values.controls.SWITCH_STATE.value).toBe(false);
        expect(setVal).toBe(0);
        done();
    });


});
