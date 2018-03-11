import { defineSupportCode } from 'cucumber';

import clickElement from '../support/action/clickElement';
import selectOption from '../support/action/selectOption';
import setInputField from '../support/action/setInputField';
import waitForVisible from '../support/action/waitForVisible';

const chalk = require('chalk');

defineSupportCode(({ Given, When, Then }) => {

    // Click on an element (bypassed for dev)
    // Gherkin - When I click on "selector" as login step
    When(/^I click on "([^"]*)" as login step$/, function(dataSelector){
        if(this.config.itShouldNotLogin) {
            return assert.isTrue(true, 'No login step required in this environment. Test pass always.');
        }
        else {
            const selector = this.getSelector(dataSelector);
            waitForVisible(selector);
            clickElement('click', 'selector', selector);
        }
    });

    // Input value in an element (bypassed for dev)
    // Gherkin - When I enter the "input" in "selector" as login step
    When(/^I enter the (.*) in "([^"]*)" as login step$/, function(inputValue, dataSelector){
        if(this.config.itShouldNotLogin) {
            return assert.isTrue(true, 'No login step required in this environment. Test pass always.');
        }
        else {
            const selector = this.getSelector(dataSelector);
            waitForVisible(selector);
            clickElement('click', 'selector', selector);
            setInputField('set', inputValue.trim(), selector);
        }
    });

    // Select option value in an element (bypassed for dev)
    // Gherkin - When I select option "input" in "selector" as login step
    When(/^I select option (.*) in "([^"]*)" as login step$/, function(inputValue, dataSelector){
        if(this.config.itShouldNotLogin) {
            return assert.isTrue(true, 'No login step required in this environment. Test pass always.');
        }
        else {
            const selector = this.getSelector(dataSelector);
            waitForVisible(selector);
            clickElement('click', 'selector', selector);
            selectOption('value', inputValue.trim(), selector);
        }
    });

    // Verify current page by Url
    // Gherkin - Then I am redirected to "url_part" page as login step
    Then(/^I am redirected to "([^"]*)" page as login step$/, function(url_key){
        if(this.config.itShouldNotLogin) {
            return assert.isTrue(true, 'No login step required in this environment. Test pass always.');
        }
        else {
            const targetUrl = this.config.serverUrls[url_key];
            console.log(chalk.cyan(`Navigated to Url: ${targetUrl}`));

            expect(targetUrl, 'Target Url not defined').to.not.be.undefined;

            // Checks that the current URL contains the expected text
            browser.waitUntil(function() {
                return browser.getUrl().indexOf(targetUrl) > -1;
            }, this.config.constants.TIMEOUT, `expected Url change to happen within ${this.config.constants.TIMEOUT}ms`);
        }
    });
});
