const argv = require("yargs").argv;
const isDebugMode = argv.debugMode || false;
const logsDir = "output/logs";

const versions = {
  selenium: "3.141.59",
  edge: "17134",
  ie: "3.14.0",
  firefox: "0.24.0",
  chrome: "73.0.3683.68"
};

const seleniumArgs = ["-log", `${logsDir}/selenium-server.log`];
if (isDebugMode) {
  seleniumArgs.push("-debug");
}

const seleniumJavaArgs = [];
if (isDebugMode) {
  seleniumJavaArgs.push(
    `-Dwebdriver.chrome.logfile=./${logsDir}/chrome-browser.log`,
    `-Dwebdriver.firefox.logfile=./${logsDir}/firefox-browser.log`,
    `-Dwebdriver.ie.driver.logfile=./${logsDir}/ie-browser.log`,
    `-Dwebdriver.edge.logfile=./${logsDir}/edge-browser.log`,
    "-DlogLevel=DEBUG"
  );
}

module.exports = {
  seleniumLogs: `./${logsDir}/selenium-server.log`,
  seleniumArgs: {
    version: versions.selenium,
    seleniumArgs: seleniumArgs,
    javaArgs: seleniumJavaArgs,
    drivers: {
      edge: {
        version: versions.edge
      },
      ie: {
        version: versions.ie
      },
      firefox: {
        version: versions.firefox
      },
      chrome: {
        version: versions.chrome
      }
    }
  },
  seleniumInstallArgs: {
    baseURL: "https://selenium-release.storage.googleapis.com",
    version: versions.selenium,
    drivers: {
      edge: {
        version: versions.edge
      },
      ie: {
        version: versions.ie,
        baseURL: "https://selenium-release.storage.googleapis.com"
      },
      firefox: {
        version: versions.firefox,
        baseURL: "https://github.com/mozilla/geckodriver/releases/download"
      },
      chrome: {
        version: versions.chrome,
        baseURL: "https://chromedriver.storage.googleapis.com"
      }
    },
    logger: message => {
      process.stdout.write(`${message} \n`);
    },
    processCb: (totalLength, processLength) => {
      process.stdout.write(`Downloading drivers: ${Math.round((processLength / totalLength) * 100)}% \n`);
    }
  }
};
