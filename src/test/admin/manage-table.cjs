const { Builder, By, until, Browser } = require('selenium-webdriver');
const assert = require('assert');

describe('Admin Table Management', function() {
  // Increase timeout in case browser startup or navigation takes longer.
  this.timeout(50000);
  let driver;

  before(async function() {
    driver = await new Builder().forBrowser(Browser.EDGE).build();
  });

  after(async function() {
    await driver.quit();
  });

  it('should login as admin, add, update, and delete a table', async function() {
    // 1. Login as Admin
    await driver.get('http://localhost:5000/login');
    await driver.findElement(By.id('username')).sendKeys('admin@email.com');
    await driver.findElement(By.id('password')).sendKeys('123456');
    await driver.findElement(By.css('button')).click();
    await driver.wait(until.urlContains('/dashboard'), 10000);

    // 2. Navigate to Table Service Page via sidebar
    await driver.findElement(By.css('a.nav-option[href="/tables"]')).click();
    await driver.wait(until.urlContains('/tables'), 10000);

    // 3. Click "Add New Table" Button
    await driver.wait(until.elementLocated(By.css('button.button-add a')), 10000);
    await driver.findElement(By.css('button.button-add a')).click();
    await driver.wait(until.urlContains('/tables/add-table'), 10000);

    // 4. Fill out the Add New Table form and submit
    const nameField = await driver.wait(until.elementLocated(By.id('name')), 10000);
    await nameField.sendKeys('Test Table 1');
    const statusSelect = await driver.findElement(By.id('status'));
    await statusSelect.findElement(By.css('option[value="AVAILABLE"]')).click();
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.urlContains('/tables'), 10000);

    // 5. Verify the New Table is Present on the Table List page
    let tableCard = await driver.wait(
      until.elementLocated(By.xpath("//div[contains(@class, 'card')]/h3[text()='Test Table 1']")),
      10000
    );
    let tableText = await tableCard.getText();
    assert.strictEqual(tableText, 'Test Table 1', 'New table was not found on the tables page.');

    // 6. Click the "View Details" button to update the table.
    const viewDetailsButton = await driver.findElement(
      By.xpath("//div[contains(@class, 'card')][.//h3[text()='Test Table 1']]//a[contains(@class, 'button-action')]")
    );
    await viewDetailsButton.click();
    await driver.wait(until.urlContains('/tables/table-details'), 10000);

    // 7. Update table details: change the name to "Updated Test Table 1"
    const nameInput = await driver.wait(until.elementLocated(By.css('form input[name="name"]')), 10000);
    await nameInput.clear();
    await nameInput.sendKeys('Updated Test Table 1');

    // 8. Click "Save Changes" to update the table.
    await driver.findElement(By.css('button.submit-button')).click();
    await driver.wait(until.urlContains('/tables'), 10000);

    // 9. Verify that the updated table appears on the list.
    tableCard = await driver.wait(
      until.elementLocated(By.xpath("//div[contains(@class, 'card')]/h3[text()='Updated Test Table 1']")),
      10000
    );
    tableText = await tableCard.getText();
    assert.strictEqual(tableText, 'Updated Test Table 1', 'Updated table was not found on the tables page.');

    // 10. Click the "View Details" button for the updated table.
    const updatedViewDetailsButton = await driver.findElement(
      By.xpath("//div[contains(@class, 'card')][.//h3[text()='Updated Test Table 1']]//a[contains(@class, 'button-action')]")
    );
    await updatedViewDetailsButton.click();
    await driver.wait(until.urlContains('/tables/table-details'), 10000);

    // 11. Click the "Delete" button in the details page.
    const deleteButton = await driver.wait(until.elementLocated(By.css('a.delete-button')), 10000);
    await deleteButton.click();
    await driver.wait(until.urlContains('/tables'), 10000);

    // 12. Verify that the table is no longer present.
    const tableCards = await driver.findElements(By.xpath("//div[contains(@class, 'card')]/h3[text()='Updated Test Table 1']"));
    assert.strictEqual(tableCards.length, 0, 'Table was not deleted successfully.');
  });
});
