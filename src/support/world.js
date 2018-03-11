const expect = require('chai').expect;
const assert = require('chai').assert;
const yaml = require('js-yaml');
const fs = require('fs-extra');
const yamlMerge = require('yaml-merge');
const glob = require('glob');
const chalk = require('chalk');

let config = require('./config');
let testsData = yaml.load(fs.readFileSync('src/files/testData/testsData.yml'));
let locatorsYaml = glob('src/locators/**/*.yml', function(error, files) {
    locatorsYaml = yamlMerge.mergeFiles(files);
});

function processSelector(selector){
    const subSelectors = selector.split('|');
    let combinedSelector = '';

    for (let i = 0; i < subSelectors.length; i++){
        let resolvedSelector = getSelector(subSelectors[i]);

        if(resolvedSelector.indexOf('|') > -1){
            combinedSelector += processSelector(resolvedSelector);
        }
        else {
            combinedSelector += resolvedSelector + ' ';
        }
    }

    return combinedSelector;
}

function getSelector(element) {
    let dataSelector = element.indexOf(' ') > 1 ? '[data-selector*="' : '[data-selector="';

    if(config.lookups[element]){
        dataSelector = config.lookups[element];
    }
    else if(locatorsYaml[element]){
        dataSelector = locatorsYaml[element];
    }
    else {
        dataSelector = element;
    }

    return dataSelector;
}

function getTestData(dataKey){
    return testsData[dataKey];
}

try {
    // Setting up config object
    config.serverUrls = global.browser.options.serverUrls;
    config.expectedrespposeFoldePath = global.browser.options.expectedrespposeFoldePath;
    config.jsonRequestFolderPath = global.browser.options.jsonRequestFolderPath;
    config.xmlFolderPath = global.browser.options.xmlFolderPath;
    config.swaggerFolderPath = global.browser.options.swaggerFolderPath;
    config.testDataFolderPath = global.browser.options.testDataFolderPath;
    config.capabilities = global.browser.options.desiredCapabilities;
    config.performanceOptions = global.browser.options.performanceOptions;

    // Determine if the login steps should be properly evaluated
    config.env = global.browser.options.env;
    config.itShouldNotLogin = config.env && (config.env === 'local');

    const World = {
        assert: assert,
        expect: expect,
        client: global.browser,
        config: config,
        getTestData: function(dataKey){
            return getTestData(dataKey);
        },
        getSelector: function(element){
            return processSelector(element);
        },
        getTodaysDate: function(){
            const currentDate = new date();

            return [
                ('0' + (currentDate.getDate())).slice(-2),
                ('0' + (currentDate.getMonth() + 1)).slice(-2),
                currentDate.getFullYear()
            ].join('/');
        },
        getRandomString: function(){
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            const totalChars = chars.length;
            let randomString =  '';
            let randomNumber = 0;

            for(let i = 0; i < 5; i++) {
                randomNumber = Math.floor(Math.random() * totalChars);
                randomString += chars.substring(randomNumber, randomNumber + 1);
            }

            return randomString;
        }
    };

    exports.World = World;
}
catch (error) {
    console.log(chalk.red(`Error in World creation: ${error}`));
}
