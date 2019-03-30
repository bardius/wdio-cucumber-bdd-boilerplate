const argv = require("yargs").argv;
const path = require("path");
const VisualRegressionCompare = require("wdio-visual-regression-service/compare");
const visualRegressionNewTag = argv.visualRegressionTag;
const visualCompareToTag = argv.visualRegressionCompare;
const referenceTag = visualCompareToTag || visualRegressionNewTag || "snapshot";

const getScreenshotName = function(basePath) {
  return function(context) {
    const type = context.type;
    const testName = `${context.feature.name}-${context.scenario.name}`;
    const stepName = context.step.text;
    const browserVersion = parseInt(context.browser.version, 10);
    const browserName = context.browser.name;
    const browserViewport = context.meta.viewport;
    const browserWidth = browserViewport.width;
    const browserHeight = browserViewport.height;

    return path.join(
      basePath,
      `${testName}_${stepName}_${type}_${browserName}_v${browserVersion}_${browserWidth}x${browserHeight}.png`
        .replace(/ - /g, "_")
        .replace(/ /g, "_")
        .replace(/:/g, "-")
        .replace(/"/g, "")
        .replace(/'/g, "")
        .replace(/`/g, "")
        .replace(/\//g, "")
        .replace(/\\/g, "")
    );
  };
};

const localCompareConfig = new VisualRegressionCompare.LocalCompare({
  referenceName: getScreenshotName(path.join(process.cwd(), `reports/visual_regression/reference-screens/${referenceTag}`)),
  screenshotName: getScreenshotName(path.join(process.cwd(), `reports/visual_regression/compare-screens`)),
  diffName: getScreenshotName(path.join(process.cwd(), `reports/visual_regression/diff`)),
  misMatchTolerance: 0.1
});

const saveScreenshotConfig = new VisualRegressionCompare.SaveScreenshot({
  screenshotName: getScreenshotName(path.join(process.cwd(), `visual_regression/screenshots/${referenceTag}`))
});

module.exports = {
  config: {
    compare: visualCompareToTag ? localCompareConfig : saveScreenshotConfig,
    viewportChangePause: 1 * 1000,
    orientations: ["landscape", "portrait"],
    viewports: [{ width: 480, height: 854 }, { width: 768, height: 1024 }, { width: 1280, height: 1024 }, { width: 1440, height: 1024 }]
  }
};
