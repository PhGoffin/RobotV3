const { test, expect } = require('@playwright/test')

test.only('Client App', async ({ page }) => {

    await page.goto("https://rahulshettyacademy.com/client")
    console.log (await page.title())

})