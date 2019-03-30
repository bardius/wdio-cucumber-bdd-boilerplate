const os = require("os");
const path = require("path");
const argv = require("yargs").argv;
const timeout = argv.timeout || 115 * 1000;

const getReportMetaPlatform = function(osPlatform) {
  const platformMap = {
    darwin: "osx",
    linux: "linux",
    win32: "windows",
    win64: "windows",
    ios: "ios",
    android: "android",
    ubuntu: "linux"
  };

  return platformMap[osPlatform] || osPlatform;
};

module.exports = {
  getCapability: function(browser, isHeadlessBrowser, maxInstances) {
    // Normalise Edge browser name
    browser = browser === "edge" ? "MicrosoftEdge" : browser;

    // Normalise Internet Explorer browser name
    browser = browser === "ie" ? "internet explorer" : browser;

    // Set the browser options arguments
    let firefoxOptionsArgs = [];
    let chromeOptionsArgs = ["disable-extensions", "start-maximized", "ignore-certificate-errors"];

    if (isHeadlessBrowser) {
      chromeOptionsArgs.push("headless", "disable-gpu");
      firefoxOptionsArgs.push("-headless");
    }

    // Instantiate the capability object
    let capability = {
      maxInstances: maxInstances,
      browserName: browser,
      version: null,
      maxDuration: 10 * timeout,
      idleTimeout: timeout,
      commandTimeout: timeout,
      locationContextEnabled: true,
      acceptSslCerts: true,
      unexpectedAlertBehaviour: "accept",
      autoAcceptAlerts: true,
      acceptInsecureCerts: true,
      metadata: {
        browser: {
          name: browser === "MicrosoftEdge" ? "edge" : browser,
          version: "latest"
        },
        device: "desktop",
        platform: {
          name: getReportMetaPlatform(os.platform()),
          version: os.release()
        }
      }
    };

    // Enhance the capability object based on browser selection
    switch (browser) {
      case "chrome":
        capability["version"] = "latest";
        capability["chromeOptions"] = {
          prefs: {
            credentials_enable_service: false,
            profile: {
              password_manager_enabled: false
            }
          },
          args: chromeOptionsArgs
        };
        capability["metadata"]["browser"]["version"] = "latest";
        break;

      case "firefox":
        capability["version"] = "66.0.2";
        capability["moz:firefoxOptions"] = {
          binary: path.join("C:", "Program Files (x86)", "Mozilla Firefox", "firefox.exe"),
          args: firefoxOptionsArgs,
          log: {
            level: "trace"
          }
        };
        capability["metadata"]["browser"]["version"] = "66.0.2";
        break;

      case "safari":
        capability["version"] = "11.0";
        capability["os"] = "OS X";
        capability["browserName"] = "Safari";
        capability["browser_version"] = "11.0";
        capability["version"] = "11.0";
        capability["metadata"]["browser"]["version"] = "11.0";
        break;

      case "MicrosoftEdge":
        capability["version"] = "18.17763";
        capability["enableNativeEvents"] = true;
        capability["ignoreProtectedModeSettings"] = true;
        capability["enablePersistentHover"] = true;
        capability["handlesAlerts"] = true;
        capability["ignoreZoomSetting"] = true;
        capability["enableElementCacheCleanup"] = true;
        capability["disable-popup-blocking"] = true;
        capability["ie.browserCommandLineSwitches"] = "";
        capability["unexpectedAlertBehaviour"] = "InternetExplorerUnexpectedAlertBehaviour.Accept";
        capability["metadata"]["browser"]["version"] = "18.17763";
        break;

      case "internet explorer":
        capability["version"] = "11.0";
        capability["enableNativeEvents"] = true;
        capability["ignoreProtectedModeSettings"] = true;
        capability["enablePersistentHover"] = true;
        capability["handlesAlerts"] = true;
        capability["ignoreZoomSetting"] = true;
        capability["enableElementCacheCleanup"] = true;
        capability["disable-popup-blocking"] = true;
        capability["ie.browserCommandLineSwitches"] = "";
        capability["unexpectedAlertBehaviour"] = "InternetExplorerUnexpectedAlertBehaviour.Accept";
        capability["metadata"]["browser"]["version"] = "11.0";
        break;

      default:
    }

    return capability;
  }
};
