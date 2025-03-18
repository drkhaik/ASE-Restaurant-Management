const { Builder, By, until, Browser } = require('selenium-webdriver');
const assert = require('assert');

describe('Admin Dish Management', function() {
  // Increase timeout to allow for navigation and DOM updates.
  this.timeout(60000);
  let driver;

  before(async function() {
    // Use Edge browser as requested.
    driver = await new Builder().forBrowser(Browser.EDGE).build();
  });

  after(async function() {
    await driver.quit();
  });

  it('should login, add, update, and delete a dish', async function() {
    // --- 1. Login as Admin ---
    await driver.get('http://localhost:5000/login');
    await driver.findElement(By.id('username')).sendKeys('admin@email.com');
    await driver.findElement(By.id('password')).sendKeys('123456');
    await driver.findElement(By.css('button')).click();
    await driver.wait(until.urlContains('/dashboard'), 10000);

    // --- 2. Navigate to Dish Page via Sidebar ---
    await driver.findElement(By.css('a.nav-option[href="/dishes"]')).click();
    await driver.wait(until.urlContains('/dishes'), 10000);

    // --- 3. Add New Dish ---
    // Click "Add New Dish" button.
    await driver.wait(until.elementLocated(By.css('button.button-add a')), 10000);
    await driver.findElement(By.css('button.button-add a')).click();
    await driver.wait(until.urlContains('/dishes/add-dish'), 10000);

    // Fill out the Add Dish form.
    const nameField = await driver.wait(until.elementLocated(By.id('name')), 10000);
    await nameField.sendKeys('Test Dish 1');

    const descriptionField = await driver.findElement(By.id('description'));
    await descriptionField.sendKeys('Test dish description');

    const categorySelect = await driver.findElement(By.id('category'));
    await categorySelect.findElement(By.css('option[value="starter"]')).click();

    const priceField = await driver.findElement(By.id('price'));
    await priceField.sendKeys('9.99');

    // Submit the form.
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.urlContains('/dishes'), 10000);

    // Verify the new dish appears in the list.
    let dishNameCell = await driver.wait(
      until.elementLocated(By.xpath("//tr/td[normalize-space(text())='Test Dish 1']")),
      10000
    );
    let dishText = await dishNameCell.getText();
    assert.strictEqual(dishText, 'Test Dish 1', 'New dish was not added successfully');

    // --- 4. Update the Dish ---
    // Find the "Update" button/link for the newly added dish.
    const updateButton = await driver.findElement(By.xpath(
      "//tr[td[normalize-space(text())='Test Dish 1']]//a[contains(@href, 'dishes/edit-dish')]"
    ));
    await updateButton.click();
    await driver.wait(until.urlContains('/dishes/edit-dish'), 10000);

    // On the Edit Dish page, update the dish details.
    const editNameField = await driver.wait(until.elementLocated(By.id('name')), 10000);
    await editNameField.clear();
    await editNameField.sendKeys('Updated Test Dish 1');

    const editPriceField = await driver.findElement(By.id('price'));
    await editPriceField.clear();
    await editPriceField.sendKeys('12.99');

    // Submit the update form.
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.urlContains('/dishes'), 10000);

    // Verify that the dish is updated in the list.
    dishNameCell = await driver.wait(
      until.elementLocated(By.xpath("//tr/td[normalize-space(text())='Updated Test Dish 1']")),
      10000
    );
    dishText = await dishNameCell.getText();
    assert.strictEqual(dishText, 'Updated Test Dish 1', 'Dish update failed');

    // --- 5. Delete the Dish ---
    // Find the "Delete" button for the updated dish.
    const deleteButton = await driver.findElement(By.xpath(
      "//tr[td[normalize-space(text())='Updated Test Dish 1']]//a[@title='Delete this dish']"
    ));
    await deleteButton.click();
    await driver.wait(until.urlContains('/dishes'), 10000);

    // Verify that the dish is no longer present.
    const dishElements = await driver.findElements(By.xpath("//tr/td[normalize-space(text())='Updated Test Dish 1']"));
    assert.strictEqual(dishElements.length, 0, 'Dish was not deleted successfully');
  });
});
