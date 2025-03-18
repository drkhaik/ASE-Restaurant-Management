const { Builder, By, until, Browser } = require('selenium-webdriver');
const assert = require('assert');

describe('Admin User Management', function() {
  // Increase timeout to allow for navigation and DOM updates.
  this.timeout(60000);
  let driver;

  before(async function() {
    // Use Edge browser on http://localhost:5000.
    driver = await new Builder().forBrowser(Browser.EDGE).build();
  });

  after(async function() {
    await driver.quit();
  });

  it('should login, add, and update a user', async function() {
    // --- 1. Login as Admin ---
    await driver.get('http://localhost:5000/login');
    await driver.findElement(By.id('username')).sendKeys('admin@email.com');
    await driver.findElement(By.id('password')).sendKeys('123456');
    await driver.findElement(By.css('button')).click();
    await driver.wait(until.urlContains('/dashboard'), 10000);

    // --- 2. Navigate to Users Page via Sidebar ---
    await driver.findElement(By.css('a.nav-option[href="/users"]')).click();
    await driver.wait(until.urlContains('/users'), 10000);

    // --- 3. Add New User ---
    // Click "Add new User" button.
    await driver.wait(until.elementLocated(By.css('button.button-add a')), 10000);
    await driver.findElement(By.css('button.button-add a')).click();
    await driver.wait(until.urlContains('/users/add-user'), 10000);

    // Fill out the Add User form.
    await driver.findElement(By.id('name')).sendKeys('Test User');
    await driver.findElement(By.id('username')).sendKeys('testuser');
    await driver.findElement(By.id('email')).sendKeys('testuser@example.com');
    await driver.findElement(By.id('password')).sendKeys('password123');
    // Select the first available role.
    const roleSelect = await driver.findElement(By.id('role'));
    await roleSelect.findElement(By.css('option')).click();

    // Submit the form.
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.urlContains('/users'), 10000);

    // Verify the new user appears in the list.
    let userRow = await driver.wait(
      until.elementLocated(By.xpath("//tr/td[normalize-space(text())='Test User']")),
      10000
    );
    let userName = await userRow.getText();
    assert.strictEqual(userName, 'Test User', 'New user was not added successfully');

    // --- 4. Update the User ---
    // Find the "Update" link/button for the new user.
    const updateLink = await driver.findElement(By.xpath(
      "//tr[td[normalize-space(text())='Test User']]//a[contains(@href, 'users/edit-user')]"
    ));
    await updateLink.click();
    await driver.wait(until.urlContains('/users/edit-user'), 10000);

    // Update user's name and email.
    const editNameField = await driver.wait(until.elementLocated(By.id('name')), 10000);
    await editNameField.clear();
    await editNameField.sendKeys('Updated Test User');

    const editEmailField = await driver.findElement(By.id('email'));
    await editEmailField.clear();
    await editEmailField.sendKeys('updated@test.com');

    // Submit the update form.
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.urlContains('/users'), 10000);

    // Verify the updated user now appears in the list.
    userRow = await driver.wait(
      until.elementLocated(By.xpath("//tr/td[normalize-space(text())='Updated Test User']")),
      10000
    );
    userName = await userRow.getText();
    assert.strictEqual(userName, 'Updated Test User', 'User update failed');
  });
});
