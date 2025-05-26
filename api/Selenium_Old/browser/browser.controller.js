
const AppError = require("../../../utils/appError");
const catchAsync = require("../../../utils/catchAsync");

const {
    getBrowser,
    startBrowser,
    stopBrowser
} = require("./browser.service");

module.exports = {



    // -----------------------------------------------------------
    // Get a browser
    // -----------------------------------------------------------
    getBrowser: catchAsync(async (req, res, next) => {
        res.set('Access-Control-Allow-Origin', '*');
        // Call the database services to get browser information
        const result = await getBrowser(browser);
        //console.log (result)
        if (!result.success) {
            throw new AppError('Failed! get browser', 200);
        }
        return res.status(200).json({
            success: 1,
            driver: result.driver,
            message: result.message
        });
    }),


    // -----------------------------------------------------------
    // Start a browser
    // -----------------------------------------------------------
    startBrowser: catchAsync(async (req, res, next) => {
        res.set('Access-Control-Allow-Origin', '*');
        // Call the database services to start the browser
        const id = req.params.id;
        const result = await startBrowser(id);
        if (!result.success) {
            throw new AppError('Failed! start browser', 200);
        }
        //result.driver.get("https://webgate.acceptance.ec.testa.eu/mwp/home ?1fa")
        return res.status(200).json({
            success: 1,
            driver: result.driver,
            message: result.message
        });
    }),

    // -----------------------------------------------------------
    // Stop the browser
    // -----------------------------------------------------------
    stopBrowser: catchAsync(async (req, res, next) => {
        res.set('Access-Control-Allow-Origin', '*');
        // Call the database services to stop the browser
        const result = await stopBrowser(browser);
        if (!result.success) {
            throw new AppError('Failed! stop browser', 200);
        }
        return res.status(200).json({
            success: 1,
            driver: result.driver,
            message: result.message
        });
    }),

};
