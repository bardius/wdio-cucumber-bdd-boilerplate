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
    os: "iOS",
    os_version: "11.0",
    device: "iPad 5th",
    deviceOrientation: "portrait",
    browserName: "iPad",
    metadata: {
      browser: {
        name: "iPad",
        version: "11.0"
      },
      device: "iPad 5th",
      platform: {
        name: "ios",
        version: "11.0"
      }
    }
  },
  {
    os: "Android",
    os_version: "6.0",
    device: "Samsung Galaxy Note 4",
    deviceOrientation: "portrait",
    browserName: "Android",
    metadata: {
      browser: {
        name: "Android",
        version: "6.0"
      },
      device: "Samsung Galaxy Note 8",
      platform: {
        name: "android",
        version: "6.0"
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
