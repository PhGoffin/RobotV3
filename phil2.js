import { chromium } from '@playwright/test';

const browser = await chromium.launch({
  headless: false // REQUIRED for PIN dialog
});

const context = await browser.newContext();
const page = await context.newPage();

await page.goto('https://belpic.rrn/');

// Trigger request via fetch
const response = await page.evaluate(async () => {
  const res = await fetch('https://belpic.rrn/document-production/api/v1/documents?date=20201112&identificationrrn=RRN0007ZZ04444600000&time=1220&urgency=normal', {
    method: 'GET',
    credentials: 'include'
  });
  return res.json();
});

console.log(response);
