import { defineSupportCode } from 'cucumber';

const chalk = require('chalk');
const prettyJson = require('prettyjson');

// Converted the original apickli/apickli-gherkin Step definition to non callback
// instead of importing the from module.exports = require('apickli/apickli-gherkin');
defineSupportCode(function({Given, When, Then}) {
    Given(/^I set (.*) header to (.*)$/, function(headerName, headerValue) {
        this.apickli.addRequestHeader(headerName, headerValue);
    });

    Given(/^I set cookie to (.*)$/, function(cookie) {
        this.apickli.addCookie(cookie);
    });

    Given(/^I set headers to$/, function(headers) {
        this.apickli.setHeaders(headers.hashes());
    });

    Given(/^I set body to (.*)$/, function(bodyValue) {
        this.apickli.setRequestBody(bodyValue);
    });

    Given(/^I pipe contents of file (.*) to body$/, function(file) {
        this.apickli.pipeFileContentsToRequestBody(file, function(error) {
            if (error) {
                return (new Error(error));
            }
        });
    });

    Given(/^I set query parameters to$/, function(queryParameters) {
        this.apickli.setQueryParameters(queryParameters.hashes());
    });

    Given(/^I set form parameters to$/, function(formParameters) {
        this.apickli.setFormParameters(formParameters.hashes());
    });

    Given(/^I have basic authentication credentials (.*) and (.*)$/, function(username, password) {
        this.apickli.addHttpBasicAuthorizationHeader(username, password);
    });

    When(/^I GET (.*)$/, function(resource) {
        const stepAttach = this.attach;
        this.apickli.get(resource, function(error, response) {
            getResponseAssertion(error, response, stepAttach);
        });

        // Checks that the response was delivered in a timely manner
        browser.waitUntil(() => {
            return this.apickli.httpResponse.complete;
        }, this.config.constants.API_TIMEOUT, `expected API to return response within ${this.config.constants.API_TIMEOUT}ms`);
    });

    When(/^I POST to (.*)$/, function(resource) {
        const stepAttach = this.attach;
        this.apickli.post(resource, function(error, response) {
            getResponseAssertion(error, response, stepAttach);
        });

        // Checks that the response was delivered in a timely manner
        browser.waitUntil(() => {
            return this.apickli.httpResponse.complete;
        }, this.config.constants.API_TIMEOUT, `expected API to return response within ${this.config.constants.API_TIMEOUT}ms`);
    });

    When(/^I PUT (.*)$/, function(resource) {
        const stepAttach = this.attach;
        this.apickli.put(resource, function(error, response) {
            getResponseAssertion(error, response, stepAttach);
        });

        // Checks that the response was delivered in a timely manner
        browser.waitUntil(() => {
            return this.apickli.httpResponse.complete;
        }, this.config.constants.API_TIMEOUT, `expected API to return response within ${this.config.constants.API_TIMEOUT}ms`);
    });

    When(/^I DELETE (.*)$/, function(resource) {
        const stepAttach = this.attach;
        this.apickli.delete(resource, function(error, response) {
            getResponseAssertion(error, response, stepAttach);
        });

        // Checks that the response was delivered in a timely manner
        browser.waitUntil(() => {
            return this.apickli.httpResponse.complete;
        }, this.config.constants.API_TIMEOUT, `expected API to return response within ${this.config.constants.API_TIMEOUT}ms`);
    });

    When(/^I PATCH (.*)$/, function(resource) {
        const stepAttach = this.attach;
        this.apickli.patch(resource, function(error, response) {
            getResponseAssertion(error, response, stepAttach);
        });

        // Checks that the response was delivered in a timely manner
        browser.waitUntil(() => {
            return this.apickli.httpResponse.complete;
        }, this.config.constants.API_TIMEOUT, `expected API to return response within ${this.config.constants.API_TIMEOUT}ms`);
    });

    When(/^I request OPTIONS for (.*)$/, function(resource) {
        const stepAttach = this.attach;
        this.apickli.options(resource, function(error, response) {
            getResponseAssertion(error, response, stepAttach);
        });

        // Checks that the response was delivered in a timely manner
        browser.waitUntil(() => {
            return this.apickli.httpResponse.complete;
        }, this.config.constants.API_TIMEOUT, `expected API to return response within ${this.config.constants.API_TIMEOUT}ms`);
    });

    Then(/^response header (.*) should exist$/, function(header) {
        const assertion = this.apickli.assertResponseContainsHeader(header);
        getResultAssertion(assertion, this.attach);
    });

    Then(/^response header (.*) should not exist$/, function(header) {
        const assertion = this.apickli.assertResponseContainsHeader(header);
        assertion.success = !assertion.success;
        getResultAssertion(assertion, this.attach);
    });

    Then(/^response body should be valid (xml|json)$/, function(contentType) {
        const assertion = this.apickli.assertResponseBodyContentType(contentType);
        getResultAssertion(assertion, this.attach);
    });

    Then(/^response code should be (.*)$/, function(responseCode) {
        const assertion = this.apickli.assertResponseCode(responseCode);
        getResultAssertion(assertion, this.attach);
    });

    Then(/^response code should not be (.*)$/, function(responseCode) {
        const assertion = this.apickli.assertResponseCode(responseCode);
        assertion.success = !assertion.success;
        getResultAssertion(assertion, this.attach);
    });

    Then(/^response header (.*) should be (.*)$/, function(header, expression) {
        const assertion = this.apickli.assertHeaderValue(header, expression);
        getResultAssertion(assertion, this.attach);
    });

    Then(/^response header (.*) should not be (.*)$/, function(header, expression) {
        const assertion = this.apickli.assertHeaderValue(header, expression);
        assertion.success = !assertion.success;
        getResultAssertion(assertion, this.attach);
    });

    Then(/^response body should contain (.*)$/, function(expression) {
        const assertion = this.apickli.assertResponseBodyContainsExpression(expression);
        getResultAssertion(assertion, this.attach);
    });

    Then(/^response body should not contain (.*)$/, function(expression) {
        const assertion = this.apickli.assertResponseBodyContainsExpression(expression);
        assertion.success = !assertion.success;
        getResultAssertion(assertion, this.attach);
    });

    Then(/^response body path (.*) should be (.*)$/, function(path, value) {
        const assertion = this.apickli.assertPathInResponseBodyMatchesExpression(path, value);
        getResultAssertion(assertion, this.attach);
    });

    Then(/^response body path (.*) should not be (.*)$/, function(path, value) {
        const assertion = this.apickli.assertPathInResponseBodyMatchesExpression(path, value);
        assertion.success = !assertion.success;
        getResultAssertion(assertion, this.attach);
    });

    Then(/^response body path (.*) should be of type array$/, function(path) {
        const assertion = this.apickli.assertPathIsArray(path);
        getResultAssertion(assertion, this.attach);
    });

    Then(/^response body path (.*) should be of type array with length (.*)$/, function(path, length) {
        const assertion = this.apickli.assertPathIsArrayWithLength(path, length);
        getResultAssertion(assertion, this.attach);
    });

    Then(/^response body should be valid according to schema file (.*)$/, function(schemaFile) {
        let validationResult = null;

        this.apickli.validateResponseWithSchema(schemaFile, function(assertion) {
            validationResult = assertion;
        });

        // Checks that the response was delivered in a timely manner
        browser.waitUntil(() => {
            return validationResult.hasOwnProperty('success') ;
        }, this.config.constants.API_TIMEOUT, `expected API response to validate within ${this.config.constants.API_TIMEOUT}ms`);

        getResultAssertion(validationResult, this.attach, true);
    });

    Then(/^response body should be valid according to openapi description (.*) in file (.*)$/, function(definitionName, swaggerSpecFile) {
        let validationResult = null;

        this.apickli.validateResponseWithSwaggerSpecDefinition(definitionName, swaggerSpecFile, function(assertion) {
            validationResult = assertion;
        });

        // Checks that the response was delivered in a timely manner
        browser.waitUntil(() => {
            return validationResult.hasOwnProperty('success') ;
        }, this.config.constants.API_TIMEOUT, `expected API response to validate within ${this.config.constants.API_TIMEOUT}ms`);

        getResultAssertion(validationResult, this.attach);
    });

    Then(/^I store the value of body path (.*) as access token$/, function(path) {
        this.apickli.setAccessTokenFromResponseBodyPath(path);
    });

    When(/^I set bearer token$/, function() {
        this.apickli.setBearerToken();
    });

    Given(/^I store the raw value (.*) as (.*) in scenario scope$/, function(value, variable) {
        this.apickli.storeValueInScenarioScope(variable, value);
    });

    Then(/^I store the value of response header (.*) as (.*) in global scope$/, function(headerName, variableName) {
        this.apickli.storeValueOfHeaderInGlobalScope(headerName, variableName);
    });

    Then(/^I store the value of body path (.*) as (.*) in global scope$/, function(path, variableName) {
        this.apickli.storeValueOfResponseBodyPathInGlobalScope(path, variableName);
    });

    Then(/^I store the value of response header (.*) as (.*) in scenario scope$/, function(name, variable) {
        this.apickli.storeValueOfHeaderInScenarioScope(name, variable);
    });

    Then(/^I store the value of body path (.*) as (.*) in scenario scope$/, function(path, variable) {
        this.apickli.storeValueOfResponseBodyPathInScenarioScope(path, variable);
    });

    Then(/^value of scenario variable (.*) should be (.*)$/, function(variableName, variableValue) {
        const assertion = this.apickli.assertScenarioVariableValue(variableName, variableValue);

        expect(assertion.success, 'Value of variable ' + variableName + ' isn\'t equal to ' + variableValue).to.be.true;
    });
});

const getResultAssertion = function(assertion, attach, inverted) {
    if (!assertion.success) {
        // This is required to mitigate issue https://github.com/apickli/apickli/issues/130
        if(inverted){
            attach(`API test step errors: ${prettyJson.render(assertion.expected)}`);
            console.log(chalk.red(`API test step errors. Expected ${prettyJson.render(assertion.expected)} to be ${prettyJson.render(assertion.actual)}`));
        }
        else {
            attach(`API test step errors: ${prettyJson.render(assertion.actual)}`);
            console.log(chalk.red(`API test step errors. Expected ${prettyJson.render(assertion.actual)} to be ${prettyJson.render(assertion.expected)}`));
        }
    }

    expect(assertion.success, 'API test step failed').to.be.true;
};

const getResponseAssertion = function(error, httpResponse, attach) {
    if(httpResponse && httpResponse.body){
        attach(`API test response body: ${prettyJson.render(httpResponse.body)}`);
        console.log(chalk.cyan(`API test response body: ${prettyJson.render(httpResponse.body)}`));
    }

    expect(error, 'API test step failed').to.be.null;
    expect(httpResponse.statusCode, 'API test step failed').to.be.oneOf([200, 201]);
};
