const report = require("multiple-cucumber-html-reporter");
const os = require("os");

report.generate({
  jsonDir: "cypress/support/",
  reportPath: "docs/",
  metadata: {
    browser: {
      name: "electron",
      version: "115",
    },
    device: os.hostname(), // Get the machine hostname
    platform: {
      name: os.platform(), // Get the operating system platform dynamically
      version: os.release(), // Get the operating system version dynamically
    },
  },
  customData: {
    title: "Run info",
    data: [
      { label: "Project", value: "Github API Test on Cypress" },
      { label: "Release", value: "1.0.0" },
    ],
  },
});
