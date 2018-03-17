const argv = require('yargs').argv;
const path = require('path');

const wdioConfig = require('./wdio.saucelabs.grade1.config.js');

global.sauceConnectProcess = null;

wdioConfig.config.capabilities = [
    {
        browserName: 'Chrome',
        version: 'latest',
        platform: 'Windows 10',
        maxDuration: 10800,
        idleTimeout: 900,
        commandTimeout: 600,
        screenResolution: '1024x768',
        acceptInsecureCerts: true,
        seleniumVersion: '3.4.0',
        name: 'Sample-Chrome-Win1-Grade2',
        chromeOptions: {
            prefs: {
                credentials_enable_service: false,
                profile: {
                    password_manager_enabled: false
                }
            },
            args: [
                'disable-extensions',
                'start-maximized'
            ]
        }
    },
    {
        browserName: 'Safari',
        version: '9',
        platform: 'OS X 10.11',
        maxDuration: 10800,
        idleTimeout: 900,
        commandTimeout: 600,
        screenResolution: '1024x768',
        acceptInsecureCerts: true,
        seleniumVersion: '3.4.0',
        name: 'Sample-Safari-OSX10-Grade2'
    }
];

exports.config = wdioConfig.config;
