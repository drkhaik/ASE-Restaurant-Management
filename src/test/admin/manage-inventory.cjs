const { Builder, By, until, Browser } = require('selenium-webdriver');
const assert = require('assert');

describe('Admin Inventory Management', function() {
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

  it('should login, add, update, and delete an inventory item', async function() {
    // --- 1. Login as Admin ---
    await driver.get('http://localhost:5000/login');
    await driver.findElement(By.id('username')).sendKeys('admin@email.com');
    await driver.findElement(By.id('password')).sendKeys('123456');
    await driver.findElement(By.css('button')).click();
    await driver.wait(until.urlContains('/dashboard'), 10000);

    // --- 2. Navigate to Inventories Page via Sidebar ---
    await driver.findElement(By.css('a.nav-option[href="/inventories"]')).click();
    await driver.wait(until.urlContains('/inventories'), 10000);

    // --- 3. Add New Inventory Item ---
    // Click "Add New Inventory Item" button.
    await driver.wait(until.elementLocated(By.css('button.button-add a')), 10000);
    await driver.findElement(By.css('button.button-add a')).click();
    await driver.wait(until.urlContains('/inventories/add-inventory'), 10000);

    // Fill out the Add Inventory form.
    const nameField = await driver.wait(until.elementLocated(By.id('name')), 10000);
    await nameField.sendKeys('Test Inventory Item 1');

    const quantityField = await driver.findElement(By.id('quantity'));
    await quantityField.sendKeys('10');

    const priceField = await driver.findElement(By.id('price'));
    await priceField.sendKeys('19.99');

    const categoryField = await driver.findElement(By.id('category'));
    await categoryField.sendKeys('Test Category');

    const descriptionField = await driver.findElement(By.id('description'));
    await descriptionField.sendKeys('Test description');

    // Submit the form.
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.urlContains('/inventories'), 10000);

    // Verify the new inventory item appears in the list.
    let inventoryNameCell = await driver.wait(
      until.elementLocated(By.xpath("//tr/td[normalize-space(text())='Test Inventory Item 1']")),
      10000
    );
    let cellText = await inventoryNameCell.getText();
    assert.strictEqual(cellText, 'Test Inventory Item 1', 'New inventory item was not added successfully');

    // --- 4. Update the Inventory Item ---
    // Locate the "Update" link for the newly added item.
    const updateButton = await driver.findElement(By.xpath(
      "//tr[td[normalize-space(text())='Test Inventory Item 1']]//a[contains(@href, 'inventories/edit-inventory')]"
    ));
    await updateButton.click();
    await driver.wait(until.urlContains('/inventories/edit-inventory'), 10000);

    // On the Edit Inventory page, update the details.
    const editNameField = await driver.wait(until.elementLocated(By.id('name')), 10000);
    await editNameField.clear();
    await editNameField.sendKeys('Updated Test Inventory Item 1');

    const editQuantityField = await driver.findElement(By.id('quantity'));
    await editQuantityField.clear();
    await editQuantityField.sendKeys('20');

    const editPriceField = await driver.findElement(By.id('price'));
    await editPriceField.clear();
    await editPriceField.sendKeys('29.99');

    const editCategoryField = await driver.findElement(By.id('category'));
    await editCategoryField.clear();
    await editCategoryField.sendKeys('Updated Category');

    const editDescriptionField = await driver.findElement(By.id('description'));
    await editDescriptionField.clear();
    await editDescriptionField.sendKeys('Updated test description');

    // Submit the update form.
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.urlContains('/inventories'), 10000);

    // Verify that the updated inventory item appears.
    inventoryNameCell = await driver.wait(
      until.elementLocated(By.xpath("//tr/td[normalize-space(text())='Updated Test Inventory Item 1']")),
      10000
    );
    cellText = await inventoryNameCell.getText();
    assert.strictEqual(cellText, 'Updated Test Inventory Item 1', 'Inventory item update failed');

    // --- 5. Delete the Inventory Item ---
    // Find the delete button within the row of the updated item.
    const deleteButton = await driver.findElement(By.xpath(
      "//tr[td[normalize-space(text())='Updated Test Inventory Item 1']]//button[contains(@class, 'button-delete-inventory')]"
    ));
    await deleteButton.click();
    await driver.wait(until.urlContains('/inventories'), 10000);

    // Verify that the item is no longer present.
    const deletedElements = await driver.findElements(By.xpath(
      "//tr/td[normalize-space(text())='Updated Test Inventory Item 1']"
    ));
    assert.strictEqual(deletedElements.length, 0, 'Inventory item was not deleted successfully');
  });
});
