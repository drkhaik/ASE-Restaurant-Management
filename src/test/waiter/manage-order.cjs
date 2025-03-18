const { Builder, By, until, Browser } = require('selenium-webdriver');
const assert = require('assert');

describe('Order Management', function() {
  // Increase timeout to allow for navigation and DOM updates.
  this.timeout(60000);
  let driver;

  before(async function() {
    driver = await new Builder().forBrowser(Browser.EDGE).build();
  });

  after(async function() {
    await driver.quit();
  });

  it('should login, add, update, and delete an order', async function() {
    // --- 1. Login as Admin ---
    await driver.get('http://localhost:5000/login');
    await driver.findElement(By.id('username')).sendKeys('waiter@email.com');
    await driver.findElement(By.id('password')).sendKeys('123456');
    await driver.findElement(By.css('button')).click();
    await driver.wait(until.urlContains('/dashboard'), 10000);

    // --- 2. Navigate to Orders Page via Sidebar ---
    await driver.findElement(By.css('a.nav-option[href="/orders"]')).click();
    await driver.wait(until.urlContains('/orders'), 10000);

    // --- 3. Add New Order ---
    // Click "Add New Order" button.
    await driver.wait(until.elementLocated(By.css('button.button-add a')), 10000);
    await driver.findElement(By.css('button.button-add a')).click();
    await driver.wait(until.urlContains('/orders/add-order'), 10000);

    // On Add Order page, fill out the form.
    // The staff field and status are pre-filled/disabled.
    // Select a dish from the dish selector.
    const dishSelector = await driver.wait(until.elementLocated(By.id('dish_selector')), 10000);
    // Select the first available dish option.
    await dishSelector.findElement(By.css('option')).click();

    // Click the "Add" button to add the dish to the order.
    await driver.findElement(By.id('add_dish_button')).click();

    // Wait until the order table becomes visible (i.e. dish row is added).
    const orderTable = await driver.findElement(By.id('order_table'));
    await driver.wait(until.elementIsVisible(orderTable), 10000);
    await driver.wait(async () => {
      const rows = await orderTable.findElements(By.css('tbody tr'));
      return rows.length > 0;
    }, 10000);

    // Submit the order.
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.urlContains('/orders'), 10000);

    // Verify that the new order appears on the Orders page.
    // Here we assume the new order has status "PENDING".
    let orderStatusElem = await driver.wait(
      until.elementLocated(By.xpath("//span[contains(@class, 'status') and normalize-space(text())='PENDING']")),
      10000
    );
    let statusText = await orderStatusElem.getText();
    assert.strictEqual(statusText, 'PENDING', 'New order was not added correctly');

    // --- 4. Update the Order ---
    // Find the "Update" button in the row with status "PENDING".
    const updateButton = await driver.findElement(By.xpath(
      "//tr[.//span[contains(@class, 'status') and normalize-space(text())='PENDING']]//button[contains(@class, 'button-update')]/a[contains(@href, 'orders/edit-order')]"
    ));
    await updateButton.click();
    await driver.wait(until.urlContains('/orders/edit-order'), 10000);

    // On the Edit Order page, change the order status to DELIVERED.
    const statusSelect = await driver.wait(until.elementLocated(By.id('status')), 10000);
    await statusSelect.findElement(By.css("option[value='DELIVERED']")).click();

    // Submit the update form.
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.urlContains('/orders'), 10000);

    // Verify the updated order now shows status DELIVERED.
    orderStatusElem = await driver.wait(
      until.elementLocated(By.xpath("//span[contains(@class, 'status') and normalize-space(text())='DELIVERED']")),
      10000
    );
    statusText = await orderStatusElem.getText();
    assert.strictEqual(statusText, 'DELIVERED', 'Order status was not updated to DELIVERED');

    // --- 5. Delete the Order ---
    // Find the "Delete" button for the order (using the updated status row).
    const deleteButton = await driver.findElement(By.xpath(
      "//tr[.//span[contains(@class, 'status') and normalize-space(text())='DELIVERED']]//button[contains(@class, 'button-delete')]/a"
    ));
    await deleteButton.click();
    await driver.wait(until.urlContains('/orders'), 10000);

    // Verify that the order is no longer present.
    const ordersAfterDelete = await driver.findElements(By.xpath(
      "//span[contains(@class, 'status') and normalize-space(text())='DELIVERED']"
    ));
    assert.strictEqual(ordersAfterDelete.length, 0, 'Order was not deleted successfully');
  });
});
