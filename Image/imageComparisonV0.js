const { chromium } = require('playwright');
const sharp = require('sharp');
const fs = require('fs').promises; // Use the promise-based file system
// const pngjs = require('pngjs').PNG;  // Optional

async function imageBasedAutomation() {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
        const appTitle = 'My Rich Application'; // Your application's window title (for potential use with native automation, though this example focuses on the image part)

        // 1. Take a screenshot of the entire screen
        // await page.goto('about:blank'); // Start with a blank page in the browser.
        const screenshotPath = 'screenshot.png';  // Store the screenshot somewhere
        // await page.screenshot({ path: screenshotPath, fullPage: true }); // Take screenshot of full page

        // 2. Load the template button image (assume you have a png file of the button)
        const buttonTemplatePath = 'button_template.png';

        // 3. Find the button in the screenshot
        const buttonCoordinates = await findImageInImage(screenshotPath, buttonTemplatePath);

        if (buttonCoordinates) {
            console.log(`Button found at: X=${buttonCoordinates.x}, Y=${buttonCoordinates.y}, Diff=${buttonCoordinates.diff}`);

            // 4. Simulate a click (using Playwright's mouse - may need a bridge to your app)
            // await page.mouse.click(buttonCoordinates.x, buttonCoordinates.y);  // Adjust to your app's needs, possibly needing native automation here

            // 5. Add a verification step (e.g., check for a log or the appearance of a confirmation on screen)

            // Example - (If you had access to a log file or a status indicator within your app)
            // await page.goto('file:///path/to/your/log.txt');
            // await page.locator('text=Button Clicked Confirmation').waitFor({timeout: 5000});
            // console.log('Button click verification successful');


        } else {
            console.log('Button not found in the screenshot.');
        }


    } catch (error) {
        console.error('Image Automation Error:', error);
    } finally {
        await browser.close();
    }
}

// **Core Function: findImageInImage**
async function findImageInImage(screenshotPath, templatePath) {
    try {
        const screenshotBuffer = await fs.readFile(screenshotPath);
        const templateBuffer = await fs.readFile(templatePath);

        const screenshot = sharp(screenshotBuffer);
        const template = sharp(templateBuffer);

        // Get screenshot size
        const screenshotMetadata = await screenshot.metadata();
        const screenshotWidth = screenshotMetadata.width;
        const screenshotHeight = screenshotMetadata.height;

        // Get template size
        const templateMetadata = await template.metadata();
        const templateWidth = templateMetadata.width;
        const templateHeight = templateMetadata.height;

        // Perform image matching (using sharp's 'similarity' or 'convolute' methods)
        const { data: matchData, info: matchInfo } = await screenshot
            .clone() // Clone to avoid modifying original
            .composite([{ input: templateBuffer, blend: 'difference' }])
            .raw()
            .toBuffer({ resolveWithObject: true });

        // Analyze the match data to find a match.
        let bestMatchX = -1;
        let bestMatchY = -1;
        let minDiff = Infinity;

         // The `matchData` will contain a pixel value for each pixel. A low value indicates high similarity.
         for (let y = 0; y < screenshotHeight - templateHeight + 1; y++) {
            for (let x = 0; x < screenshotWidth - templateWidth + 1; x++) {
                let diff = 0;
                for (let templateY = 0; templateY < templateHeight; templateY++) {
                    for (let templateX = 0; templateX < templateWidth; templateX++) {
                        const pixelIndex = ((y + templateY) * screenshotWidth + (x + templateX)) * 4; // Assuming RGBA
                        const r = matchData[pixelIndex];
                        const g = matchData[pixelIndex + 1];
                        const b = matchData[pixelIndex + 2];

                        // Use the value of red, green, blue channels in the difference image as the basis of calculating similarity
                        diff += r + g + b;
                    }
                }

                if (diff < minDiff) {
                    minDiff = diff;
                    bestMatchX = x;
                    bestMatchY = y;
                }
            }
        }

        if (bestMatchX !== -1) {
            return { x: bestMatchX, y: bestMatchY, diff: minDiff };
        } else {
          console.log("No match found");
          return null;
        }


    } catch (error) {
        console.error('Error finding image:', error);
        return null;
    }
}


imageBasedAutomation();