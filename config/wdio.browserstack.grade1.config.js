const argv = require("yargs").argv;
const path = require("path");

const wdioConfig = require("./wdio.config");
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
wdioConfig.config.host = "hub-cloud.browserstack.com";
wdioConfig.config.path = "/wd/hub";
wdioConfig.config.proxy = webDriverProxy;

wdioConfig.config.user = browserStackUser;
wdioConfig.config.key = browserStackKey;

wdioConfig.config.services = ["browserstack"];

wdioConfig.config.seleniumLogs = null;
wdioConfig.config.seleniumArgs = null;
wdioConfig.config.seleniumInstallArgs = null;

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
  verbose: isDebugMode,
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
    browserName: "Chrome",
    browser_version: "71.0",
    chromeOptions: {
      prefs: {
        credentials_enable_service: false,
        profile: {
          password_manager_enabled: false
        }
      }
    },
    metadata: {
      browser: {
        name: "chrome",
        version: "71.0"
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
    os: "Windows",
    os_version: "10",
    browserName: "Edge",
    browser_version: "17.0",
    enableNativeEvents: true,
    ignoreProtectedModeSettings: true,
    enablePersistentHover: true,
    handlesAlerts: true,
    ignoreZoomSetting: true,
    enableElementCacheCleanup: true,
    "disable-popup-blocking": true,
    metadata: {
      browser: {
        name: "edge",
        version: "17.0"
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
    os: "Windows",
    os_version: "10",
    browserName: "Firefox",
    browser_version: "63.0",
    metadata: {
      browser: {
        name: "firefox",
        version: "63.0"
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
    os_version: "Mojave",
    browserName: "Chrome",
    browser_version: "71.0",
    chromeOptions: {
      prefs: {
        credentials_enable_service: false,
        profile: {
          password_manager_enabled: false
        }
      }
    },
    metadata: {
      browser: {
        name: "chrome",
        version: "71.0"
      },
      device: "desktop",
      platform: {
        name: "osx",
        version: "Mojave"
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
