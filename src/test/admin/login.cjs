const { Builder, By, until, Browser } = require('selenium-webdriver');
const assert = require('assert');

describe('Login Page Test', function() {
  // Increase timeout in case browser startup takes longer
  this.timeout(30000);
  let driver;

  before(async function() {
    driver = await new Builder().forBrowser(Browser.EDGE).build();
  });

  after(async function() {
    await driver.quit();
  });

  it('should login successfully with valid credentials as Admin', async function() {
    // Navigate to the login page
    await driver.get('http://localhost:5000/login');

    // Locate the username and password fields and the login button
    const usernameField = await driver.findElement(By.id('username'));
    const passwordField = await driver.findElement(By.id('password'));
    const loginButton = await driver.findElement(By.css('button'));

    // Enter the credentials
    await usernameField.sendKeys('admin@email.com');
    await passwordField.sendKeys('123456');

    // Click the login button
    await loginButton.click();

    // Wait until the URL changes to include '/dashboard'
    await driver.wait(until.urlContains('/dashboard'), 10000);

    // Verify redirection to the dashboard
    const currentUrl = await driver.getCurrentUrl();
    assert.ok(currentUrl.includes('/dashboard'), 'Login failed: Dashboard was not reached.');
  });
});
