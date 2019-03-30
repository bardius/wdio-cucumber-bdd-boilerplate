const argv = require("yargs").argv;
const localPort = argv.localPort || 9001;
const localHost = argv.localHost || "localhost";

// List of domains per environment for each site
const domains = {
  cmsAdmin: {
    local: `http://${localHost}:${localPort}`,
    dev: `https://github.com`,
    qa: `https://github.com`,
    prod: `https://github.com`
  },
  website: {
    local: `http://${localHost}:${localPort}`,
    dev: `https://github.com`,
    qa: `https://github.com`,
    prod: `https://github.com`
  }
};

module.exports = domains;
