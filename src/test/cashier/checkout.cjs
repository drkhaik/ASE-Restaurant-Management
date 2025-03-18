const { Builder, By, until, Browser } = require('selenium-webdriver');
const assert = require('assert');

describe('Cashier Payment Flow Access', function() {
  this.timeout(60000);
  let driver;
  
  before(async function() {
    // Use Microsoft Edge on http://localhost:5000.
    driver = await new Builder().forBrowser(Browser.EDGE).build();
  });
  
  after(async function() {
    await driver.quit();
  });
  
  it('should login as cashier and access payment and invoice pages', async function() {
    // --- 1. Login as Cashier ---
    await driver.get('http://localhost:5000/login');
    await driver.findElement(By.id('username')).sendKeys('cashier@email.com');
    await driver.findElement(By.id('password')).sendKeys('123456');
    await driver.findElement(By.css('button')).click();
    await driver.wait(until.urlContains('/dashboard'), 10000);

    // --- 2. Navigate to Orders Page via Sidebar ---
    await driver.findElement(By.css('a.nav-option[href="/orders"]')).click();
    await driver.wait(until.urlContains('/orders'), 10000);

    // --- 3. Click on the Pay Button for the First Order ---
    // Locate the first order's pay button using the title attribute.
    const payButton = await driver.findElement(By.xpath("//tr[td]//a[@title='Payment this order']"));
    await payButton.click();
    await driver.wait(until.urlContains('payment/order-detail-pay'), 10000);

    // --- 4. Verify the Payment Page is Accessible ---
    // Check that the payment header is present.
    const paymentHeader = await driver.findElement(By.css('.payment-container .payment-header h1'));
    const paymentHeaderText = await paymentHeader.getText();
    assert.ok(paymentHeaderText.length > 0, 'Payment page header is missing');

    // Check that the Cash payment button is available.
    const cashButton = await driver.findElement(By.css('button.pay-now.cash'));
    assert.ok(cashButton, 'Cash payment button is not found on the Payment page');

  });
});
