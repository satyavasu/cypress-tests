const { defineConfig } = require("cypress");
const installLogsPrinter = require('cypress-terminal-report/src/installLogsPrinter');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://automationpractice.com',
    defaultCommandTimeout: 30000,
    requestTimeout: 15000,
    video: false,
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      // Terminal output plugin
      installLogsPrinter(on, {
        // onFail, always, never
        printLogsToConsole: "always"
      });
    }
  },
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'cypress-tests-report',
    embeddedScreenshots: true,
    inlineAssets: true
  },
});
