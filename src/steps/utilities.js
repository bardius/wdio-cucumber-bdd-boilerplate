import { Given, When, Then } from "cucumber";

// Set the browser as maximize window
// Gherkin - When I maximize the browser
When(/^I maximise the browser$/, function() {
  browser.windowHandleMaximize();
});

// Fail a scenario and mark it as incomplete in the reports
// Gherkin - When I mark this scenario as incomplete
Then(/^I mark this scenario as incomplete$/, function() {
  expect(true, "Scenario is incomplete").to.be.false;
});
