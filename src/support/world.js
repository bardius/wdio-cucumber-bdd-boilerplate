const { expect } = require("chai");
const { assert } = require("chai");
const chalk = require("chalk");

const config = require("../../config/cucumber.globals.config");

const processSelector = function(selector) {
  const subSelectors = selector.split("|");
  let combinedSelector = "";

  subSelectors.forEach(subSelector => {
    const resolvedSelector = getSelector(subSelector);

    if (resolvedSelector.indexOf("|") > -1) {
      combinedSelector += processSelector(resolvedSelector);
    } else {
      combinedSelector += `${resolvedSelector} `;
    }
  });

  return combinedSelector;
};

const getSelector = function(element) {
  let dataSelector = element;
  // let dataSelector = element.indexOf(' ') > 1 ? '[data-selector*="' : '[data-selector="';

  if (config.locators[element]) {
    dataSelector = config.locators[element];
  } else if (config.testData[element]) {
    dataSelector = config.testData[element];
  }

  return dataSelector;
};

const getTestData = function(dataKey) {
  return config.testData[dataKey];
};

// helper method to retrieve all violations from aXe as JSON string
const getViolationSummary = function(violation) {
  let violationSummary = '{"Violation":[';
  const totalKeys = violation.length;
  let keyIndex = 0;

  for (const key in violation) {
    violationSummary += JSON.stringify(encodeURI(violation[key]), null, 2);
    keyIndex++;
    if (keyIndex < totalKeys) {
      violationSummary += ",";
    }
  }
  violationSummary += "]}";

  return violationSummary;
};

try {
  // Setting up config object
  config.serverUrls = global.browser.options.serverUrls;
  config.expectedResponseFolderPath = global.browser.options.expectedResponseFolderPath;
  config.jsonRequestFolderPath = global.browser.options.jsonRequestFolderPath;
  config.xmlFolderPath = global.browser.options.xmlFolderPath;
  config.swaggerFilePath = global.browser.options.swaggerFilePath;
  config.capabilities = global.browser.options.desiredCapabilities;
  config.isVisualRegressionCompareMode = global.browser.options.isVisualRegressionCompareMode;
  config.isVisualRegressionMode = global.browser.options.isVisualRegressionMode;
  config.viewportSize = global.browser.options.viewportSize.split("x");

  // Determine if the authentication steps should be skipped
  config.env = global.browser.options.env;
  config.itShouldNotLogin = false; // config.env && (config.env === 'local');

  exports.World = {
    assert,
    expect,
    client: global.browser,
    config,
    getTestData,
    getSelector,
    getViolationSummary,
    getTodaysDate() {
      const currentDate = new Date();
      return [`0${currentDate.getDate()}`.slice(-2), `0${currentDate.getMonth() + 1}`.slice(-2), currentDate.getFullYear()].join("/");
    },
    getRandomString() {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      const totalChars = chars.length;
      let randomString = "";
      let randomNumber = 0;

      for (let i = 0; i < 10; i++) {
        randomNumber = Math.floor(Math.random() * totalChars);
        randomString += chars.substring(randomNumber, randomNumber + 1);
      }

      return randomString;
    }
  };
} catch (error) {
  console.log(chalk.red(`Error in World creation: ${error}`));
}
