import { When, Then } from "cucumber";
import path from "path";
import assert from "assert";
import pause from "../support/action/pause";

const chalk = require("chalk");

const assertDiff = function(results) {
  results.forEach(result => assert.ok(result.isExactSameImage));
};

const normaliseName = function(name) {
  return name
    .replace(/ - /g, "_")
    .replace(/ /g, "_")
    .replace(/:/g, "-")
    .replace(/"/g, "")
    .replace(/'/g, "")
    .replace(/`/g, "")
    .replace(/\//g, "")
    .replace(/\\/g, "");
};

// Take a screenshot
// Gherkin - When I take a screenshot of "evidence"
When(/^I take a screenshot of "([^"]*)?"$/, function(elementName) {
  // Skip screenshots for Browserstack/Saucelabs
  if (browser["world"].config.constants.skipManualScreenshots) {
    return assert.equal(true, true, "No manual screenshots are required in Browserstack/Saucelabs mode");
  }

  if (browser["world"].config.capabilities.browserName !== "internet explorer") {
    return assert.equal(true, true, "No manual screenshots are can be taken for IE");
  }

  try {
    const currentTime = normaliseName(new Date().toJSON());
    const normalisedScenarioName = normaliseName(this.currentScenario.pickle.name);
    const normalisedElementName = normaliseName(elementName);
    const normalisedStepName = normaliseName(`I take screenshot of`);
    const screenshotFilename = path.join(`./output/screenshots`, `${normalisedScenarioName}_${normalisedStepName}_${normalisedElementName}_${currentTime}.png`);
    pause(browser["world"].config.constants.MINI_PAUSE);

    // Cucumber reports screenshot attachment
    browser.saveDocumentScreenshot(screenshotFilename);
    this.attach("Screenshot taken");

    // Visual regression
    if (browser["world"].config.isVisualRegressionMode && browser["world"].config.capabilities.browserName !== "internet explorer") {
      const regressionSnapshots = browser.checkDocument();
      browser["world"].config.isVisualRegressionCompareMode ? assertDiff(regressionSnapshots) : true;
    }

    return assert.equal(true, true, "Screenshot was taken");
  } catch (error) {
    console.log(chalk.red(`${error}`));
    return assert.equal(false, true, `Screenshot was not taken: ${error}`);
  }
});

// Check current image element srcset
// Gherkin - Then I expect that the current srcset for image "selector" does (not) contain "lg.high"
Then(/^I expect that the current srcset for image "([^"]*)?" does( not)* contain "([^"]*)?"$/, function(elem, falseCase, expectedSize) {
  const currentSrcSet = browser.getAttribute(elem, "currentSrc");
  if (falseCase) {
    expect(currentSrcSet).to.not.contain(expectedSize, `Expected image source "currentSrcSet" to not contain "${expectedSize}"`);
  } else {
    expect(currentSrcSet).to.contain(expectedSize, `Expected image source "currentSrcSet" to contain "${expectedSize}"`);
  }
});
