const gulp = require('gulp');
const selenium = require('selenium-standalone');
const gulpSequence = require('gulp-sequence');
const argv = require('yargs').argv;
const webdriver = require('gulp-webdriver');
const mkdirp = require('mkdirp');
const del = require('del');
const cucumberReporter = require('cucumber-html-reporter');
const os = require('os');
// const sitespeedio = require('gulp-sitespeedio');

const pa11y = require('pa11y');
const pa11yHTMLReporter = require('./node_modules/pa11y/reporter/html.js');
const pallyConfig = require('./config/pally.config').pallyConfig;
const pallyUrls = require('./config/pally.config').pallyUrls;
const pallyTest = pa11y(pallyConfig());

const selectedSuite = argv.suite || null;
const selectedTags = argv.tags || null;
const selectedGrade = argv.grade || 'grade1';
const selectedBrowser = argv.browser || 'chrome';
const selectedEnv = argv.env || 'prod';
const selectedProject = argv.project || '';
const selectedFeatureFile = argv.feature || '';
const isDebugMode = argv.debug || false;
const isMobileMode = argv.mobile || false;
const isPhantomJsMode = selectedBrowser === 'phantomjs';
const osPlatform = `${os.type()} - ${os.release()} - ${os.platform()}`;

let wdioConfigObject = {};

if (selectedSuite) {
    wdioConfigObject.suite = selectedSuite;
}

if (selectedProject || selectedFeatureFile) {
    const featureFileProjectPath = selectedProject || '**';
    const featureFilePath = selectedFeatureFile || '*';
    wdioConfigObject.specs = [`./src/features/${featureFileProjectPath}/${featureFilePath}.feature`];
}

if (selectedTags) {
    wdioConfigObject.cucumberOpts = {
        tagExpression: selectedTags
    };
}

let seleniumJavaArgs = [];

isDebugMode ? seleniumJavaArgs.push(
    '-Dwebdriver.chrome.logfile=./output/browser_logs_chrome.log',
    '-Dwebdriver.firefox.logfile=./output/browser_logs_firefox.log',
    '-Dwebdriver.ie.driver.logfile=./output/browser_logs_ie.log',
    '-Dwebdriver.edge.logfile=./output/browser_logs_edge.log',
    '-DlogLevel=DEBUG'
) : false;

let seleniumArgs = [
    '-log',
    'output/selenium-server.log'
];

if(isDebugMode) {
    seleniumArgs.push('-debug');
}

const cucumberReportOptions = {
    theme: 'bootstrap',
    jsonDir: './output/cucumber',
    output: './reports/cucumber/report.html',
    brandTitle: 'Acceptance Tests Results Report',
    reportSuiteAsScenarios: true,
    launchReport: false,
    storeScreenShots: true,
    ignoreBadJsonFile: true,
    metadata: {
        'App Version': 'v0.0.1',
        'Test Environment': selectedEnv,
        'Browser': selectedBrowser,
        'Platform': osPlatform,
        'Parallel': 'Scenarios',
        'Executed': 'Remote'
    }
};

gulp.task('cucumber-report', (done) => {
    new Promise (function(resolve, reject) {
        try {
            cucumberReporter.generate(cucumberReportOptions);
            resolve();
        }
        catch (error){
            console.log(error);
            done();
        }
    }).then(function(){
        done();
    });
});

gulp.task('clean', (done) => {
    return del([
        'reports/**/*',
        'output/**/*',
    ], done);
});

gulp.task('create-folders', (done) => {
    new Promise (function(resolve, reject) {
        try {
            mkdirp('./reports');
            mkdirp('./reports/allure-report');
            mkdirp('./reports/pa11y');
            mkdirp('./reports/pa11y-report');
            mkdirp('./reports/cucumber');
            mkdirp('./reports/sitespeed');
            mkdirp('./output');
            mkdirp('./output/cucumber');
            mkdirp('./output/screenshots');
            mkdirp('./output/allure-results');
            resolve();
        }
        catch (error){
            console.log(error);
            done();
        }
    }).then(function(){
        done();
    });
});

// https://github.com/vvo/selenium-standalone
// https://wiki.saucelabs.com/display/DOCS/Test+Configuration+Options
gulp.task('selenium:install', (done) => {
    selenium.install({
        baseURL: 'https://selenium-release.storage.googleapis.com',
        version: '3.9.1',
        drivers: {
            edge: {
                version: '16299'
            },
            ie: {
                version: '3.7.0',
                arch: process.arch,
                baseURL: 'https://selenium-release.storage.googleapis.com'
            },
            firefox: {
                version: '0.19.1',
                arch: process.arch,
                baseURL: 'https://github.com/mozilla/geckodriver/releases/download'
            },
            chrome: {
                version: '2.35',
                arch: process.arch,
                baseURL: 'https://chromedriver.storage.googleapis.com'
            }
        },
        logger: (message) => {
            process.stdout.write(`${message} \n`);
        },
        processCb: (totalLength, processLength) => {
            process.stdout.write(`Downloading drivers ${Math.round(processLength / totalLength * 100)}% \r`);
        }
    }, error => {
        if (error) {
            console.log('\x1b[31m%s\x1b[1m', error);
            return done(error);
        }
    });
});

gulp.task('selenium:start', (done) => {
    if(isPhantomJsMode){
        console.log('\x1b[33m%s\x1b[0m', 'Starting PhantomJS');
        done();
    }
    else {
        console.log('\x1b[33m%s\x1b[0m', 'Starting Selenium');
        selenium.start({
            version: '3.9.1',
            drivers: {
                edge: {
                    version: '16299'
                },
                ie: {
                    version: '3.7.0'
                },
                firefox: {
                    version: '0.19.1'
                },
                chrome: {
                    version: '2.35'
                }
            },
            spawnOptions: {
                stdio: isDebugMode ? 'inherit' : 'ignore'
            },
            seleniumArgs: seleniumArgs,
            javaArgs: seleniumJavaArgs
        }, (error, child) => {
            selenium.child = child;
            console.log('\x1b[33m%s\x1b[0m', 'Selenium server is running and listening');
            if (error) {
                console.log('\x1b[31m%s\x1b[1m', error);
            }
            done();
        });
    }
});

gulp.task('pa11y-test', ['clean', 'create-folders'], (done) => {
    const testUrl = pallyUrls()[0];

    pallyTest.run(testUrl, function (error, results) {
        if (error) {
            console.error(error.message);
            done();
        }

        pa11yHTMLReporter.results(results, testUrl);
        done();
    });
});

gulp.task('sitespeed-test', ['clean', 'create-folders'], (done) => {
    sitespeedio({
        config: './config/sitespeed.config.json',
        browsertime: {
            browser: selectedBrowser
        },
        debug: isDebugMode,
        mobile: isMobileMode
    })(done)
});

// Usage: gulp wdio --env=local --project=sample --feature=sampleFeature --suite=sample --tags="@tag1 and @tag2" --debug=true --browser=chrome --headless=false --hub=false
gulp.task('wdio', (done) => {
    return gulp.src('config/wdio.config.js')
        .pipe(webdriver(wdioConfigObject))
        .once('end', () => {
            selenium.child ? selenium.child.kill() : console.log('No Selenium process running');
        }).on('error', () => {
            done();
        });
});

// Usage: gulp saucelabs --env=local --conf=grade1 --project=sample --feature=sampleFeature --suite=sample --tags="@tag1 and @tag2" --debug=true --browser=chrome --headless=false
gulp.task('saucelabs', ['create-folders'], (done) => {
    const wdioConfSrc = `config/wdio.saucelabs.${selectedGrade}.config.js`;
    console.log(`Configuration from ${wdioConfSrc}`);

    return gulp.src(wdioConfSrc.toLowerCase())
        .pipe(webdriver(wdioConfigObject))
        .once('end', () => {
            selenium.child ? selenium.child.kill() : console.log('No Selenium process running');
        }).on('error', () => {
            done();
        });
});

// Usage: gulp execute --env=local --project=sample --feature=sampleFeature --suite=sample --tags="@tag1 and @tag2" --debug=true --browser=chrome --headless=false --hub=false
gulp.task('execute', gulpSequence('clean', 'create-folders', 'selenium:start', 'wdio', ['cucumber-report']));
gulp.task('execute-hub', gulpSequence('clean', 'create-folders', 'wdio', ['cucumber-report']));
