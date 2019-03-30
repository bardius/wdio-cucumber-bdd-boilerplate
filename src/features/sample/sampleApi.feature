# Written by: George Bardis
# Project: Sample
# Last Edited date: 03Mar2018
# Last Edited by: George Bardis
# Help: npm run execute -- --feature=sampleApi --project=sample
# ==========================================================================

Feature: Sample - Sample API Feature
    Httpbin.org exposes various resources for HTTP request testing
    As Httpbin client
    I want to verify that all API resources are working as they should
    Because I want to verify sample tests work

    @sampleAPI @GeorgeBardis @tag1
    Scenario Outline: Sample - Sample API Feature - Setting headers in GET request
        Given I set the API domain to "httpbin_api"
        And I set User-Agent header to apickli
        When I GET /get
        Then response body path $.headers.User-Agent should be apickli
        And response code should be 200
        And response body should be valid json
        And response body should contain http://httpbin.org/get
        And response body should be valid according to schema file responseFiles/sample/httpbin_1.0_get.json
        And response body should be valid according to openapi description 200OK in file swaggerFiles/sample/httpbin_1.0.json

        Examples:
            | username  | password  |
            | username1 | password1 |
