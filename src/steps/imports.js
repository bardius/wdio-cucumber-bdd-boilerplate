import { defineSupportCode } from 'cucumber';

const chalk = require('chalk');
chalk.enabled = true;
chalk.level = 3;

let world;

try {
    world = require('../support/world.js').World;
    console.log(chalk.green(`WORLD SUCCESSFULLY ENHANCED`));
}
catch (error) {
    console.log(chalk.red(`WORLD FAILED TO GET ENHANCED`));
    console.log(chalk.red(`${error}`));
}

function enhancedWorld({attach, parameters}){
    this.attach = attach;
    this.parameters = parameters;

    // Globals
    this.world = world;
    this.getTestData = world.getTestData;
    this.getSelector = world.getSelector;
    this.getTodaysDate = world.getTodaysDate;
    this.getRandomString = world.getRandomString;
    this.config = world.config;
}

defineSupportCode(function({setWorldConstructor}){
    setWorldConstructor(enhancedWorld);
});