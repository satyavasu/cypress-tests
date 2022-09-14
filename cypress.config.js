const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
      baseUrl: 'http://automationpractice.com',
      defaultCommandTimeout: 30000,
      requestTimeout: 15000,
      video: false 
  },
});
