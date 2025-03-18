// const { Builder, By, until, Browser } = require('selenium-webdriver');
// const assert = require('assert');

// describe('Admin Work Schedule', function() {
//   // Increase timeout to allow for navigation and DOM updates.
//   this.timeout(80000);
//   let driver;

//   before(async function() {
//     // Use Microsoft Edge on http://localhost:5000.
//     driver = await new Builder().forBrowser(Browser.EDGE).build();
//   });

//   after(async function() {
//     await driver.quit();
//   });

//   it('should add or update a work schedule', async function() {
//     // --- 1. Login as Admin ---
//     await driver.get('http://localhost:5000/login');
//     await driver.findElement(By.id('username')).sendKeys('admin@email.com');
//     await driver.findElement(By.id('password')).sendKeys('123456');
//     await driver.findElement(By.css('button')).click();
//     await driver.wait(until.urlContains('/dashboard'), 10000);

//     // --- 2. Navigate to Work Schedules Page via Sidebar ---
//     await driver.findElement(By.css('a.nav-option[href="/work-schedules"]')).click();
//     await driver.wait(until.urlContains('/work-schedules'), 10000);

//     // --- 3. Add/Update Schedule ---
//     // Click the "Add/Update Schedule" button.
//     await driver.wait(until.elementLocated(By.css('button.button-add a')), 10000);
//     await driver.findElement(By.css('button.button-add a')).click();
//     await driver.wait(until.urlContains('/work-schedules/add-work-schedule'), 10000);

//     // Fill out the Add Schedule form.
//     // Select a user (choose the first option).
//     const scheduleUserSelect = await driver.findElement(By.id('user'));
//     await scheduleUserSelect.findElement(By.css('option')).click();

//     // Select shift: choose "10am-6pm".
//     const shiftSelect = await driver.findElement(By.id('shift'));
//     await shiftSelect.findElement(By.css('option[value="10am-6pm"]')).click();

//     // Set the date. (You can adjust the date as needed.)
//     const dateField = await driver.findElement(By.id('date'));
//     await dateField.sendKeys('2025-04-01');

//     // Submit the schedule form.
//     await driver.findElement(By.css('button[type="submit"]')).click();
//     await driver.wait(until.urlContains('/work-schedules'), 10000);

//     // Verify the schedule table is populated.
//     const scheduleTable = await driver.findElement(By.id('scheduleTable'));
//     await driver.wait(async () => {
//       const rows = await scheduleTable.findElements(By.css('tbody tr'));
//       return rows.length > 0;
//     }, 10000);

//     // Optionally, check for a cell containing the chosen shift.
//     const scheduleRows = await scheduleTable.findElements(By.css('tbody tr'));
//     let foundShift = false;
//     for (const row of scheduleRows) {
//       const cells = await row.findElements(By.css('td'));
//       for (const cell of cells) {
//         const text = await cell.getText();
//         if (text.includes("10am") && text.includes("6pm")) {
//           foundShift = true;
//           break;
//         }
//       }
//       if(foundShift) break;
//     }
//     assert.ok(foundShift, 'New schedule entry was not found in the schedule table');

//   });
// });
