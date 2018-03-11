const pa11yHTMLReporter = require('./../node_modules/pa11y/reporter/html.js');
const pa11yCliReporter = require('./../node_modules/pa11y/reporter/cli.js');

const pa11yUrlList = [
    'http://www.google.com'
];

const pa1lyOptions = {
    allowedStandards: ['Section508', 'WCAG2A', 'WCAG2AA', 'WCAG2AAA'],
    log: pa11yCliReporter,
    ignore: [
        'notice',
        'WCAG2AA.Principle3.Guideline3_1.3_1_1.H57.2'
    ],
    page: {
        viewport: {
            width: 1024,
            height: 768
        }
    },
    screenCapture: './output/screenshots/pa11y/capture.png',
    standard: 'WCAG2AA',
    timeout: 60000
};

module.exports = {
    pallyConfig: pallyConfig,
    pallyUrls: pallyUrls
};

function pallyConfig(){
    return pa1lyOptions;
}

function pallyUrls(){
    return pa11yUrlList;
}

