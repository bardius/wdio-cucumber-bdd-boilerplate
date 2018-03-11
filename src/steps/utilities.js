import { defineSupportCode } from 'cucumber';

import pause from '../support/action/pause';

defineSupportCode(({ Given, When, Then }) => {

    // Set the browser as maximize window
    // Gherkin - When I maximize the browser
    When(/^I maximise the browser$/, function(){
        //if(browser.desiredCapabilities.browserName === 'phantomjs'){
        //    browser.windowHandleSize({width: 1280, height: 1024});
        //}
        //else {
            browser.windowHandleMaximize();
        //}
    });

    // Take a screen shot
    // Gherkin - When I take screenshot of "evidence"
    When(/^I take screenshot of "([^"]*)"$/, function(elementName){
        try {
            const currentTime = new Date().toJSON().replace(/:/g, '-');
            const screenShotFilename = (`./output/screenshots/${this.scenarioName}-I take screenshot of ${elementName}-${currentTime}.png`)
                .replace(/ /g, '-').replace(/"/g, '');

            pause(this.config.constants.MINI_PAUSE);
            browser.saveScreenshot(screenShotFilename);
            const screenShotStream = browser.saveScreenshot();
            this.attach('Screenshot taken');
            this.attach(screenShotStream, 'image/png');
        }
        catch (error) {
            console.log(chalk.red(`${error}`));
        }
    });
});
