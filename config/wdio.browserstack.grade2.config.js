const argv = require("yargs").argv;
const path = require("path");

const wdioConfig = require("./wdio.browserstack.grade1.config");
const seleniumConfig = require("./selenium.config");
const packageJson = require("../package");

const isBrowserStackLocal = argv.bsLocal || false;
const isDebugMode = argv.debugMode || false;

// Specify max concurrent browser instances
const maxInstances = argv.maxInstances || 1;

const timeout = argv.timeout || 115 * 1000;

const browserStackUser = argv.bsUser || process.env.BROWSERSTACK_USERNAME;
const browserStackKey = argv.bsKey || process.env.BROWSERSTACK_ACCESS_KEY;

const proxyHost = argv.proxyHost || "localhost";
const proxyPort = argv.proxyPort || 8080;

const tunnelIdentifier = argv.tunnel || `browserstack-tunnel-${Math.round(Math.random() * 10) + 1}`;
const logFile = path.join(__dirname, "/../output/browserstack-connect.log");

const currentSuite = argv.suite || "all suites";

// Specify the port and proxy for the remote Browserstack Selenium hub
const port = argv.port || 80;
const webDriverProxy = argv.proxy || `http://${proxyHost}:${proxyPort}`;

wdioConfig.config.port = port;
wdioConfig.config.proxy = webDriverProxy;

wdioConfig.config.user = browserStackUser;
wdioConfig.config.key = browserStackKey;

wdioConfig.config.browserStackLocal = isBrowserStackLocal;

wdioConfig.config.browserstackOpts = {
  user: browserStackUser,
  key: browserStackKey,
  forceLocal: isBrowserStackLocal,
  parallelRuns: maxInstances,
  onlyAutomate: isBrowserStackLocal,
  proxyHost: proxyHost,
  proxyPort: proxyPort,
  localProxyHost: proxyHost,
  localProxyPort: proxyPort,
  forceProxy: isBrowserStackLocal,
  localIdentifier: tunnelIdentifier,
  enableLoggingForApi: isDebugMode,
  debug: isDebugMode,
  debugUtility: isDebugMode,
  debugUrl: isDebugMode,
  logFile: logFile
};

wdioConfig.config.capabilities = [
  {
    resolution: wdioConfig.config.viewportSize,
    os: "Windows",
    os_version: "10",
    browserName: "IE",
    browser_version: "11.0",
    enableNativeEvents: true,
    ignoreProtectedModeSettings: true,
    enablePersistentHover: true,
    handlesAlerts: true,
    ignoreZoomSetting: true,
    enableElementCacheCleanup: true,
    "disable-popup-blocking": true,
    "ie.browserCommandLineSwitches": "",
    metadata: {
      browser: {
        name: "internet explorer",
        version: "11.0"
      },
      device: "desktop",
      platform: {
        name: "windows",
        version: "10"
      }
    }
  },
  {
    resolution: wdioConfig.config.viewportSize,
    os: "OS X",
    os_version: "High Sierra",
    browserName: "Safari",
    browser_version: "11.1",
    "safari.options": {
      secureSsl: false
    },
    "browserstack.safari.allowAllCookies": "true",
    "browserstack.selenium_version": null,
    metadata: {
      browser: {
        name: "safari",
        version: "11.1"
      },
      device: "desktop",
      platform: {
        name: "osx",
        version: "High Sierra"
      }
    }
  }
];

wdioConfig.config.capabilities.forEach(capability => {
  capability["project"] = packageJson.name;
  capability["build"] = packageJson.version;
  capability["name"] = `${packageJson.name} Test suite: ${currentSuite}`;
  capability["browserstack.idleTimeout"] = 120; // in seconds, max allowed is 300
  capability["browserstack.local"] = isBrowserStackLocal;
  capability["browserstack.debug"] = isDebugMode;
  capability["browserstack.console"] = isDebugMode ? "verbose" : "info";
  capability["browserstack.networkLogs"] = isDebugMode;
  capability["browserstack.selenium_version"] = capability["browserstack.selenium_version"] || seleniumConfig.seleniumVersion;
  capability["browserstack.localIdentifier"] = tunnelIdentifier;
  capability["browserstack.ie.enablePopups"] = true;
  capability["browserstack.safari.enablePopups"] = true;
  capability["maxDuration"] = 10 * timeout;
  capability["idleTimeout"] = timeout;
  capability["commandTimeout"] = timeout;
  capability["acceptSslCerts"] = true;
  capability["acceptInsecureCerts"] = true;
  capability["autoAcceptAlerts"] = true;
  capability["locationContextEnabled"] = true;
  capability["javascriptEnabled"] = true;
  capability["unexpectedAlertBehaviour"] = capability["unexpectedAlertBehaviour"] || "accept";
});

exports.config = wdioConfig.config;
