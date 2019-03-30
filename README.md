# Boilerplate for WebdriverIO & CucumberJS (sync mode) for BDD testing

## Table of contents

1.  [Overview](#overview)
2.  [Installation](#installation)
    1.  [Prerequisites](#prerequisites)
3.  [Proxy](#proxy)
4.  [Usage and Context](#usageandcontext)
    1.  [Execute tests on local browser](#executetestsonlocalbrowser)
    2.  [Execute tests on Browserstack](#executetestsonbrowserstack)
    3.  [Linting](#linting)
    4.  [Configuration](#configuration)
    5.  [Environments](#environments)
    6.  [Reports](#reports)
    7.  [Visual Regression](#visualregression)
5.  [URLs](#urls)
6.  [Features and Scenarios](#featuresandscenarios)
7.  [Locators](#locators)
    1.  [Data Selectors](#dataselectors)
8.  [Step Definitions](#stepdefinitions)
    1.  [Cucumber Boilerplate](#cucumberboilerplate)
    2.  [ApiCkli](#apickli)
    3.  [Custom](#custom)
        1.  [Given Steps](#givensteps)
        2.  [When Steps](#whensteps)
        3.  [Then Steps](#thensteps)
9.  [Tags](#tags)
10. [Tools](#tools)
    1.  [aXe Accessibility](#axeaccessibility)
    2.  [Selenium](#selenium)
    3.  [Lighthouse](#lighthouse)
11. [References](#references)

## Overview

A Boilerplate project to run WebdriverIO tests with CucumberJs and enable the use of BDD and E2E testing with
JavaScript,generating reports and screenshots of the results and allow connectivity with third part services like
BrowserStack and SauceLabs.

Instead of writing complicated test code that only developers can understand, Cucumber maps an ordinary
language(Gherkin) to code and allows to start with the test process in the early stages of product development.Tests
are written in Gherkin syntax, that means that you write down what's supposed to happen in a real language.

The step definitions for these tests are written in Javascript, using CucumberJS v5 for synchronous test execution.

With over 70 predefined steps that cover almost all browser actions and checks you need, you can start writing tests
right away. Selenium standalone is used in conjunction with WebdriverIO in order to execute the tests locally, on a
chosen browser,or remotely to BrowserStack.

Ability to execute tests for API endpoint responses and accessibility based on predefined standards is in place too ,via
the use of aXe Core and ApiCkli.

The aim of these tests, is not to replace the unit tests but to complement them adding extra confidence on deliverable.

- https://martinfowler.com/bliki/TestPyramid.html
- https://automationpanda.com/2017/10/14/bdd-101-unit-integration-and-end-to-end-tests/

## Installation

One step installation is required after you checkout the project, assuming that your system fulfills the prerequisites.
Open a bash (git bash should do in windows) and execute in the folder you want to project to be cloned in:

    npm run setup

### Prerequisites

**NodeJs** and npm have to be installed, any NodeJs version above & including 8.x is required. NodeJs can be downloaded
at https://nodejs.org/dist/latest-v8.x/ (for windows download the file with extension .msi). Make sure that node is
available in you PATH by executing in your CLI

    node --version

If you have issues with node-gyp, in case a newer version of node has been used instead, make sure that you can use it
by following the installation guide https://github.com/nodejs/node-gyp

**Java 8** is required for Selenium executable, you can download the JDK 1.8x from
http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html
(for windows downloadjdk-8u171-windows-x64.exe).

Make sure that java is available in you PATH by executing in your CLI

    java -version

## Usage and Context

In brief the context is,

- you have Test Suites
- that are created by one or multiple feature files
- and each file has scenarios (with or without data examples)
- broken down by steps written in Gherkin language
- that correspond to step definitions written in CucumberJs (boilerplate or custom JavaScript methods)
- to perform actions or check conditions based on provided data values and locators (key value pairs pointing to a DOM xpath)
- against sets of URLs specified for an environment
- loaded in targeted browser that is defined as capability
- with the help of WebDriverIO & selenium or WebDriverIO & Browserstack

Useful guides in order to grasp the concept can be found at

- https://docs.cucumber.io/guides
- https://en.wikipedia.org/wiki/Cucumber_(software)

Npm scrips have been prepared in order to execute required tasks (directly from node modules or gulp). You can see the
full list of available commands in the bottom of the package.json file (found in the root folder of the project).

Reports will be generated under the reports folder and logs under the output folder.

### Execute tests on local browser

You can run all or specific tests again a local browser in normal or headless mode against any environment. By default,
if no arguments are provided all tests will be executed on chrome against local environment.

    npm run execute -- [optional arguments]
    (e.g.) npm run execute -- --suite=sample --browser=chrome --headless --env=local --site=website --debugMode

Available arguments:

- **--browser**=chrome|firefox|safari|edge|"internet explorer" to select a local browser
- **--headless** to run selected browser on headless mode
- **--env**=local|dev|qa|prod to execute tests against a specific environment
- **--site**=cmsAdmin|website to execute tests against a specific site
- **--suite**=suiteName to execute only tests of a specific test suite
- **--tags**="@tag1 and @tag2" a regular expression for combination of scenario tags that are to be executed
- **--feature**="featureFileName" the name of the feature file to execute
- **--debugMode** to enable verbose output of Selenium
- **--viewportSize**="1440x1024" to set the viewport size (default: 1280x1024)
- **--hub** to run tests against a remote Selenium Hub instead (not used at the moment as no Hub is available)
- **--proxy** to provide a value for the webDriverProxy used by selenium if needed
- **--maxInstances** to provide a number of concurrent executions. Default is 1
- **--cmsAdminUser** to provide an CMS admin user
- **--cmsAdminPass** to provide an CMS admin password
- **--visualRegressionTag=tagname** to provide a new visual regression reference tag and capture screenshots
- **--visualRegressionCompare=tagname** to execute a new visual regression comparison against a reference tag and capture diffs
- **--localHost** to provide an local AEM Author host (localhost by default)
- **--localPort** to provide an local AEM Author port (18000 by default)

To use CMS Admin credentials you can either pass them as arguments or export them as variables in your environment

      export cmsAdminUser=<username>
      export cmsAdminPass=<password>

      --cmsAdminUser=<username> --cmsAdminPass=<password>

### Execute tests on Browserstack

WebDriverIO provides integration with BrowserStack and BrowserStack Local that is used to access URLs behind a corporate
firewall. Due to BrowserStack not being compliant with latest WebDriverIO the version of the later is locked to 4.8.

Configuration is provided to allow direct or through proxy connection to BrowserStack and execute automated tests
against targeted capabilities. The BrowserStack credentials (user and access key) will have to be provided either as
environment variables or as arguments while calling the task.

    export BROWSERSTACK_USERNAME=<username>
    export BROWSERSTACK_ACCESS_KEY=<access_key>

    --bsUser=<username> --bsKey=<access_key>

Sets of capabilities exist, and can be selected using the grade argument (--grade) in CLI.

- grade1
- grade2
- mobile
- tablet
- chrome (default)

The browserstack usage is pretty similar to the local browser test execution. To run behind proxy:

    npm run browserstack -- [optional arguments]
    (e.g.) npm run browserstack -- --suite=sample --env=local --site=website --debugMode

Available arguments:

- **--env**=local|dev|qa|prod to execute tests against a specific environment
- **--site**=cmsAdmin|website to execute tests against a specific site
- **--suite**=suiteName to execute only tests of a specific test suite
- **--tags**="@tag1 and @tag2" a regular expression for combination of scenario tags that are to be executed
- **--grade**=grade2 the capabilities grade that are to be executed. By default is grade1
- **--debug** to enable verbose output of Selenium
- **--bsLocal** to run tests behind proxy via authenticated use of the browserstack-local binary
- **--bsUser** to BrowserStack user to login run tests behind proxy
- **--bsKey** to BrowserStack user key to login run tests behind proxy
- **--tunnel** to run concurrent tests behind proxy through via authenticated use of the browserstack-local  
  binary. If empty, unique value is auto generated.
- **--proxyHost** the proxy host. Default is localhost
- **--proxyPort** the proxy port. Default is 8080
- **--proxy** to provide a value for the webDriverProxy used by selenium if needed
- **--maxInstances** to provide a number of concurrent executions. Default is 1
- **--cmsAdminUser** to provide a CMS admin user
- **--cmsAdminPass** to provide a CMS admin password

To avoid network connectivity issues through proxy long timeouts have been set to Browserstack maximum of 2 minutes
and retries have been allowed to steps that navigate to new pages/urls.

### Linting

Javascript and Gherkin Feature files can be checked for code formatting consistency against their respective rules.
Tools that execute the linting checks on these can be run as:

    npm run lint (will run both js and gherkin lint checks)
    npm run lint:js
    npm run lint:gherkin

Each tool has configuration for the rules that should apply. Eslint in the .eslintrc file and GherkinLint in the
.gherkin-lintrc

Documentation can be found at

- https://www.npmjs.com/package/gherkin-lint
- https://www.npmjs.com/package/eslint

### Configuration

All configuration can be found under the configs folder.

- axe.config - configuration for the aXe tool
- capability.config - setting up local browser capability for all browsers
- cucumber.globals.config - globally available constants that can be used within step definitions (defined in enhancedWorld)
- domains.config - lookups for domain ulrs per environment/site combination
- lighthouse.config - custom performance audit configuration for Lighthouse
- pally.config -
- report.config -
- requires.config - the list of the step definition & utility methods files that will be loaded during test run time
- selenium.config - define the selenium version and the versions of the browser specific drivers
- suites.config - listing of the available suites, any new ones will have to be manually added
- urls.config - the url lookups generation configuration
- visual.regression.config - required configuration for the visual regression test service like viewport sizes
- wdio.browserstack\* - configuration for BrowserStack execution and capabilities for the grade compatibility  
  that needs to be checked. Capabilities will have to be maintained manually when compatibility list gets updated.
- wdio.saucelabs\* -
- wdio.config - WebDriverIo and CucumberJs configuration that is used in local executions and gets inherited by  
  BrowserStack configs

Documentation over configuration for WebdriverIO can be found at the official website
http://webdriver.io/guide/getstarted/configuration.html

### Environments

The available environments and their URLs can be managed from the corresponding configuration file
config/urls.config.js.

Tests run for CMS admin should not be executed on prod as they will temper with live data.

Existing environments that can be passed as argument in CLI (via --env), are:

- local
- dev
- qa
- prod

Existing sites that can be passed as argument in CLI (via --site), are:

- cmsAdmin
- website

Full list of available environments and sites can be seen in the domains.config file.

### Reports

Test results are appearing in the CLI as they get executed with a summary upon completion. When all tests are completed
HTML reports (along with json reports) are generated with Multible HTML reports module under the folder reports/cucumber.

Any logs (like selenium logs) and test output can be found under output folder. All report and output folders are
cleaned before new test execution.

### Visual Regression

Ability to generate visual regression reference screenshot sets exist via the use of the custom
"I take screenshot of" step definition within the feature files while the visualRegressionTag argument is passed.

The generated reference set can be found under visual_regression/screenshots/<provided_reference_tag>.

When a reference set exists and the visualRegressionCompare argument is provided, a visual regression check will run
against the screenshot reference set and the screen and diff folders will be created under reports/visual_regression
with the outcome.

## URLs

Under **src/urls** you can find the lookup lists for the urls that wil be available in your test scenarios. These lists
will generate key value pairs for the urls in the format of site_keyName_page for each environment/site combination
found in the domains.config.

If more sites are required both domains.config and url lookups files will need to be amended.

- cms.admin.pages file contains the AEM author edit mode page lookups and will generate keys like author_pageKey_page
  (e.g. admin_login_page)
- journey.pages file contains the live journey page lookups and will generate keys like site_pageKey_journey_page
  (e.g. website_landing_journey_page)
- test.data.pages file contains the test data page lookups and will generate keys like site_component_page
  (e.g. website_component_page)

## Features and Scenarios

Under **src/features** you can find any existing feature files or create your own. A very useful source in order to
understand how to write a feature file and the scenarios for it in Gherkin language can be found at

- https://docs.cucumber.io/gherkin/reference/
- https://www.sitepoint.com/bdd-javascript-cucumber-gherkin/

## Locators

Locators are key values pairs used to define xPath or CSS selectors of elements in order to use them in test scenario
steps. They can be found under **src/locators** folder and any new files added there will be automatically picked up.

JavaScript file format is used and defining a new locator is as easy as adding a new pair like

search_button: '//a[@href="#search"]'

In case you need to find the xPath yo can do this via Chrome browser developer tools. Inspect the element you want and
right click on the html selection, copy -> copy Xpath. Alternatively, you can use CSS selector instead.

To understand the syntax of xPath and how it is being used to determine the targeted element/s, read more on:

- https://www.w3schools.com/xml/xpath_syntax.asp
- https://www.guru99.com/xpath-selenium.html

If you want to add a new file, make sure that the file is imported in the index.js like the rest, elsewise it will
not be exposed.

### Data Selectors

You could use the HTML5 data attribute instead of class or ids to easier locate elements by xpath using:

data-selector="selector_value"

Custom methods have been provided in order to transform the locator key to the targeted element.

## Step Definitions

Numerous step definitions are in place to allow rapid test creation and reduce the overhead to developers. These are a
combination of Cucumber Boilerplate, ApiCkli and custom step definitions created for custom specific projects.

The source code for these lives under **src/steps** and **src/support** and any new step definition can be placed in
the same folders. Before creating new step definitions ensure that non of the existing, or a combination of existing,
fulfills your requirements.

WebDriverIO API holds the underlying methods that get invoked on the browser object. Full list of all these methods can
be found at http://webdriver.io/api.html

You can see more information on creating CucumberJS step definitions at its
[official documentation](https://docs.cucumber.io/guides/10-minute-tutorial/)

### Boilerplate

Documentation and a full list of available step definitions can be found at
https://github.com/webdriverio/cucumber-boilerplate#list-of-predefined-steps

### ApiCkli

This set of step definitions allows to test API endpoint against valid responses, status or even schemas. Even swagger
schemas. The definitions have been upgraded to support CucumberJS v5.

Documentation and a full list of available step definitions can be found at
https://github.com/apickli/apickli#user-content-gherkin-expressions

### Custom

Few custom step definition have been implemented to cover common actions missing from the boilerplate or specific
actions.

#### Given Steps

- `I launch the website "urlKey"`  
  <br>Navigate to a Url

#### Then Steps

- `I check for accessibility violations with AxeCore`  
  <br>Check for accessibility issues with Axe
- `I am redirected to "url_part" page as login step( with cookie notice)`  
  <br>Verify current page by Url (bypassed for non authenticated environments) and close cookie notice by default
- `I am redirected to "url_part" page"`  
  <br>Verify current page by Url
- `I mark this scenario as incomplete`  
  <br>Instantly fail a scenario and mark it as incomplete in the reports
- `I expect that location URL does|does not contain "url_part"`  
  <br>Check if window location URL contains or not a string

#### When Steps

- `I click on "selector" as authenticated step`  
  <br>Click on an element (bypassed for non authenticated environments)
- `I enter the "input" in "selector" as authenticated step`  
  <br>Input value in an element (bypassed for non authenticated environments)
- `I select option "input" in "selector" as authenticated step`  
  <br>Select option value in an element (bypassed for non authenticated environments)
- `I click on browser back button"`  
  <br>Click on browser back button
- `I click on browser reload button"`  
  <br>Click on browser reload button
- `I open the browser"`  
  <br>Open the browser
- `I close the browser"`  
  <br>Close the browser
- `I maximize the browser"`  
  <br>Set the browser as maximized window
- `I take screenshot of "evidence"`  
  <br>Take a screenshot
- `I resize to xsMobile|mobile|tablet|desktop|xldesktop|xxldesktop breakpoint`  
  <br>Change dimensions of browser window to set breakpoint
- `I expect that current srcset for image "selector"(not) contains "srcset_filename"`  
  <br>Check current image element srcset

## Tags

Tags naming convention can be defined as:

- @ui - UI - if scenarios impacts site ui
- @cmsAdmin - cmsAdmin - if scenarios impacts site content management
- @prio1 - Priority 1 - if scenarios fails would have a critical business impact
- @prio2 - Priority 2 - if scenarios fails would have a business impact
- @prio3 - Priority 3 - if scenarios fails would have minimal impact or are know "will not fix" issues
- @pending - Pending - if scenarios are still being worked on
- @manual - Manual - if scenarios are outlining manual testing steps script
- @mobile - Mobile - if scenarios are is specifically for mobile testing
- @tablet - Tablet - if scenarios are specifically for tablet testing
- @desktop - Desktop - if scenarios are specifically for desktop testing
- @xldesktop - XL Desktop - if scenarios are specifically for extra large desktop testing

## Tools

### aXe Accessibility

A custom step definition has been created to allow checks for accessibility issues based on preset standards and rule
sets. The source code for that step is found at src/steps/accessibility.js and can be used in the scenarios like

    Then I check for accessibility violations with AxeCore

The configuration for the standards and the excludes can be found under config/axe.config.js. The threshold for allowed
issues before the test fails can be found under config/cucumber.globals.config.js at aXeThreshold variable.
By default is 10.

### Selenium

Selenium standalone has been used in order to manage the Selenium processes and the versions that are installed and
used. From the selenium.config file you can upgrade or downgrade version of selenium and the webdrivers of browsers.

The WebDriverIO Selenium standalone service is used to install and start the process
https://github.com/webdriverio/wdio-selenium-standalone-service

The first time that you spin up selenium it may take a few moments to start. In case that selenium works but you get the
error message

    Error: Selenium exited before it could start.

    Another Selenium process may already be running or your java version may be out of date.You may have a stray process
    running. Check if you have a stray process and then kill it in CLI using

You can stop the stray Selenium process by:

    lsof -i -n -P | grep 4444
    kill -9 $(lsof -ti tcp:4444)

### Lighthouse

Lighthouse executes performance audits using chrome and generates HTML reports that assist to identify any front end
performance bottlenecks or overheads added after a release. Configuration for the tool is found under
config/lighthouse.config file.

See documentation on how to configure & use at
https://github.com/GoogleChrome/lighthouse/tree/master/docs.

To execute against any url:

    npm run lighthouse -- https://www.github.com

Report of the audit outcome will be generated under reports/lighthouse folder.

## References

List of useful URLs or links to official documentation of the used tools follows.

- https://docs.cucumber.io/
- https://github.com/cucumber/cucumber-js#documentation
- http://webdriver.io/
- http://webdriver.io/api.html
- https://www.seleniumhq.org/
- https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities
- https://www.npmjs.com/package/selenium-standalone
- https://docs.cucumber.io/gherkin/reference/
- https://github.com/webdriverio/cucumber-boilerplate
- https://www.npmjs.com/package/axe-core
- https://github.com/apickli/apickli
- https://martinfowler.com/bliki/TestPyramid.html
- http://pa11y.org/
- https://github.com/pa11y/pa11y-ci
- https://www.sitespeed.io/
- https://www.browserstack.com/
- https://www.browserstack.com/automate/capabilities
- https://gulpjs.com/
- https://github.com/GoogleChrome/lighthouse
