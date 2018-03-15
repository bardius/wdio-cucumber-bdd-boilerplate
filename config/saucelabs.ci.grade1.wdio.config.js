const argv = require('yargs').argv;
const path = require('path');

const wdioConfig = require('./saucelabs.grade1.wdio.config.js');

global.sauceConnectProcess = null;

const tunnelIdentifier = argv.tunnel || `bdd-tests-saucelabs-tunnel-${Math.round(Math.random() * 10) + 1}`;
const logFile = path.join(__dirname, '/../output/saucelabs-connect.log');

// Specify the port for the Selenium
// 4444 for local run, 4445 for Saucelabs and  4723 for Appium
const port = 4445;
wdioConfig.config.port = port;

wdioConfig.config.sauceConnectOpts.proxy = null;
wdioConfig.config.sauceConnectOpts.proxyTunnel = false;
wdioConfig.config.sauceConnectOpts.pac = null;
wdioConfig.config.sauceConnectOpts.tunnelIdentifier = tunnelIdentifier;
wdioConfig.config.sauceConnectOpts.logfile = logFile;

exports.config = wdioConfig.config;
