/* global expect */
import { Given, When, Then } from "cucumber";

import openWebsite from "../support/action/openWebsite";
import pause from "../support/action/pause";
import clickElement from "../support/action/clickElement";

const chalk = require("chalk");

const flakyTestsRetry = { wrapperOptions: { retry: 5 } };

// Navigate to a Url
// Gherkin - Given I launch the website "urlKey"
Given(/^I navigate to the Url "([^"]*)"$/, flakyTestsRetry, function(urlKey) {
  const targetUrl = browser["world"].config.serverUrls[urlKey] || urlKey;
  console.log(chalk.cyan(`Launching Url: ${targetUrl}`));

  expect(targetUrl, "Target URL not defined").to.not.be.undefined;
  openWebsite("url", targetUrl);
});

// Click on browser back button
// Gherkin - When I click on browser back button
When(/^I click on browser back button$/, function() {
  browser.back();
});

// Click on browser reload button
// Gherkin - When I click on browser reload button
When(/^I click on browser reload button$/, function() {
  browser.refresh();
});

// Open the browser
// Gherkin - When I open the browser
When(/^I open the browser$/, function() {
  browser.newWindow();
});

// Close the browser
// Gherkin - When I close the browser
When(/^I close the browser$/, function() {
  browser.close();
});

// Change dimensions of browser window to defined breakpoint
// Gherkin - When I resize to xs|sm|md|lg|xl|xxl breakpoint
When(/^I resize to (xs|sm|md|lg|xl|xxl) breakpoint$/, function(breakpoint) {
  switch (breakpoint) {
    case "xs":
      browser.windowHandleSize({ width: 320, height: 480 });
      break;
    case "sm":
      browser.windowHandleSize({ width: 480, height: 600 });
      break;
    case "md":
      browser.windowHandleSize({ width: 768, height: 1024 });
      break;
    case "lg":
      browser.windowHandleSize({ width: 1280, height: 1080 });
      break;
    case "xl":
      browser.windowHandleSize({ width: 1440, height: 1080 });
      break;
    case "xxl":
      browser.windowHandleSize({ width: 1920, height: 1080 });
      break;
    default:
      browser.windowHandleSize({ width: 1280, height: 1080 });
  }
});

// Verify current page by Url
// Gherkin - Then I am redirected to "url_part" page
Then(/^I am redirected to "([^"]*)" page( with cookie notice)*$/, flakyTestsRetry, function(urlKey, keepCookieNotice) {
  const hideCookieNotice = typeof keepCookieNotice === "undefined";
  const targetUrl = browser["world"].config.serverUrls.hasOwnProperty(urlKey) ? browser["world"].config.serverUrls[urlKey] : urlKey;
  console.log(chalk.cyan(`Navigated to Url: ${targetUrl}`));

  expect(targetUrl, "Target Url not defined").to.not.be.undefined;

  // Checks that the current URL contains the expected text
  browser.waitUntil(
    () => browser.getUrl() && browser.getUrl().indexOf(targetUrl) > -1,
    browser["world"].config.constants.TIMEOUT,
    `expected Url change to happen within ${browser["world"].config.constants.TIMEOUT}ms`
  );

  // Close the cookie notice if it appears and we do not explicitly need it
  if (
    browser.isExisting(browser["world"].getSelector("cookie_acceptance_cta")) &&
    browser.isVisible(browser["world"].getSelector("cookie_acceptance_cta")) &&
    hideCookieNotice
  ) {
    clickElement("click", "selector", browser["world"].getSelector("cookie_acceptance_cta"));
    pause(1000);
  }
});

// Verify URL value
// Gherkin - Then I expect that URL does|does not contain "url_part"
Then(/^I expect that URL does( not)* contain "([^"]*)"$/, flakyTestsRetry, function(shouldNotContain, urlPart) {
  expect(urlPart, "URL part is not defined").to.not.be.undefined;
  pause(500);

  console.log(chalk.cyan(`Examined URL: ${browser.getUrl()}`));
  if (shouldNotContain) {
    expect(browser.getUrl() && browser.getUrl().indexOf(urlPart) < 0, `${urlPart} does not exist in URL`).to.be.true;
  } else {
    expect(browser.getUrl() && browser.getUrl().indexOf(urlPart) > -1, `${urlPart} does exists in URL`).to.be.true;
  }
});
