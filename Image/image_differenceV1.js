const sharp = require('sharp');
const pixelmatch = require('pixelmatch');
const fs = require('fs').promises;

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
    
    // Copy baseline image as background
    baseline.copy(enhanced);
    
    // Add red highlighting for differences
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            
            // Check if this pixel is marked as different in the diff buffer
            const diffR = diff[idx];
            const diffG = diff[idx + 1];
            const diffB = diff[idx + 2];
            
            // If pixel is marked as different (red in diff)
            if (diffR > 200 && diffG < 100 && diffB < 100) {
                // Draw red border around difference areas
                drawRedBorder(enhanced, x, y, width, height);
                
                // Highlight the different pixel itself
                enhanced[idx] = Math.min(255, enhanced[idx] + 100);     // Add red
                enhanced[idx + 1] = Math.max(0, enhanced[idx + 1] - 50); // Reduce green
                enhanced[idx + 2] = Math.max(0, enhanced[idx + 2] - 50); // Reduce blue
                enhanced[idx + 3] = 255; // Full alpha
            }
        }
    }
    
    return enhanced;
}

/**
 * Draws a red border around a pixel position
 * @param {Buffer} buffer - Image buffer to modify
 * @param {number} centerX - X coordinate of center pixel
 * @param {number} centerY - Y coordinate of center pixel
 * @param {number} width - Image width
 * @param {number} height - Image height
 */
function drawRedBorder(buffer, centerX, centerY, width, height) {
    const borderSize = 2;
    
    for (let dy = -borderSize; dy <= borderSize; dy++) {
        for (let dx = -borderSize; dx <= borderSize; dx++) {
            const x = centerX + dx;
            const y = centerY + dy;
            
            // Check bounds
            if (x >= 0 && x < width && y >= 0 && y < height) {
                // Only draw border pixels (not fill)
                if (Math.abs(dx) === borderSize || Math.abs(dy) === borderSize) {
                    const idx = (y * width + x) * 4;
                    buffer[idx] = 255;     // Red
                    buffer[idx + 1] = 0;   // Green
                    buffer[idx + 2] = 0;   // Blue
                    buffer[idx + 3] = 255; // Alpha
                }
            }
        }
    }
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