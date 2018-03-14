import { defineSupportCode, Status } from 'cucumber';

const apickli = require('apickli');
const chalk = require('chalk');

defineSupportCode(function({After, Before}) {

    Before(function (scenarioResult) {
        const scenario = scenarioResult.scenario;
        this.scenarioName = scenario.name;

        this.apickli = new apickli.Apickli('http', 'httpbin.org', 'src/files/');
        this.apickli.addRequestHeader('Cache-Control', 'no-cache');

        console.log(chalk.green(`SCENARIO EXECUTION START: ${scenario.name}`));
    });

    After(function (scenarioResult) {
        const scenario = scenarioResult.scenario;
        console.log(chalk.green(`SCENARIO EXECUTION COMPLETED: ${scenario.name}`));
    });

    After(function (scenarioResult) {
        if(scenarioResult.isFailed()){
            try {
                let failedStep = '';
                scenarioResult.stepResults.map((stepResult) => {
                    if(stepResult.status === Status.FAILED){
                        failedStep = stepResult.step.name;
                    }
                });
                const screenShotStream = browser.saveScreenshot();
                this.attach('Screenshot for failed test: ' + scenarioResult.scenario.name + ' - ' + failedStep);
                return this.attach(screenShotStream, 'image/png');
            }
            catch (error) {
                console.log(chalk.red(`${error}`));
            }
        }
    });
});
