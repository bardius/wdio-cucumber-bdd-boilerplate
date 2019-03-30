import { Then } from "cucumber";
import { axeConfig, axeExcludes } from "../../config/axe.config";

const axeSource = require("axe-core").source;
const axeReports = require("axe-reports");

// Check for accessibility issues with Axe
// Gherkin - Then I check for accessibility violations with AxeCore
Then(/^I check for accessibility violations with AxeCore$/, function() {
  if (browser["world"].config.constants.skipAccessibility || browser.desiredCapabilities.browserName.toLowerCase() !== "chrome") {
    return assert.isTrue(true, "Accessibility is only tested against desktop Chrome.");
  }

  // Inject Axe Script to browser
  browser.execute(axeSource);

  // Get result upon process execution in browser
  const axeResults = browser.executeAsync(
    function(axeExcludes, axeConfig, callback) {
      axe.run(axeExcludes, axeConfig, function(error, results) {
        if (error) {
          callback(error);
        }
        callback(results);
      });
    },
    axeExcludes,
    axeConfig
  );

  // print results report in CLI
  const prettyAxeResults = axeReports.createBasicReport(axeResults.value);
  let axeViolations = {};

  if (!axeResults.value) {
    axeViolations = { results: axeResults };
  } else {
    axeViolations = axeResults.value.violations || {};
    axeViolations.forEach(violation => {
      this.attach(browser["world"].getViolationSummary(violation));
    });
  }

  // Assert no violations exist
  assert.isBelow(
    axeViolations.length,
    browser["world"].config.constants.aXeThreshold,
    `
    Expected no accessibility violations or less than allowed threshold.
    Found ${axeViolations.length} violations: ${axeViolations}
    `
  );
});
