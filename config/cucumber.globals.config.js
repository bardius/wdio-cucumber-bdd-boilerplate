const locators = require("../src/locators/index");
const argv = require("yargs").argv;
const isMobileMode = argv.grade === "mobile" || argv.grade === "tablet";
const isBrowserStackMode = argv.bsLocal || false;
const cmsAdminUser = argv.cmsAdminUser || process.env.cmsAdminUser;
const cmsAdminPass = argv.cmsAdminPass || process.env.cmsAdminPass;
const timeout = argv.timeout || 115 * 1000;

module.exports = {
  locators: locators,
  testData: {
    cmsAdminUser: cmsAdminUser,
    cmsAdminPass: cmsAdminPass
  },
  constants: {
    TIMEOUT: timeout,
    API_TIMEOUT: 15 * 1000,
    API_WAIT_TICK: 200,
    PAUSE: 7.5 * 1000,
    MINI_PAUSE: 1 * 1000,
    aXeThreshold: 10,
    sampleSecret: "sampleSecret",
    sampleProperty: "sampleValue",
    skipAccessibility: argv.grade !== "chrome",
    skipManualScreenshots: false, //isBrowserStackMode
    isMobileMode: isMobileMode
  }
};
