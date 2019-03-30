const includedFiles = [
  "src/steps/accessibility.js",
  "src/steps/apickli-gherkin.js",
  "src/steps/authenticated.only.js",
  "src/steps/given.js",
  "src/steps/navigation.js",
  "src/steps/then.js",
  "src/steps/utilities.js",
  "src/steps/visual.regression.js",
  "src/steps/when.js",
  "src/support/hooks.js",
  "src/support/imports.js"
];

module.exports = {
  getRequires: function() {
    return includedFiles;
  }
};
