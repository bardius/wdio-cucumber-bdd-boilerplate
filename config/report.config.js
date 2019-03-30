const argv = require("yargs").argv;
const packageJson = require("../package");

const selectedSuite = argv.suite || null;
const selectedTags = argv.tags || null;
const selectedGrade = argv.grade || "chrome";
const selectedBrowser = argv.browser || "chrome";
const selectedEnv = argv.env || "local";
const site = argv.site || "website";
const viewportSize = argv.viewportSize || "1280x1024";

// https://www.npmjs.com/package/wdio-multiple-cucumber-html-reporter
const reportConfig = {
  jsonFolder: "output/cucumber",
  reportFolder: "reports/cucumber",
  saveCollectedJSON: true,
  disableLog: false,
  pageTitle: "BDD tests result report",
  reportName: "BDD tests result report",
  pageFooter: "<div></div>",
  displayDuration: true,
  durationInMS: true,
  metadata: {
    browser: {
      name: "",
      version: ""
    },
    device: "",
    platform: {
      name: "",
      version: ""
    }
  },
  customData: {
    title: "Test run info",
    data: [
      { label: "Project", value: packageJson.name },
      { label: "Environment", value: selectedEnv },
      { label: "Grade", value: selectedGrade },
      { label: "Browser", value: selectedBrowser },
      { label: "Resolution", value: viewportSize },
      { label: "Site", value: site },
      { label: "Suite", value: selectedSuite },
      { label: "Tags", value: selectedTags }
    ]
  }
};

module.exports = reportConfig;
