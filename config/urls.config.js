const domains = require("./domains.config");
const adminPages = require("../src/urls/cms.admin.pages");
const journeyPages = require("../src/urls/journey.pages");
const testDataPages = require("../src/urls/test.data.pages");

const getLookupUrls = function(env, site, lookups, classifier, rootPaths) {
  let urls = {};
  if (lookups[site]) {
    let domain = domains[site][env];
    let rootPath = rootPaths ? rootPaths[site] : "";

    Object.entries(lookups[site]).forEach(([key, value]) => {
      urls[`${site}_${key}_${classifier}`] = `${domain}${rootPath}${value}`;
    });
  }
  return urls;
};

module.exports = {
  getURLs: function(env, site) {
    return Object.assign(
      {},
      getLookupUrls(env, "cmsAdmin", adminPages, "admin_page"),
      getLookupUrls(env, site, testDataPages, "page"),
      getLookupUrls(env, site, journeyPages, "journey_page")
    );
  }
};
