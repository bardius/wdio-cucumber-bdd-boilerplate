import { defineSupportCode } from 'cucumber';

const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const jsonFormatter = require('cucumber').JsonFormatter;

const stripNonChars = (stringValue, replaceValue = ' ') => {
    if (!stringValue) {
        return ''
    }

    return stringValue.replace(/\W+/g, replaceValue);
};

defineSupportCode(function({After, registerListener}) {

    try {
        const jsonFileFormatter = new jsonFormatter;
        const capabilities = global.browser.desiredCapabilities;
        const deviceName = capabilities.deviceName || 'desktop';
        const browserName = capabilities.browserName || 'unknown';
        const browserVersion = capabilities.version || 'latest';
        const currentTime = new Date().toJSON().replace(/:/g, '-');
        const reportsFolderPath = path.join(__dirname, '../../output/cucumber');

        if(!fs.existsSync(reportsFolderPath)){
            fs.mkdirsSync(reportsFolderPath);
        }

        let platformName = capabilities.platform || 'current';

        if(browserName === 'iphone'){
            platformName = 'iOS';
        }
        else if(browserName === 'android'){
            platformName = 'Android';
        }

        const reportFilename = stripNonChars(
            `${deviceName}-${platformName}-${browserName}-${browserVersion}-cucumber-test-results-${currentTime}-${Math.random()}`,
            '-'
        );

        const reportFilePath = path.join(__dirname, `../../output/cucumber/${reportFilename}.json`);
        console.log(chalk.yellow(`Run tests and generate report`));
        console.log(chalk.yellow(`----------------------------------------------------------`));
        console.log(chalk.yellow(`Device: ${deviceName}`));
        console.log(chalk.yellow(`Platform: ${platformName}`));
        console.log(chalk.yellow(`Browser: ${browserName} - ${browserVersion}`));
        console.log(chalk.yellow(`Time: ${currentTime}`));
        console.log(chalk.yellow(`----------------------------------------------------------`));

        jsonFileFormatter.log = function(json) {
            fs.open(reportFilePath, 'w+', (error, destinationFile) => {
                try {
                    if (error) {
                        fs.mkdirsSync(reportsFolderPath);
                        destinationFile = fs.openSync(reportFilePath, 'w+');
                    }

                    fs.writeSync(destinationFile, json);
                    console.log(chalk.yellow(`----------------------------------------------------------`));
                    console.log(chalk.yellow(`Tests run completed and results report generated in location: ${reportFilePath}`));
                    console.log(chalk.yellow(`----------------------------------------------------------`));
                }
                catch (error){
                    console.log(chalk.red(`${error}`));
                }
            });
        };

        registerListener(jsonFileFormatter);
    }
    catch (error) {
        console.log(chalk.red(`${error}`));
    }
});
