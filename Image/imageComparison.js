const { chromium } = require('playwright');
const sharp = require('sharp');
const fs = require('fs').promises; // Use the promise-based file system

async function imageBasedAutomation() {
    // const browser = await chromium.launch();
    // const page = await browser.newPage();

    try {
        // const appTitle = 'My Rich Application'; // Your application's window title

        // 1. Take a screenshot of the entire screen
        // await page.goto('about:blank'); // Start with a blank page in the browser.
        const screenshotPath = 'screenshot.png';
        // await page.screenshot({ path: screenshotPath, fullPage: true });

        // 2. Load the template button image
        const buttonTemplatePath = 'button_template.png';

        // 3. Find the button in the screenshot and get the match percentage
        // const { coordinates, matchPercentage } = await findImageInImage(screenshotPath, buttonTemplatePath);

        // if (coordinates) {
        //     console.log(`Button found at: X=${coordinates.x}, Y=${coordinates.y}, Match Percentage: ${matchPercentage.toFixed(2)}%`);


        //     // 4. Simulate a click (using Playwright's mouse)
        //     // await page.mouse.click(coordinates.x, coordinates.y); // Adapt to your application's needs


        //     // 5.  Verification (Adapt to your app)
        //     // await page.goto('file:///path/to/your/log.txt'); // Example verification
        //     // await page.locator('text=Button Clicked Confirmation').waitFor({ timeout: 5000 });
        //     // console.log('Button click verification successful');


        // } else {
        //     console.log('Button not found in the screenshot.');
        // }



    const result = await findImageInImage(screenshotPath, buttonTemplatePath);

    if (result) {
        console.log(`Image found at: x=${result.coordinates.x}, y=${result.coordinates.y}`);
        console.log(`Match percentage: ${result.matchPercentage.toFixed(2)}%`); // Show to 2 decimal places
    } else {
        console.log('Image not found.');
    }        


    } catch (error) {
        console.error('Image Automation Error:', error);
    // } finally {
    //     await browser.close();
    }
}

/**
 * Finds an image within another image and calculates the match percentage.
 *
 * @param {string} screenshotPath Path to the larger image.
 * @param {string} templatePath Path to the smaller image (the one to find).
 * @returns {Promise<{coordinates: {x: number, y: number}, matchPercentage: number} | null>}
 *   An object containing the coordinates of the top-left corner of the match and the match percentage,
 *   or null if no match is found.
 */
async function findImageInImage(screenshotPath, templatePath) {
    try {
        const screenshotBuffer = await fs.readFile(screenshotPath);
        const templateBuffer = await fs.readFile(templatePath);

        const screenshot = sharp(screenshotBuffer);
        const template = sharp(templateBuffer);

        const screenshotMetadata = await screenshot.metadata();
        const screenshotWidth = screenshotMetadata.width;
        const screenshotHeight = screenshotMetadata.height;

        const templateMetadata = await template.metadata();
        const templateWidth = templateMetadata.width;
        const templateHeight = templateMetadata.height;

        // Use a more reliable method for image comparison - correlation
        const { data: matchData, info: matchInfo } = await screenshot
            .clone()
            .convolve({
                width: 3, // kernel width
                height: 3, // kernel height
                kernel: [
                    -1, -1, -1,
                    -1, 8, -1,
                    -1, -1, -1
                ],
                scale: 1,
                offset: 0
            })
            .raw()
            .toBuffer({ resolveWithObject: true });


        let bestMatchX = -1;
        let bestMatchY = -1;
        let minDiff = Infinity;


        for (let y = 0; y < screenshotHeight - templateHeight + 1; y++) {
            for (let x = 0; x < screenshotWidth - templateWidth + 1; x++) {
                let diff = 0;
                for (let templateY = 0; templateY < templateHeight; templateY++) {
                    for (let templateX = 0; templateX < templateWidth; templateX++) {
                        const pixelIndex = ((y + templateY) * screenshotWidth + (x + templateX)) * 4; // Assuming RGBA
                        const r = matchData[pixelIndex];
                        const g = matchData[pixelIndex + 1];
                        const b = matchData[pixelIndex + 2];
                        diff += Math.abs(r) + Math.abs(g) + Math.abs(b);
                    }
                }
                if (diff < minDiff) {
                    minDiff = diff;
                    bestMatchX = x;
                    bestMatchY = y;
                }
            }
        }

        // Normalize the diff based on the size and intensity range.
        const maxPossibleDiff = templateWidth * templateHeight * 3 * 255; // Assuming 8-bit color depth (0-255)
        let similarity = 1 - (minDiff / maxPossibleDiff);
        const matchPercentage = Math.max(0, Math.min(100, similarity * 100)); // Clamp between 0 and 100


        if (bestMatchX !== -1 && matchPercentage > 70) { // Add a threshold to avoid false positives, e.g., matchPercentage > 70%
            return { coordinates: { x: bestMatchX, y: bestMatchY }, matchPercentage: matchPercentage };
        } else {
            console.log(`No match found or match percentage too low. Percentage: ${matchPercentage.toFixed(2)}%`);
            return null;
        }


    } catch (error) {
        console.error('Error finding image:', error);
        return null;
    }
}

imageBasedAutomation();