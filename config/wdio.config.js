const argv = require("yargs").argv;
const chalk = require("chalk");
const urls = require("./urls.config");
const requires = require("./requires.config");
const suites = require("./suites.config");
const capabilityProvider = require("./capability.config");
const seleniumConfig = require("./selenium.config");
const visualRegressionConfig = require("./visual.regression.config");
const reportConfig = require("./report.config");

// Specify the URL set that the tests will run against
// and the argument values passed for the tests
const env = argv.env || "local";
const site = argv.site || "website";
const selectedTags = argv.tags || null;
const viewportSize = argv.viewportSize || "1280x1024";
const selectedProject = argv.project || "";
const selectedSuite = argv.suite || null;
const selectedFeatureFile = selectedSuite ? "" : argv.feature || "";
const isDebugMode = argv.debugMode || false;
const isHeadlessBrowser = argv.headless || false;
const isHubMode = argv.hub || false;
const webDriverProxy = argv.proxy || null;

// Specify the max of concurrent browser instances
const maxInstances = argv.maxInstances || 1;

// Specify the timeout and retries for wdio, cucumber & selenium
const timeout = argv.timeout || 115 * 1000;
const retryCount = argv.retryCount || 5;

// Specify the port for the Selenium
// 4444 for local run and Browserstack, 4445 for Saucelabs and  4723 for Appium
const port = argv.port || (isHubMode ? 5555 : 4444);
const host = argv.host || (isHubMode ? "128.0.0.1" : "localhost");
const hubPath = isHubMode ? "/wd/hub" : "";

// Specify the browser that the tests will run against
const browser = argv.browser || "chrome";

// Determine if it should not load Firefox Profile service
const shouldNotLoadFirefoxProfile = browser !== "firefox" || argv.headless;

// Generate the capability object based on the provided arguments
const capability = capabilityProvider.getCapability(browser, isHeadlessBrowser, maxInstances);

// Generate the webdriverIO services array based on the provided arguments
let wdioServices = ["selenium-standalone"];

// Set visual regression service config
const isVisualRegressionCompareOn = !!argv.visualRegressionCompare || false;
const isVisualRegressionOn = !!argv.visualRegressionTag || isVisualRegressionCompareOn;
if (isVisualRegressionOn && browser !== "ie") {
  wdioServices.push("visual-regression");
}

if (!shouldNotLoadFirefoxProfile) {
  wdioServices.push("firefox-profile");
}

// Ignored scenario tags
const ignoredTestsTags = ["not @descoped", "not @wip", "not @mocks", "not @pending"];
const selectedTagExpression = selectedTags ? `(${ignoredTestsTags.join(" and ")}) and (${selectedTags})` : ignoredTestsTags.join(" and ");

// Included feature files
const selectedSpecs = [];
const featureFileProjectPath = selectedProject || "**";
const featureFilePath = selectedFeatureFile || "*";
selectedSpecs.push(`./src/features/${featureFileProjectPath}/${featureFilePath}.feature`);

exports.config = {
  host: host,
  port: port,
  path: hubPath,
  proxy: webDriverProxy,

  env: env,
  site: site,
  serverUrls: urls.getURLs(env, site),
  viewportSize: viewportSize,
  expectedResponseFolderPath: "src/files/responseFiles",
  jsonRequestFolderPath: "src/files/requestJsonFiles",
  xmlFolderPath: "src/files/requestXmlFiles",
  swaggerFilePath: "src/files/swaggerFiles",

  //
  // ==================
  // Specify Test Files
  // ==================
  // Define which test specs should run. The pattern is relative to the
  // directory from which `wdio` was called. Notice that, if you are calling
  // `wdio` from an NPM script (see https://docs.npmjs.com/cli/run-script)
  // then the current working directory is where your package.json resides, so
  // `wdio` will be called from there.
  //
  specs: selectedSpecs,
  suites: suites.getSuites(),
  suite: selectedSuite,

  // Patterns to exclude.
  exclude: [
    // "path/to/excluded/files"
  ],

  defaultTags: ignoredTestsTags,
  tags: selectedTagExpression,

  //
  // ============
  // Capabilities
  // ============
  // Define your capabilities here. WebdriverIO can run multiple capabilities
  // at the same time. Depending on the number of capabilities, WebdriverIO
  // launches several test sessions. Within your capabilities you can
  // overwrite the spec and exclude options in order to group specific specs
  // to a specific capability.
  //
  // First, you can define how many instances should be started at the same
  // time. Let"s say you have 3 different capabilities (Chrome, Firefox, and
  // Safari) and you have set maxInstances to 1; wdio will spawn 3 processes.
  // Therefore, if you have 10 spec files and you set maxInstances to 10, all
  // spec files will get tested at the same time and 30 processes will get
  // spawned. The property handles how many capabilities from the same test
  // should run tests.
  //
  maxInstances: maxInstances,
  //
  // If you have trouble getting all important capabilities together, check
  // out the Sauce Labs platform configurator - a great tool to configure your
  // capabilities: https://docs.saucelabs.com/reference/platforms-configurator
  //
  capabilities: [capability],

  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //
  // By default WebdriverIO commands are executed in a synchronous way using
  // the wdio-sync package. If you still want to run your tests in an async
  // way e.g. using promises you can set the sync option to false.
  sync: true,
  //
  // Level of logging verbosity: silent | verbose | command | data | result |
  // error
  logLevel: isDebugMode ? "verbose" : "error",
  //
  // Enables colors for log output.
  coloredLogs: true,
  //
  // Saves a screenshot to a given path if a command fails.
  //screenshotPath: "./output/screenshots/",
  //
  // Set a base URL in order to shorten url command calls. If your url
  // parameter starts with "/", then the base url gets prepended.
  baseUrl: "http://localhost:8080",
  //
  // Default timeout for all waitFor* commands.
  waitforTimeout: timeout,
  waitforInterval: timeout,
  //
  // Default timeout in milliseconds for request
  // if Selenium Grid doesn"t send response
  connectionRetryTimeout: timeout,
  //
  // Default request retries count
  connectionRetryCount: retryCount,
  //
  // Initialize the browser instance with a WebdriverIO plugin. The object
  // should have the plugin name as key and the desired plugin options as
  // properties. Make sure you have the plugin installed before running any
  // tests. The following plugins are currently available:
  // WebdriverCSS: https://github.com/webdriverio/webdrivercss
  // WebdriverRTC: https://github.com/webdriverio/webdriverrtc
  // Browserevent: https://github.com/webdriverio/browserevent
  // plugins: {
  //     webdrivercss: {
  //         screenshotRoot: "my-shots",
  //         failedComparisonsRoot: "diffs",
  //         misMatchTolerance: 0.05,
  //         screenWidth: [320,480,640,1024]
  //     },
  //     webdriverrtc: {},
  //     browserevent: {}
  // },
  //
  // Test runner services
  // Services take over a specific job you don"t want to take care of. They
  // enhance your test setup with almost no effort. Unlike plugins, they don"t
  // add new commands. Instead, they hook themselves up into the test process.
  services: wdioServices,
  visualRegression: isVisualRegressionOn ? visualRegressionConfig.config : null,
  isVisualRegressionMode: isVisualRegressionOn,
  isVisualRegressionCompareMode: isVisualRegressionCompareOn,
  seleniumLogs: seleniumConfig.seleniumLogs,
  seleniumArgs: seleniumConfig.seleniumArgs,
  seleniumInstallArgs: seleniumConfig.seleniumInstallArgs,
  logToStdout: true,

  firefoxProfile: shouldNotLoadFirefoxProfile
    ? null
    : {
        accept_untrusted_certs: true,
        acceptInsecureCerts: true,
        assume_untrusted_certificate_issuer: false,
        "xpinstall.signatures.required": false
      },

  //
  // Framework you want to run your specs with.
  // The following are supported: Mocha, Jasmine, and Cucumber
  // see also: http://webdriver.io/guide/testrunner/frameworks.html
  //
  // Make sure you have the wdio adapter package for the specific framework
  // installed before running any tests.
  framework: "cucumber",
  //
  // Test reporter for stdout.
  // The only one supported by default is "dot"
  // see also: http://webdriver.io/guide/testrunner/reporters.html
  reporters: ["spec", "multiple-cucumber-html"],
  reporterOptions: {
    outputDir: "output/cucumber",
    htmlReporter: reportConfig
  },

  plugins: {
    "wdio-screenshot": {}
  },

  //
  // If you are using Cucumber you need to specify the location of your step
  // definitions.
  cucumberOpts: {
    // <boolean> show full backtrace for errors
    backtrace: false,
    // <string[]> filetype:compiler used for processing required features
    compiler: ["js:babel-register"],
    dryRun: false,
    format: "json", // ["pretty", "json"],
    colors: true,
    // <boolean< Treat ambiguous definitions as errors
    failAmbiguousDefinitions: true,
    // <boolean> invoke formatters without executing steps
    // dryRun: false,
    // <boolean> abort the run on first failure
    failFast: false,
    // <boolean> Enable this config to treat undefined definitions as
    // warnings
    ignoreUndefinedDefinitions: false,
    // <string[]> ("extension:module") require files with the given
    // EXTENSION after requiring MODULE (repeatable)
    name: [],
    // <boolean> hide step definition snippets for pending steps
    snippets: true,
    // <boolean> hide source uris
    source: true,
    // <string[]> (name) specify the profile to use
    profile: [],
    // <string[]> (file/dir) require files before executing features
    require: requires.getRequires(),
    // <string> specify a custom snippet syntax
    snippetSyntax: undefined,
    // <boolean> fail if there are any undefined or pending steps
    strict: true,
    // <string> (expression) only execute the features or scenarios with
    // tags matching the expression, see
    // https://docs.cucumber.io/tag-expressions/
    tagExpression: selectedTagExpression,
    // <boolean> add cucumber tags to feature or scenario name
    tagsInTitle: false,
    // <number> timeout for step definitions
    timeout: timeout,
    retry: retryCount
  },

  //
  // =====
  // Hooks
  // =====
  // WebdriverIO provides several hooks you can use to interfere with the test
  // process in order to enhance it and to build services around it. You can
  // either apply a single function or an array of methods to it. If one of
  // them returns with a promise, WebdriverIO will wait until that promise got
  // resolved to continue.
  //
  // Gets executed once before all workers get launched.
  // onPrepare: function onPrepare(config, capabilities) {
  // },
  //
  // Gets executed before test execution begins. At this point you can access
  // all global variables, such as `browser`. It is the perfect place to
  // define custom commands.
  before: function before() {
    /**
     * Setup the Chai assertion framework
     */
    const chai = require("chai");
    const chaiAsPromised = require("chai-as-promised");

    chai.should();
    chai.use(chaiAsPromised);

    global.expect = chai.expect;
    global.assert = chai.assert;
    global.should = chai.should();
  },
  //
  // Hook that gets executed before the suite starts
  // beforeSuite: function beforeSuite(suite) {
  // },
  //
  // Hook that gets executed _before_ a hook within the suite starts (e.g.
  // runs before calling beforeEach in Mocha)
  // beforeHook: function beforeHook() {
  // },
  //
  // Hook that gets executed _after_ a hook within the suite starts (e.g. runs
  // after calling afterEach in Mocha)
  // afterHook: function afterHook() {
  // },
  //
  // Function to be executed before a test (in Mocha/Jasmine) or a step (in
  // Cucumber) starts.
  // beforeTest: function beforeTest(test) {
  // },
  //
  // Runs before a WebdriverIO command gets executed.
  // beforeCommand: function beforeCommand(commandName, args) {
  // },
  //
  // Runs after a WebdriverIO command gets executed
  // afterCommand: function afterCommand(commandName, args, result, error) {
  // },
  //
  // Function to be executed after a test (in Mocha/Jasmine) or a step (in
  // Cucumber) starts.
  // afterTest: function afterTest(test) {
  // },
  //
  // Hook that gets executed after the suite has ended
  // afterSuite: function afterSuite(suite) {
  // },
  //
  // Gets executed after all tests are done. You still have access to all
  // global variables from the test.
  // after: function after(result, capabilities, specs) {
  // },
  //
  // Gets executed after all workers got shut down and the process is about to
  // exit. It is not possible to defer the end of the process using a promise.
  // onComplete: function onComplete(exitCode) {
  // },

  // Cucumber Specific Hooks
  beforeFeature: function(feature) {
    console.log(chalk.green(`FEATURE EXECUTION START: ${feature.name}`));
  },
  beforeScenario: function(scenario) {
    console.log(chalk.green(`SCENARIO EXECUTION START: ${scenario.name}`));
  },
  beforeStep: function(step) {},
  afterStep: function(stepResult) {},
  afterScenario: function(scenario) {
    console.log(chalk.green(`SCENARIO EXECUTION COMPLETED: ${scenario.name}`));
  },
  afterFeature: function(feature) {
    console.log(chalk.green(`FEATURE EXECUTION COMPLETED: ${feature.name}`));
  }
};
