const sharp = require('sharp');
const fs = require('fs').promises;

// Handle different import methods for pixelmatch
let pixelmatch;
try {
    // Try CommonJS require
    pixelmatch = require('pixelmatch');
    // If pixelmatch is an object with default export
    if (pixelmatch && pixelmatch.default && typeof pixelmatch.default === 'function') {
        pixelmatch = pixelmatch.default;
    }
    // If pixelmatch is not a function, try accessing it differently
    if (typeof pixelmatch !== 'function') {
        const pixelmatchModule = require('pixelmatch');
        pixelmatch = pixelmatchModule.default || pixelmatchModule;
    }
} catch (error) {
    console.error('Failed to import pixelmatch:', error.message);
    throw new Error('pixelmatch library is required. Install it with: npm install pixelmatch');
}

/**
 * Compares two images and returns similarity percentage and creates a diff image
 * @param {string|Buffer} baselineImagePath - Path to baseline image or Buffer
 * @param {string|Buffer} compareImagePath - Path to comparison image or Buffer
 * @param {string} outputPath - Path where the diff image will be saved
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Matching threshold (0 to 1). Smaller values make comparison more sensitive
 * @param {boolean} options.includeAA - Whether to include anti-aliasing in comparison
 * @param {number} options.alpha - Blending factor of original image in diff (0 to 1)
 * @returns {Promise<Object>} Object containing similarity percentage and diff stats
 */
async function compareImages(baselineImagePath, compareImagePath, outputPath, options = {}) {
    const {
        threshold = 0.1,
        includeAA = false,
        alpha = 0.1
    } = options;

    try {
        // Load and process baseline image
        let baselineBuffer;
        if (Buffer.isBuffer(baselineImagePath)) {
            baselineBuffer = baselineImagePath;
        } else {
            baselineBuffer = await fs.readFile(baselineImagePath);
        }

        // Load and process comparison image
        let compareBuffer;
        if (Buffer.isBuffer(compareImagePath)) {
            compareBuffer = compareImagePath;
        } else {
            compareBuffer = await fs.readFile(compareImagePath);
        }

        // Get metadata from both images
        const baselineMetadata = await sharp(baselineBuffer).metadata();
        const compareMetadata = await sharp(compareBuffer).metadata();

        // Determine the dimensions to use (use the larger dimensions)
        const width = Math.max(baselineMetadata.width, compareMetadata.width);
        const height = Math.max(baselineMetadata.height, compareMetadata.height);

        console.log(`Processing images at ${width}x${height} pixels`);

        // Resize both images to the same dimensions and convert to RGBA
        const baselineRGBA = await sharp(baselineBuffer)
            .resize(width, height, { 
                fit: 'contain', 
                background: { r: 255, g: 255, b: 255, alpha: 1 } 
            })
            .ensureAlpha()
            .raw()
            .toBuffer();

        const compareRGBA = await sharp(compareBuffer)
            .resize(width, height, { 
                fit: 'contain', 
                background: { r: 255, g: 255, b: 255, alpha: 1 } 
            })
            .ensureAlpha()
            .raw()
            .toBuffer();

        // Create buffer for diff image
        const diffBuffer = Buffer.alloc(width * height * 4);

        // Perform pixel comparison
        const numDiffPixels = pixelmatch(
            baselineRGBA, 
            compareRGBA, 
            diffBuffer, 
            width, 
            height, 
            {
                threshold,
                includeAA,
                alpha,
                diffColor: [255, 0, 0],          // Red for differences
                diffColorAlt: [255, 100, 100],   // Light red for anti-aliasing differences
                aaColor: [255, 255, 0],          // Yellow for anti-aliasing
                diffMask: false                   // Don't create a mask, blend with original
            }
        );

        // Calculate similarity percentage
        const totalPixels = width * height;
        const similarityPercentage = ((totalPixels - numDiffPixels) / totalPixels) * 100;

        // Create enhanced diff image with better visibility
        const enhancedDiffBuffer = await enhanceDiffImage(
            baselineRGBA, 
            compareRGBA, 
            diffBuffer, 
            width, 
            height
        );

        // Save the diff image
        await sharp(enhancedDiffBuffer, {
            raw: {
                width,
                height,
                channels: 4
            }
        })
        .png()
        .toFile(outputPath);

        // Return results
        return {
            similarityPercentage: parseFloat(similarityPercentage.toFixed(2)),
            differencePercentage: parseFloat((100 - similarityPercentage).toFixed(2)),
            totalPixels,
            differentPixels: numDiffPixels,
            dimensions: { width, height },
            outputPath
        };

    } catch (error) {
        throw new Error(`Image comparison failed: ${error.message}`);
    }
}

/**
 * Enhances the diff image by adding red borders around difference areas
 * @param {Buffer} baseline - Baseline image buffer
 * @param {Buffer} compare - Comparison image buffer  
 * @param {Buffer} diff - Diff image buffer from pixelmatch
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {Promise<Buffer>} Enhanced diff image buffer
 */
async function enhanceDiffImage(baseline, compare, diff, width, height) {
    const enhanced = Buffer.alloc(width * height * 4);
    
    // Copy comparison image as background (so we can see additions in green)
    compare.copy(enhanced);
    
    // First pass: identify all different pixels from pixelmatch
    const differentPixels = new Set();
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            
            // Check if this pixel is marked as different in the diff buffer
            const diffR = diff[idx];
            const diffG = diff[idx + 1];
            const diffB = diff[idx + 2];
            const diffA = diff[idx + 3];
            
            // More flexible detection of diff pixels
            if ((diffR > 100 && diffG < diffR && diffB < diffR) || 
                (diffA > 0 && (diffR > 0 || diffG > 0 || diffB > 0))) {
                differentPixels.add(`${x},${y}`);
            }
        }
    }
    
    console.log(`Found ${differentPixels.size} different pixel locations for enhancement`);
    
    // Second pass: analyze what type of difference each pixel represents
    const removedPixels = new Set(); // Pixels that exist in baseline but not in compare
    const addedPixels = new Set();   // Pixels that exist in compare but not in baseline
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const key = `${x},${y}`;
            
            if (differentPixels.has(key)) {
                // Compare pixel values to determine if it's an addition or removal
                const baseR = baseline[idx];
                const baseG = baseline[idx + 1];
                const baseB = baseline[idx + 2];
                const baseA = baseline[idx + 3];
                
                const compR = compare[idx];
                const compG = compare[idx + 1];
                const compB = compare[idx + 2];
                const compA = compare[idx + 3];
                
                // Calculate luminance to determine if pixel got brighter/darker
                const baseLum = 0.299 * baseR + 0.587 * baseG + 0.114 * baseB;
                const compLum = 0.299 * compR + 0.587 * compG + 0.114 * compB;
                
                // Also check for significant color changes
                const colorDiff = Math.abs(baseR - compR) + Math.abs(baseG - compG) + Math.abs(baseB - compB);
                
                if (colorDiff > 30) { // Significant color change
                    if ((baseLum < 200 && compLum > baseLum + 20) || // Got significantly brighter
                        (baseA < 200 && compA > baseA + 20) ||        // Got more opaque
                        (baseLum < 100 && compLum > 150)) {           // Dark became light
                        addedPixels.add(key);  // Something was added
                    } else if ((compLum < 200 && baseLum > compLum + 20) || // Got significantly darker
                               (compA < 200 && baseA > compA + 20) ||        // Got more transparent
                               (compLum < 100 && baseLum > 150)) {           // Light became dark
                        removedPixels.add(key); // Something was removed
                    } else {
                        // If unclear, check which image has more "content" at this pixel
                        if (compLum > baseLum || compA > baseA) {
                            addedPixels.add(key);
                        } else {
                            removedPixels.add(key);
                        }
                    }
                } else {
                    // Small changes - classify based on brightness
                    if (compLum > baseLum) {
                        addedPixels.add(key);
                    } else {
                        removedPixels.add(key);
                    }
                }
            }
        }
    }
    
    console.log(`Classified ${removedPixels.size} removed pixels and ${addedPixels.size} added pixels`);
    
    // Third pass: highlight removed pixels with red overlay
    for (const key of removedPixels) {
        const [x, y] = key.split(',').map(Number);
        const idx = (y * width + x) * 4;
        
        // Red overlay for removed content
        enhanced[idx] = Math.min(255, Math.max(enhanced[idx], 200));     // Strong red
        enhanced[idx + 1] = Math.max(0, enhanced[idx + 1] * 0.4);        // Reduce green
        enhanced[idx + 2] = Math.max(0, enhanced[idx + 2] * 0.4);        // Reduce blue
        enhanced[idx + 3] = 255; // Full alpha
        
        // Draw red borders around removed areas
        drawColoredBorder(enhanced, x, y, width, height, 3, [255, 0, 0]); // Red border
    }
    
    // Fourth pass: highlight added pixels with green overlay
    for (const key of addedPixels) {
        const [x, y] = key.split(',').map(Number);
        const idx = (y * width + x) * 4;
        
        // Green overlay for added content
        enhanced[idx] = Math.max(0, enhanced[idx] * 0.4);        // Reduce red
        enhanced[idx + 1] = Math.min(255, Math.max(enhanced[idx + 1], 200)); // Strong green
        enhanced[idx + 2] = Math.max(0, enhanced[idx + 2] * 0.4);        // Reduce blue
        enhanced[idx + 3] = 255; // Full alpha
        
        // Draw green borders around added areas
        drawColoredBorder(enhanced, x, y, width, height, 3, [0, 255, 0]); // Green border
    }
    
    // Fifth pass: Find and outline difference regions
    const removedRegions = findDifferenceRegions(removedPixels, width, height);
    const addedRegions = findDifferenceRegions(addedPixels, width, height);
    
    console.log(`Found ${removedRegions.length} removed regions and ${addedRegions.length} added regions`);
    
    // Draw thick borders around each region
    removedRegions.forEach((region) => {
        drawRegionBorder(enhanced, region, width, height, 4, [255, 0, 0]); // Red border
    });
    
    addedRegions.forEach((region) => {
        drawRegionBorder(enhanced, region, width, height, 4, [0, 255, 0]); // Green border
    });
    
    return enhanced;
}

/**
 * Find connected regions of different pixels
 * @param {Set} differentPixels - Set of different pixel coordinates as "x,y" strings
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {Array} Array of regions, each containing pixel coordinates
 */
function findDifferenceRegions(differentPixels, width, height) {
    const visited = new Set();
    const regions = [];
    
    for (const pixelKey of differentPixels) {
        if (!visited.has(pixelKey)) {
            const region = [];
            const stack = [pixelKey];
            
            while (stack.length > 0) {
                const current = stack.pop();
                if (visited.has(current)) continue;
                
                visited.add(current);
                region.push(current);
                
                const [x, y] = current.split(',').map(Number);
                
                // Check 8-connected neighbors
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (dx === 0 && dy === 0) continue;
                        
                        const nx = x + dx;
                        const ny = y + dy;
                        const neighborKey = `${nx},${ny}`;
                        
                        if (nx >= 0 && nx < width && ny >= 0 && ny < height &&
                            differentPixels.has(neighborKey) && !visited.has(neighborKey)) {
                            stack.push(neighborKey);
                        }
                    }
                }
            }
            
            if (region.length > 0) {
                regions.push(region);
            }
        }
    }
    
    return regions;
}

/**
 * Draw a border around a region of pixels
 * @param {Buffer} buffer - Image buffer to modify
 * @param {Array} region - Array of pixel coordinates as "x,y" strings
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {number} borderSize - Size of the border
 * @param {Array} color - RGB color array [r, g, b] (default red)
 */
function drawRegionBorder(buffer, region, width, height, borderSize = 3, color = [255, 0, 0]) {
    // Find bounding box of the region
    let minX = width, maxX = 0, minY = height, maxY = 0;
    
    region.forEach(pixelKey => {
        const [x, y] = pixelKey.split(',').map(Number);
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
    });
    
    // Expand bounding box by border size
    minX = Math.max(0, minX - borderSize);
    maxX = Math.min(width - 1, maxX + borderSize);
    minY = Math.max(0, minY - borderSize);
    maxY = Math.min(height - 1, maxY + borderSize);
    
    // Draw border rectangle
    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            // Only draw border pixels (not fill)
            if (x === minX || x === maxX || y === minY || y === maxY ||
                (x <= minX + borderSize) || (x >= maxX - borderSize) ||
                (y <= minY + borderSize) || (y >= maxY - borderSize)) {
                
                const idx = (y * width + x) * 4;
                buffer[idx] = color[0];     // Red/Green
                buffer[idx + 1] = color[1]; // Green/Red
                buffer[idx + 2] = color[2]; // Blue
                buffer[idx + 3] = 255;      // Alpha
            }
        }
    }
}

/**
 * Draws a colored border around a pixel position
 * @param {Buffer} buffer - Image buffer to modify
 * @param {number} centerX - X coordinate of center pixel
 * @param {number} centerY - Y coordinate of center pixel
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {number} borderSize - Size of the border (default 2)
 * @param {Array} color - RGB color array [r, g, b] (default red)
 */
function drawColoredBorder(buffer, centerX, centerY, width, height, borderSize = 2, color = [255, 0, 0]) {
    for (let dy = -borderSize; dy <= borderSize; dy++) {
        for (let dx = -borderSize; dx <= borderSize; dx++) {
            const x = centerX + dx;
            const y = centerY + dy;
            
            // Check bounds
            if (x >= 0 && x < width && y >= 0 && y < height) {
                // Only draw border pixels (not fill)
                if (Math.abs(dx) === borderSize || Math.abs(dy) === borderSize) {
                    const idx = (y * width + x) * 4;
                    buffer[idx] = color[0];     // Red
                    buffer[idx + 1] = color[1]; // Green
                    buffer[idx + 2] = color[2]; // Blue
                    buffer[idx + 3] = 255;      // Alpha
                }
            }
        }
    }
}

/**
 * Draws a red border around a pixel position (backward compatibility)
 * @param {Buffer} buffer - Image buffer to modify
 * @param {number} centerX - X coordinate of center pixel
 * @param {number} centerY - Y coordinate of center pixel
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {number} borderSize - Size of the border (default 2)
 */
function drawRedBorder(buffer, centerX, centerY, width, height, borderSize = 2) {
    drawColoredBorder(buffer, centerX, centerY, width, height, borderSize, [255, 0, 0]);
}

/**
 * Utility function to compare images with default settings
 * @param {string} baselinePath - Path to baseline image
 * @param {string} comparePath - Path to comparison image
 * @param {string} outputPath - Path for diff image output
 * @returns {Promise<Object>} Comparison results
 */
async function quickCompare(baselinePath, comparePath, outputPath) {
    return await compareImages(baselinePath, comparePath, outputPath, {
        threshold: 0.1,
        includeAA: false,
        alpha: 0.2
    });
}

// Example usage
async function example() {
    try {
        const result = await compareImages(
            './Image/baseline.png',           // Path to baseline image
            './Image/comparison.png',         // Path to comparison image  
            './Image/diff_output.png',        // Output path for diff image
            {
                threshold: 0.1,       // Sensitivity (lower = more sensitive)
                includeAA: false,     // Include anti-aliasing in comparison
                alpha: 0.2            // Blend factor for diff overlay
            }
        );
        
        console.log('Comparison Results:');
        console.log(`Similarity: ${result.similarityPercentage}%`);
        console.log(`Difference: ${result.differencePercentage}%`);
        console.log(`Different pixels: ${result.differentPixels} out of ${result.totalPixels}`);
        console.log(`Image dimensions: ${result.dimensions.width}x${result.dimensions.height}`);
        console.log(`Diff image saved to: ${result.outputPath}`);
        
    } catch (error) {
        console.error('Error comparing images:', error.message);
    }
}

module.exports = {
    compareImages,
    quickCompare,
    enhanceDiffImage
};

// Uncomment to run example
example();