
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2026-04-13
 * @Last Modified by: Someone
 * @Last Modified time: 2026-04-15 07:18:54
 * @Description: All the controllers (call operations) for the API android
 */


const {
  getSnapshot,
  clickOn,
  HomeKey,
  BackKey
} = require("./android.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Click on Android device 
  // -----------------------------------------------------------
  clickOn: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // clickOn Android device
    console.log('click on controller')
    const result = await clickOn(body);
    if (!result.success) {
      throw new AppError('Snapshot error!', 200);
    }
    console.log("clickOn successfully")
    return res.status(200).json({
      success: 1,
      message: "clickOn successfully"
    });
  }),


  // ---------------------------------------------------------------------------
  // Android snapshot
  // ---------------------------------------------------------------------------
  getSnapshot: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Android snapshot
    const result = await getSnapshot();
    if (!result.success) {
      throw new AppError('Snapshot error!', 200);
    }

    //console.log('screen size', result.data.screenSize)

    return res.json({
      success: 1,
      data: result,
    });
  }),

  // ---------------------------------------------------------------------------
  // Android Home Key
  // ---------------------------------------------------------------------------
  HomeKey: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Android Home key
    const result = await HomeKey();
    if (!result.success) {
      throw new AppError('HomeKey error!', 200);
    }

    console.log("HomeKey success")
    return res.status(200).json({
      success: 1,
      message: "HomeKey success"
    });
  }),

  // ---------------------------------------------------------------------------
  // Android Back Key
  // ---------------------------------------------------------------------------
  BackKey: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Android Back key
console.log ('back Key')

    const result = await BackKey();
    if (!result.success) {
      throw new AppError('BackKey error!', 200);
    }

    console.log("BackKey success")
    return res.status(200).json({
      success: 1,
      message: "BackKey success"
    });
  })


};



