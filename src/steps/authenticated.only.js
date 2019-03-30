import { Given, When, Then } from "cucumber";

import clickElement from "../support/action/clickElement";
import selectOption from "../support/action/selectOption";
import setInputField from "../support/action/setInputField";
import waitForVisible from "../support/action/waitForVisible";

const chalk = require("chalk");

// Click on an element (bypassed for non authenticated environments)
// Gherkin - When I click on "selector" as authenticated step
When(/^I click on "([^"]*)" as authenticated step$/, function(dataSelector) {
  if (browser["world"].config.itShouldNotLogin) {
    return assert.isTrue(true, "No login step required in this environment. Test pass always.");
  }

  const selector = browser["world"].getSelector(dataSelector);
  waitForVisible(selector);
  clickElement("click", "selector", selector);
});

// Input value in an element (bypassed for non authenticated environments)
// Gherkin - When I enter the "input" in "selector" as authenticated step
When(/^I enter the (.*) in "([^"]*)" as authenticated step$/, function(inputValue, dataSelector) {
  if (browser["world"].config.itShouldNotLogin) {
    return assert.isTrue(true, "No login step required in this environment. Test pass always.");
  }

  const selector = browser["world"].getSelector(dataSelector);
  waitForVisible(selector);
  clickElement("click", "selector", selector);
  setInputField("set", inputValue.trim(), selector);
});

// Select option value in an element (bypassed for non authenticated environments)
// Gherkin - When I select option "input" in "selector" as authenticated step
When(/^I select option (.*) in "([^"]*)" as authenticated step$/, function(inputValue, dataSelector) {
  if (browser["world"].config.itShouldNotLogin) {
    return assert.isTrue(true, "No login step required in this environment. Test pass always.");
  }

  const selector = browser["world"].getSelector(dataSelector);
  waitForVisible(selector);
  clickElement("click", "selector", selector);
  selectOption("value", inputValue.trim(), selector);
});

// Verify current page by Url
// Gherkin - Then I am redirected to "url_part" page as authenticated step
Then(/^I am redirected to "([^"]*)" page as authenticated step$/, function(url_key) {
  if (browser["world"].config.itShouldNotLogin) {
    return assert.isTrue(true, "No login step required in this environment. Test pass always.");
  }

  const targetUrl = browser["world"].config.serverUrls[url_key];
  console.log(chalk.cyan(`Navigated to Url: ${targetUrl}`));

  expect(targetUrl, "Target Url not defined").to.not.be.undefined;

  // Checks that the current URL contains the expected text
  browser.waitUntil(
    function() {
      return browser.getUrl().indexOf(targetUrl) > -1;
    },
    browser["world"].config.constants.TIMEOUT,
    `expected Url change to happen within ${browser["world"].config.constants.TIMEOUT}ms`
  );
});
