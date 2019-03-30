// https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#api-name-axeconfigure
const axeConfig = {
  runOnly: {
    type: "tag",
    values: ["wcag2a", "wcag2aa", "section508"]
  },
  rules: {
    "definition-list": { enabled: true },
    "frame-title": { enabled: false }
  },
  reporter: "v1",
  resulttypes: ["violations", "incomplete", "inapplicable"]
};

const axeExcludes = {
  exclude: [["#excluded-element"], ["#excluded-element2"], ["#excluded-element3 > div"]]
};

export { axeConfig, axeExcludes };
