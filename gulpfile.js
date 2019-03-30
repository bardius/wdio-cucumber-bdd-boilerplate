const gulp = require("gulp");
const gulpSequence = require("gulp-sequence");
const argv = require("yargs").argv;
const webdriver = require("gulp-webdriver");
const mkdirp = require("mkdirp");
const del = require("del");

const pa11y = require("pa11y");
const pa11yHTMLReporter = require("./node_modules/pa11y/reporter/html.js");
const pallyConfig = require("./config/pally.config").pallyConfig;
const pallyUrls = require("./config/pally.config").pallyUrls;
const pallyTest = pa11y(pallyConfig());

const selectedGrade = argv.grade || "chrome";

gulp.task("clean", done => {
  return del(["reports/**/*", "output/**/*"], done);
});

gulp.task("create-folders", done => {
  new Promise(function(resolve, reject) {
    try {
      mkdirp("./reports");
      mkdirp("./reports/pa11y");
      mkdirp("./reports/pa11y-report");
      mkdirp("./reports/cucumber");
      mkdirp("./reports/lighthouse");
      mkdirp("./reports/visual_regression");
      mkdirp("./output");
      mkdirp("./output/logs");
      mkdirp("./output/cucumber");
      mkdirp("./output/screenshots");
      resolve();
    } catch (error) {
      console.log(error);
      done();
    }
  }).then(function() {
    done();
  });
});

gulp.task("pa11y-test", ["clean", "create-folders"], done => {
  const testUrl = pallyUrls()[0];

  pallyTest.run(testUrl, function(error, results) {
    if (error) {
      console.error(error.message);
      done();
    }

    pa11yHTMLReporter.results(results, testUrl);
    done();
  });
});

gulp.task("wdio", done => {
  return gulp
    .src("config/wdio.config.js")
    .pipe(webdriver())
    .once("end", () => {})
    .on("error", () => {
      done();
    });
});

gulp.task("wdioBrowserStack", done => {
  const wdioConfSrc = `config/wdio.browserstack.${selectedGrade}.config.js`;
  console.log(`Configuration from ${wdioConfSrc}`);

  return gulp
    .src(wdioConfSrc.toLowerCase())
    .pipe(webdriver())
    .once("end", () => {})
    .on("error", () => {
      done();
    });
});

gulp.task("wdioSsaucelabs", ["create-folders"], done => {
  const wdioConfSrc = `config/wdio.saucelabs.${selectedGrade}.config.js`;
  console.log(`Configuration from ${wdioConfSrc}`);

  return gulp
    .src(wdioConfSrc.toLowerCase())
    .pipe(webdriver())
    .once("end", () => {
      // process.exit();
      // done();
    })
    .on("error", () => {
      done();
    });
});

// Usage:
// gulp execute --env=local --project=sample --feature=sampleFeature --suite=sample --tags="@tag1 and @tag2" --debug=true --browser=chrome --headless=false --hub=false
gulp.task("execute", gulpSequence("clean", "create-folders", "wdio"));

// Usage:
// gulp browserstack --env=local --conf=grade1 --project=sample --feature=sampleFeature --suite=sample --tags="@tag1 and @tag2" --debug=true --bsLocal=true
gulp.task("browserstack", gulpSequence("clean", "create-folders", "wdioBrowserStack"));

// Usage:
// gulp saucelabs --env=local --conf=grade1 --project=sample --feature=sampleFeature --suite=sample --tags="@tag1 and @tag2" --debug=true --browser=chrome --headless=false
gulp.task("saucelabs", gulpSequence("clean", "create-folders", "wdioSsaucelabs"));
