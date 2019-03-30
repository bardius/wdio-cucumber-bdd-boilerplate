# Written by: George Bardis
# Project: Sample
# Last Edited date: 03Mar2018
# Last Edited by: George Bardis
# Help: npm run execute -- --feature=sample --project=sample --env=prod
# ==========================================================================

Feature: Sample - Sample Feature
    As a developer
    I want to be able to test the sample project
    Because I want to verify sample tests work

    Background:
        Given I navigate to the Url "website_landing_journey_page"
        Then I am redirected to "website_domain_journey_page" page

    @sample @GeorgeBardis @tag1
    Scenario: Sample - Sample Feature - Sample Scenario
        When I scroll to element "integrations_btn"
        When I click on the element "integrations_btn"
        Then I am redirected to "website_integrations_page" page
        When I click on the element "features_breadcrumb"
        Then I am redirected to "website_features_page" page

        Then I check for accessibility violations with AxeCore
        And I take a screenshot of "Features Page"
        When I click on browser back button
        Then I am redirected to "website_integrations_page" page

    @sample @GeorgeBardis @tag2
    Scenario: Sample - Sample Feature - Sample Journey Scenario 2
        When I scroll to element "integrations_btn"
        When I click on the element "integrations_btn"
        Then I am redirected to "website_integrations_journey_page" page
        When I click on the element "features_breadcrumb"
        Then I am redirected to "website_features_journey_page" page

        Then I check for accessibility violations with AxeCore
        And I take a screenshot of "Features Journey Page"
        When I click on browser back button
        Then I am redirected to "website_integrations_journey_page" page

    @sample @GeorgeBardis @tag2 @pending
    Scenario: Sample - Sample Feature - Sample Journey Scenario 2
        When I scroll to element "integrations_btn"
        When I click on the element "integrations_btn"
        Then I am redirected to "website_integrations_journey_page" page
        When I click on the element "features_breadcrumb"
        Then I am redirected to "website_features_journey_page" page

        Then I check for accessibility violations with AxeCore
        And I take a screenshot of "Features Journey Page"
        When I click on browser back button
        Then I am redirected to "website_integrations_journey_page" page
