import { Before, After, Status, BeforeAll, setDefaultTimeout } from "cucumber";

const apickli = require("apickli");
const chalk = require("chalk");

const timeout = 115 * 1000;

BeforeAll(function() {
  // Set selenium timeouts
  browser.timeouts("script", timeout);

  // Set cucumber timeouts
  setDefaultTimeout(timeout);
});

Before(function(scenario) {
  this.apickli = new apickli.Apickli("http", "localhost", "src/files/");
  this.apickli.addRequestHeader("Cache-Control", "no-cache");

  this.currentScenario = scenario;

  if (browser["world"].config) {
    browser.windowHandleSize({
      width: parseInt(browser["world"].config.viewportSize[0] || 1280),
      height: parseInt(browser["world"].config.viewportSize[1] || 1024)
    });
  } else {
    console.log(chalk.red(`World config not set`));
  }
});

Before({ tags: "@manual" }, function(scenario) {
  console.log(chalk.yellow(`Set scenario as skipped: ${scenario.pickle.name}`));
  return Status.SKIPPED;
});

Before({ tags: "@pending or @wip" }, function(scenario) {
  console.log(chalk.yellow(`Set scenario as pending: ${scenario.pickle.name}`));
  return Status.PENDING;
});

After(function(scenario) {
  if (scenario.result.status === Status.FAILED && browser["world"].config && !browser["world"].config.constants.skipManualScreenshots) {
    try {
      const featureFilename = scenario.sourceLocation.uri
        .split("/")
        .pop()
        .split(".")
        .shift();

      this.attach(
        `Screenshot for failed test: Feature ${featureFilename}-${scenario.pickle.name} on browser ${browser.desiredCapabilities.browserName} ${
          browser.desiredCapabilities.version
        }`,
        "plain/text"
      );
      browser.saveDocumentScreenshot();
    } catch (error) {
      console.log(chalk.red(`${error}`));
    }
  }
});
