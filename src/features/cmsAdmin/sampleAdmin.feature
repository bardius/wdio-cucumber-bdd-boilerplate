# Written by: George Bardis
# Project: Sample
# Last Edited date: 03Mar2018
# Last Edited by: George Bardis
# Help: npm run execute -- --feature=sampleAdmin --project=cmsAdmin
# ==========================================================================

Feature: Sample CMS Admin - Sample Feature
    As an author
    I want to be able to test the sample CMS Admin
    Because I want to verify sample CMS Admin tests work

    Background:
        Given I navigate to the Url "author_login_page"
        Then I am redirected to "author_login_page" page

    @sampleAdmin @GeorgeBardis @tag2
    Scenario: Sample CMS Admin - Sample Feature - Sample Scenario
        # User login steps
        When I set "adminUser" to the inputfield "username"
        And I set "adminPass" to the inputfield "password"
        And I click on the button "login_button"
        Then I am redirected to "cms_dashboard_page" page

        # User journey steps
        Then I check for accessibility violations with AxeCore
        And I take screenshot of "Authenticated Page"
        When I click on browser back button
        Then I am redirected to "author_login_page" page
        When I click on browser forward button
        Then I am redirected to "cms_dashboard_page" page

        # User logout steps
        And I click on the button "logout_button"
        Then I am redirected to "author_login_page" page
