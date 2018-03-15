const argv = require('yargs').argv;
const path = require('path');

const wdioConfig = require('./wdio.config.js');

global.sauceConnectProcess = null;

const tunnelIdentifier = argv.tunnel || `bdd-tests-saucelabs-tunnel-${Math.round(Math.random() * 10) + 1}`;
const logFile = path.join(__dirname, '/../output/saucelabs-connect.log');

// Specify the port for the Selenium
// 4444 for local run, 4445 for Saucelabs and  4723 for Appium
const port = 4445;
wdioConfig.config.port = port;

wdioConfig.config.user = 'Saucelabs_user';
wdioConfig.config.key = 'Saucelabs_key';

wdioConfig.config.services.push('sauce');
wdioConfig.config.sauceConnect = true;

wdioConfig.config.sauceConnectOpts = {
    username: 'Saucelabs_user',
    accessKey: 'Saucelabs_key',
    proxy: null,
    proxyTunnel: false,
    pac: null,
    verbose: true,
    verboseDebugging: true,
    vv: true,
    port: port,
    maxLogsize: 1000000,
    tunnelIdentifier: tunnelIdentifier,
    logger: console.log,
    logfile: logFile
};

wdioConfig.config.recordVideo = true;
wdioConfig.config.recordScreenshots = true;
wdioConfig.config.videoUploadOnPass = false;
wdioConfig.config.webdriverRemoteQuietExceptions = false;

wdioConfig.config.loglevel = 'silent';

wdioConfig.config.capabilities = [
    {
        maxInstances: 1,
        browserName: 'Chrome',
        version: 'latest',
        platform: 'Windows 10',
        maxDuration: 10800,
        idleTimeout: 900,
        commandTimeout: 600,
        screenResolution: '1024x768',
        acceptInsecureCerts: true,
        seleniumVersion: '3.4.0',
        name: 'Sample-Chrome-Win1-Grade1',
        'tunnel-identifier': tunnelIdentifier,
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
        maxInstances: 1,
        browserName: 'Safari',
        version: '9',
        platform: 'OS X 10.11',
        maxDuration: 10800,
        idleTimeout: 900,
        commandTimeout: 600,
        screenResolution: '1024x768',
        acceptInsecureCerts: true,
        seleniumVersion: '3.4.0',
        name: 'Sample-Safari-OSX10-Grade1'
    }
];

exports.config = wdioConfig.config;
