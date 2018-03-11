const argv = require('yargs').argv;
const path = require('path');

const wdioConfig = require('./saucelabs.grade1.wdio.config.js');

// Specify the port for the Selenium
// 4444 for local run, 4445 for Saucelabs and  4723 for Appium
const port = 4445;

wdioConfig.config.host = 'localhost';
wdioConfig.config.port = port;
wdioConfig.config.path = '/wd/hub';
wdioConfig.config.user = ['Saucelabs_user'];
wdioConfig.config.key = ['Saucelabs_key'];

wdioConfig.config.sauceConnect = false;
wdioConfig.config.services = [];
wdioConfig.config.sauceConnectOptions = {};
wdioConfig.config.recordVideo = true;
wdioConfig.config.recordScreenshots = true;

exports.config = wdioConfig.config;
