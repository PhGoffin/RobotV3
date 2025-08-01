const { chromium } = require('playwright');
// const sharp = require('sharp');
// const fs = require('fs').promises; // Use the promise-based file system
// const pngjs = require('pngjs').PNG;  // Optional

const sharp = require('sharp');
const fs = require('fs').promises; // Use the promise-based file system
const pixelmatch = require('pixelmatch');


/**
 * Compares two images and finds the best match location with similarity percentage
 * @param {string|Buffer} fullImageSrc - Full screenshot image (file path or Buffer)
 * @param {string|Buffer} fragmentImageSrc - Fragment image to search for (file path or Buffer)
 * @param {number} threshold - Minimum similarity threshold (0-1, default: 0.5)
 * @returns {Promise<{x: number, y: number, similarity: number}>} Position and similarity percentage
 */
async function compareImages(fullImageSrc, fragmentImageSrc, threshold = 0.5) {
    try {
        // Load and process images
        let fullBuffer, fragmentBuffer;

        if (typeof fullImageSrc === 'string') {
            fullBuffer = await fs.readFile(fullImageSrc);
        } else {
            fullBuffer = fullImageSrc;
        }

        if (typeof fragmentImageSrc === 'string') {
            fragmentBuffer = await fs.readFile(fragmentImageSrc);
        } else {
            fragmentBuffer = fragmentImageSrc;
        }

        // Get image metadata and convert to raw RGBA
        const fullImage = sharp(fullBuffer);
        const fragmentImage = sharp(fragmentBuffer);

        const fullMeta = await fullImage.metadata();
        const fragmentMeta = await fragmentImage.metadata();

        const fullWidth = fullMeta.width;
        const fullHeight = fullMeta.height;
        const fragmentWidth = fragmentMeta.width;
        const fragmentHeight = fragmentMeta.height;

        // Convert images to raw RGBA buffers
        const fullRawBuffer = await fullImage
            .ensureAlpha()
            .raw()
            .toBuffer();

        const fragmentRawBuffer = await fragmentImage
            .ensureAlpha()
            .raw()
            .toBuffer();

        let bestMatch = {
            x: 0,
            y: 0,
            similarity: 0
        };

        // Template matching algorithm
        for (let y = 0; y <= fullHeight - fragmentHeight; y++) {
            for (let x = 0; x <= fullWidth - fragmentWidth; x++) {
                const similarity = calculateSimilarity(
                    fullRawBuffer, fullWidth, fullHeight,
                    fragmentRawBuffer, fragmentWidth, fragmentHeight,
                    x, y
                );

                if (similarity > bestMatch.similarity) {
                    bestMatch = {
                        x: x,
                        y: y,
                        similarity: similarity
                    };
                }
            }
        }

        // Convert similarity to percentage
        const similarityPercentage = Math.round(bestMatch.similarity * 10000) / 100;

        // Return result based on threshold
        if (bestMatch.similarity >= threshold) {
            return {
                x: bestMatch.x,
                y: bestMatch.y,
                similarity: similarityPercentage
            };
        } else {
            return {
                x: 0,
                y: 0,
                similarity: similarityPercentage
            };
        }

    } catch (error) {
        console.error('Error comparing images:', error);
        return {
            x: 0,
            y: 0,
            similarity: 0
        };
    }
}

/**
 * Calculate similarity between fragment and a region in the full image
 */
function calculateSimilarity(fullBuffer, fullWidth, fullHeight, fragmentBuffer, fragmentWidth, fragmentHeight, offsetX, offsetY) {
    let totalPixels = 0;
    let matchingPixels = 0;
    const colorTolerance = 30;

    for (let y = 0; y < fragmentHeight; y++) {
        for (let x = 0; x < fragmentWidth; x++) {
            const fragmentIndex = (y * fragmentWidth + x) * 4;
            const fullIndex = ((offsetY + y) * fullWidth + (offsetX + x)) * 4;

            // Skip transparent pixels in fragment
            if (fragmentBuffer[fragmentIndex + 3] === 0) continue;

            totalPixels++;

            // Get RGBA values
            const fullR = fullBuffer[fullIndex];
            const fullG = fullBuffer[fullIndex + 1];
            const fullB = fullBuffer[fullIndex + 2];

            const fragR = fragmentBuffer[fragmentIndex];
            const fragG = fragmentBuffer[fragmentIndex + 1];
            const fragB = fragmentBuffer[fragmentIndex + 2];

            // Calculate color difference
            const diffR = fullR - fragR;
            const diffG = fullG - fragG;
            const diffB = fullB - fragB;
            const colorDiff = Math.sqrt(diffR * diffR + diffG * diffG + diffB * diffB);

            if (colorDiff <= colorTolerance) {
                matchingPixels++;
            }
        }
    }

    return totalPixels === 0 ? 0 : matchingPixels / totalPixels;
}

/**
 * Advanced version with pixelmatch integration for better performance
 */
async function compareImagesAdvanced(fullImageSrc, fragmentImageSrc, options = {}) {
    const config = {
        threshold: 0.5,
        colorTolerance: 0.1,
        skipStep: 1,
        returnMultipleMatches: false,
        maxMatches: 5,
        ...options
    };

    try {
        let fullBuffer, fragmentBuffer;

        if (typeof fullImageSrc === 'string') {
            fullBuffer = await fs.readFile(fullImageSrc);
        } else {
            fullBuffer = fullImageSrc;
        }

        if (typeof fragmentImageSrc === 'string') {
            fragmentBuffer = await fs.readFile(fragmentImageSrc);
        } else {
            fragmentBuffer = fragmentImageSrc;
        }

        const fullImage = sharp(fullBuffer);
        const fragmentImage = sharp(fragmentBuffer);

        const fullMeta = await fullImage.metadata();
        const fragmentMeta = await fragmentImage.metadata();

        const fullWidth = fullMeta.width;
        const fullHeight = fullMeta.height;
        const fragmentWidth = fragmentMeta.width;
        const fragmentHeight = fragmentMeta.height;

        const fullRawBuffer = await fullImage
            .ensureAlpha()
            .raw()
            .toBuffer();

        const fragmentRawBuffer = await fragmentImage
            .ensureAlpha()
            .raw()
            .toBuffer();

        const matches = [];

        for (let y = 0; y <= fullHeight - fragmentHeight; y += config.skipStep) {
            for (let x = 0; x <= fullWidth - fragmentWidth; x += config.skipStep) {
                const similarity = calculateSimilarityPixelmatch(
                    fullRawBuffer, fullWidth, fullHeight,
                    fragmentRawBuffer, fragmentWidth, fragmentHeight,
                    x, y, config.colorTolerance
                );

                if (similarity >= config.threshold) {
                    matches.push({
                        x: x,
                        y: y,
                        similarity: Math.round(similarity * 10000) / 100
                    });
                }
            }
        }

        matches.sort((a, b) => b.similarity - a.similarity);

        if (config.returnMultipleMatches) {
            return {
                matches: matches.slice(0, config.maxMatches),
                bestMatch: matches[0] || { x: 0, y: 0, similarity: 0 }
            };
        }

        const bestMatch = matches[0];
        if (bestMatch) {
            return {
                x: bestMatch.x,
                y: bestMatch.y,
                similarity: bestMatch.similarity
            };
        } else {
            return {
                x: 0,
                y: 0,
                similarity: 0
            };
        }

    } catch (error) {
        console.error('Error comparing images:', error);
        return {
            x: 0,
            y: 0,
            similarity: 0
        };
    }
}

/**
 * Calculate similarity using pixelmatch for better performance
 */
function calculateSimilarityPixelmatch(fullBuffer, fullWidth, fullHeight, fragmentBuffer, fragmentWidth, fragmentHeight, offsetX, offsetY, threshold) {
    // Create buffers for the region comparison
    const regionBuffer = Buffer.alloc(fragmentWidth * fragmentHeight * 4);

    // Extract the region from full image
    for (let y = 0; y < fragmentHeight; y++) {
        for (let x = 0; x < fragmentWidth; x++) {
            const regionIndex = (y * fragmentWidth + x) * 4;
            const fullIndex = ((offsetY + y) * fullWidth + (offsetX + x)) * 4;

            regionBuffer[regionIndex] = fullBuffer[fullIndex];     // R
            regionBuffer[regionIndex + 1] = fullBuffer[fullIndex + 1]; // G
            regionBuffer[regionIndex + 2] = fullBuffer[fullIndex + 2]; // B
            regionBuffer[regionIndex + 3] = fullBuffer[fullIndex + 3]; // A
        }
    }

    // Use pixelmatch to compare
    const diffBuffer = Buffer.alloc(fragmentWidth * fragmentHeight * 4);
    const diffPixels = pixelmatch(
        fragmentBuffer,
        regionBuffer,
        diffBuffer,
        fragmentWidth,
        fragmentHeight,
        { threshold: threshold }
    );

    const totalPixels = fragmentWidth * fragmentHeight;
    const similarity = 1 - (diffPixels / totalPixels);

    return similarity;
}

/**
 * Playwright-specific helper function
 */
async function comparePlaywrightScreenshots(page, fullScreenshotOptions = {}, elementOrSelector, elementScreenshotOptions = {}) {
    try {
        // Take full page screenshot
        const fullScreenshot = await page.screenshot({
            fullPage: true,
            ...fullScreenshotOptions
        });

        // Take element screenshot
        let elementScreenshot;
        if (typeof elementOrSelector === 'string') {
            // It's a selector
            const element = await page.locator(elementOrSelector);
            elementScreenshot = await element.screenshot(elementScreenshotOptions);
        } else {
            // It's already an element/locator
            elementScreenshot = await elementOrSelector.screenshot(elementScreenshotOptions);
        }

        // Compare the screenshots
        const result = await compareImages(fullScreenshot, elementScreenshot);

        return result;

    } catch (error) {
        console.error('Error in Playwright screenshot comparison:', error);
        return {
            x: 0,
            y: 0,
            similarity: 0
        };
    }
}




// Example usage:
/*

// const { compareImages, comparePlaywrightScreenshots } = require('./image-compare');

// Basic file comparison
const result = await compareImages('screenshot.png', 'fragment.png');
console.log(`Found at (${result.x}, ${result.y}) with ${result.similarity}% similarity`);

// Playwright integration
const playwrightResult = await comparePlaywrightScreenshots(
    page, 
    { fullPage: true }, 
    '#my-element',
    { }
);
console.log('Element found at:', playwrightResult);

// Advanced comparison with options
const advancedResult = await compareImagesAdvanced('screenshot.png', 'fragment.png', {
    threshold: 0.7,
    skipStep: 2,
    returnMultipleMatches: true
});
**/

async function test1() {
    const result = await compareImages('./Image/screenshot.png', './Image/fragment.png')
    console.log(`Found at (${result.x}, ${result.y}) with ${result.similarity}% similarity`);
}



//const result = compareImages('screenshot.png', 'fragment.png');
//const result = await compareImages('screenshot.png', 'fragment.png');
test1()
