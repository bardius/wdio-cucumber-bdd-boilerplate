const argv = require('yargs').argv;
const path = require('path');

const wdioConfig = require('./wdio.config.js');

global.sauceConnectProcess = null;

const sauceUser = 'Saucelabs_user';
const sauceKey = 'Saucelabs_key';

const scProxy = argv.scProxy || null;
const scPac = argv.scPac ? 'file://' + path.join(__dirname, '/proxies/sample-proxy.js') : null;
const proxyTunnel = argv.proxyTunnel || false;

const tunnelIdentifier = argv.tunnel || `bdd-tests-saucelabs-tunnel-${Math.round(Math.random() * 10) + 1}`;
const logFile = path.join(__dirname, '/../output/saucelabs-connect.log');

// Specify the port for the Selenium
// 4444 for local run, 4445 for Saucelabs and  4723 for Appium
const port = argv.port || 4445;
wdioConfig.config.port = port;

wdioConfig.config.user = sauceUser;
wdioConfig.config.key = sauceKey;

wdioConfig.config.services.push('sauce');
wdioConfig.config.sauceConnect = true;

wdioConfig.config.sauceConnectOpts = {
    username: sauceUser,
    accessKey: sauceKey,
    proxy: scProxy,
    proxyTunnel: proxyTunnel,
    pac: scPac,
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
        name: 'Sample-Safari-OSX10-Grade1'
    }
];

exports.config = wdioConfig.config;
