import { chromium } from '@playwright/test';

(async () => {
    try {
        const browser = await chromium.launch({ headless: false });

        const context = await browser.newContext({
            ignoreHTTPSErrors: true
        });

        const page = await context.newPage();

        await page.goto('about:blank');


        console.log('Ready. Open DevTools Network tab NOW.');

        await page.waitForTimeout(20000);
        console.log ('Restart the test....')



        const response = await page.evaluate(async () => {
            const params = new URLSearchParams({
                date: '20201112',
                identificationrrn: 'RRN0007ZZ04444600000',
                time: '1220',
                urgency: 'normal'
            });

            const res = await fetch(
                `https://belpic.rrn/document-production/api/v1/documents?${params}`,
                {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Origin': 'https://belpic.rrn',
                        'User-Agent': 'Mozilla/5.0'
                    }
                }
            );

            return {
                status: res.status,
                ok: res.ok,
                text: await res.text()
            };
        });

        console.log(response);
    } catch (e) {
        console.error('ERROR:', e);
    }
})();
