import { defineSupportCode } from 'cucumber';
const axeSource = require('axe-core').source;
const axeReports = require('axe-reports');

// https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#api-name-axeconfigure
const axeConfig = {
    runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'section508'] // 'best-practice'
    },
    rules: {
        'color-contrast': { enabled: false },
        'definition-list': { enabled: true },
        'frame-title': { enabled: false }
    },
    reporter: 'v1',
    resultTypes: [
        'violations',
        'incomplete',
        'inapplicable'
    ]
};

const axeExcludes = {
    exclude: [
        ['#mock-element'],
        ['#mock-element2'],
        ['#hplogo > div']
    ]
};

defineSupportCode(({ Given, When, Then }) => {

    // Check for accessibility issues with Axe
    // Gherkin - Then I check for accessibility violations with AxeCore
    Then(/^I check for accessibility violations with AxeCore$/, function(){
        // Inject Axe Script to browser
        browser.execute(axeSource);

        // Get result upon process execution in browser
        const axeResults = browser.executeAsync(function(axeExcludes, axeConfig, callback){
            axe.run(axeExcludes, axeConfig, function(error, results){
                if(error){
                    callback(error);
                }
                callback(results);
            });
        }, axeExcludes, axeConfig);

        const prettyAxeResults = axeReports.createBasicReport(axeResults.value);
        let axeViolations = {};

        if(!axeResults.value){
            axeViolations = { 'results': axeResults };
        }
        else {
            axeViolations = axeResults.value.violations || {};
        }

        // Assert no violations exist
        assert.equal(
            axeViolations.length,
            0,
            `Expected no accessibility violations.Found ${axeViolations.length} violations: ${axeViolations}`
        );
    });
});
