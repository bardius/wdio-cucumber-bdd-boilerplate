import { setWorldConstructor, defineParameterType } from "cucumber";

const chalk = require("chalk");

chalk.enabled = true;
chalk.level = 3;

try {
  const world = require("./world.js").World;
  const enhancedWorld = function({ attach, parameters }) {
    this.attach = attach;
    this.parameters = parameters;

    // Globals set to browser object to avoid bug with retried steps:
    // https://github.com/webdriverio/wdio-cucumber-framework/issues/37
    global.browser["world"] = world;
  };

  setWorldConstructor(enhancedWorld);

  // Data transformations to apply selector and URL mapping
  defineParameterType({
    regexp: /[^"]*/,
    transformer(stepArgument) {
      return isNaN(stepArgument) && stepArgument ? world.getSelector(stepArgument).replace(/\s*$/, "") : stepArgument !== undefined ? stepArgument : "";
    },
    preferForRegexpMatch: true,
    useForSnippets: true,
    name: "locator"
  });

  console.log(chalk.green(`WORLD SUCCESSFULLY ENHANCED`));
} catch (error) {
  console.log(chalk.red(`WORLD FAILED TO GET ENHANCED`));
  console.log(chalk.red(`${error}`));
}
