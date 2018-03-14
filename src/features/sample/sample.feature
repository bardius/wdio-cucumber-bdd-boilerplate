# Written by: George Bardis
# Project: Sample
# Last Edited date: 03Mar2018
# Last Edited by: George Bardis
# Help: npm run execute -- --feature=sample --project=sample
# ==========================================================================

Feature: Sample - Sample Feature
    As a developer
    I want to be able to test the sample project
    Because I want to verify sample tests work

    Background:
        Given I navigate to the Url "landing_page"
        When I maximise the browser
        Then I am redirected to "landing_page" page

    @sample @GeorgeBardis @tag1
    Scenario Outline: Sample - Sample Feature - Sample Scenario
        # User login steps
        When I scroll to element "test"
        When I click on "sign_in_button" as login step
        Then I am redirected to "login_page" page as login step
        When I click on "username_input" as login step
        And I enter the <username> in "username_input" as login step
        And I click on "password_input" as login step
        And I enter the <password> in "password_input" as login step
        And I take screenshot of "Login Page"
        And I scroll to element "login_button"
        And I click on "login_button" as login step
        Then I am redirected to "authenticated_page" page as login step

        # User journey steps
        Then I check for accessibility violations with AxeCore
        And I take screenshot of "Authendicated Page"
        When I click on browser back button
        Then I am redirected to "landing_page" page

        # User logout steps
        When I click on "logout_button" as login step
        Then I am redirected to "non_authenticated_page" page as login step

        Examples:
            | username      | password      |
            | username1     | password1     |
            | username2     | password2     |

    @sample @GeorgeBardis @tag2 @Pending
    Scenario Outline: Sample - Sample Feature - Sample Scenario 2
        # User login steps
        When I click on "sign_in_button" as login step
        Then I am redirected to "login_page" page as login step
        When I click on "username_input" as login step
        And I enter the <username> in "username_input" as login step
        And I click on "password_input" as login step
        And I enter the <password> in "password_input" as login step
        And I take screenshot of "Login Page"
        And I click on "login_button" as login step
        Then I am redirected to "authenticated_page" page as login step

        # User journey steps
        Then I check for accessibility violations with AxeCore
        And I take screenshot of "Authendicated Page"
        When I click on browser back button
        Then I am redirected to "landing_page" page

        # User logout steps
        When I click on "logout_button" as login step
        Then I am redirected to "non_authenticated_page" page as login step

        Examples:
            | username      | password      |
            | username1     | password1     |
            | username2     | password2     |
