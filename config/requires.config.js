const includedFiles = [
    'src/steps/accessibility.js',
    'src/steps/apickli-gherkin.js',
    'src/steps/given.js',
    'src/steps/imports.js',
    'src/steps/login.js',
    'src/steps/navigation.js',
    'src/steps/sample.js',
    'src/steps/then.js',
    'src/steps/utilities.js',
    'src/steps/when.js',
    'src/support/handlers.js',
    'src/support/hooks.js',
    'src/support/jsonReport.js'
];

module.exports = {
    getRequires: function(){
        return includedFiles;
    }
};
