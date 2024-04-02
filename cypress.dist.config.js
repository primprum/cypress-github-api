const { defineConfig } = require("cypress");
const preprocessor = require("@badeball/cypress-cucumber-preprocessor");
const browserify = require("@badeball/cypress-cucumber-preprocessor/browserify");

async function setupNodeEvents(on, config) {
  await preprocessor.addCucumberPreprocessorPlugin(on, config);
  on("file:preprocessor", browserify.default(config));

  return config;
}

module.exports = defineConfig({
  // trying to solve timeout problem while accessing saucedemo.com
  // tested by using Electron, it uses Chrome engine.
  chromeWebSecurity: false,
  pageLoadTimeout: 60000,
  // This can be helpful if you don't want video recordings of your tests.
  video: false,
  defaultCommandTimeout: 5000,
  e2e: {
    specPattern: "**/*.feature",
    supportFile: false,
    // step definitions are non-global, meaning they are loaded per feature file rather than globally for all feature files.
    nonGlobalStepDefinitions: true,
    setupNodeEvents,
  },
  env: {
    GITHUB_TOKEN: "<your-token-here>",
  },
});
