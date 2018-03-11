import { defineSupportCode } from 'cucumber';

import openWebsite from '../support/action/openWebsite';
import waitForVisible from '../support/action/waitForVisible';

const chalk = require('chalk');

defineSupportCode(({ Given, When, Then }) => {

    // Navigate to a Url
    // Gherkin - Given I launch the website "url_key"
    Given(/^I navigate to the Url "([^"]*)"$/, function(url_key){
        const targetUrl = this.config.serverUrls[url_key];
        console.log(chalk.cyan(`Launching Url: ${targetUrl}`));

        expect(targetUrl, 'Target URL not defined').to.not.be.undefined;
        openWebsite('url', targetUrl);
    });

    // Click on browser back button
    // Gherkin - When I click on browser back button
    When(/^I click on browser back button$/, function(){
        browser.back();
    });

    // Open the browser
    // Gherkin - When I open the browser
    When(/^I open the browser$/, function(){
        browser.newWindow();
    });

    // Close the browser
    // Gherkin - Then I close the browser
    When(/^I close the browser$/, function(){
        browser.close();
    });

    // Verify current page by Url
    // Gherkin - Then I am redirected to "url_part" page
    Then(/^I am redirected to "([^"]*)" page$/, function(url_key){
        const targetUrl = this.config.serverUrls[url_key];
        console.log(chalk.cyan(`Navigated to Url: ${targetUrl}`));

        expect(targetUrl, 'Target Url not defined').to.not.be.undefined;

        // Checks that the current URL contains the expected text
        browser.waitUntil(function() {
            return browser.getUrl().indexOf(targetUrl) > -1;
        }, this.config.constants.TIMEOUT, `expected Url change to happen within ${this.config.constants.TIMEOUT}ms`);
    });
});
