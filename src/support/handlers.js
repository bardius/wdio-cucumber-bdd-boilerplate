import { defineSupportCode } from 'cucumber';

const chalk = require('chalk');

defineSupportCode(function({registerHandler}) {

    registerHandler('BeforeFeature', function (feature, callback) {
        console.log(chalk.green(`FEATURE EXECUTION START: ${feature.name}`));
        browser.newWindow();
        browser.windowHandleSize({width: 1024, height: 768});
        callback();
    });

    registerHandler('AfterFeature', function (feature, callback) {
        console.log(chalk.green(`FEATURE EXECUTION COMPLETED: ${feature.name}`));
        browser.close();
        callback();
    });
});
