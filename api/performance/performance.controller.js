
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2023-12-09 07:48:15 
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-14 16:38:12
 * @Description: All the controllers (call operations) for the API performance
 */


const {
  createPerformance,
  getPerformanceByProject,
  getPerformance,
  getPerformanceByCode,
  getPerformanceBySequence,
  getPerformanceByScenario,
  getPerformanceByStory,
  getPerformanceByStep,
  getMaxPerformance,
  getAveragePerformance,
  updatePerformance,
  updatePerformanceById,
  deletePerformance,
  deleteAllPerformance,
  exportPerformance
} = require("./performance.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new performance 
  // -----------------------------------------------------------
  createPerformance: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to insert a performance
    const result = await createPerformance(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Performance created successfully"
    });
  }),




  // ---------------------------------------------------------------------------
  // get a performance by ID
  // ---------------------------------------------------------------------------
  getPerformance: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to get a performance
    const id = req.params.id;
    //console.log ('Id: ' + id)
    const result = await getPerformance(id);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // get a performance by Project
  // ---------------------------------------------------------------------------
  getPerformanceByProject: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to get a performance
    const id = req.params.id;
    //console.log ('Id: ' + id)
    const result = await getPerformanceByProject(id);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // get performance info by the code (environment + topic)
  // ---------------------------------------------------------------------------
  getPerformanceByCode: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to get a set of performance for a environment/topic

    if (!body.environment == undefined || body.topic == undefined) {
      throw new AppError('No input data for getPerformanceByCode!', 200);
    }

    const result = await getPerformanceByCode(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),


  // ---------------------------------------------------------------------------
  // get performance info by the sequence (environment + topic)
  // ---------------------------------------------------------------------------
  getPerformanceBySequence: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to get a set of performance for a sequence environment/topic

    if (!body.environment == undefined || body.topic == undefined) {
      throw new AppError('No input data for getPerformanceByCode!', 200);
    }

    const result = await getPerformanceBySequence(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),

  // ---------------------------------------------------------------------------
  // get all performances info for a story
  // ---------------------------------------------------------------------------
  getPerformanceByStory: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to get all performances of a scenario
    const body = req.body;
    const result = await getPerformanceByStory(body);
    return res.json({
      success: 1,
      data: result
    });
  }),

  // ---------------------------------------------------------------------------
  // get all performances info for a step
  // ---------------------------------------------------------------------------
  getPerformanceByStep: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to get all performances of a scenario
    const body = req.body;
    const result = await getPerformanceByStep(body);
    return res.json({
      success: 1,
      data: result
    });
  }),

  // ---------------------------------------------------------------------------
  // get all performances info for a scenario
  // ---------------------------------------------------------------------------
  getPerformanceByScenario: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to get all performances of a scenario
    const body = req.body;
    const result = await getPerformanceByScenario(body);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // get max performance info by the code (environment + topic)
  // ---------------------------------------------------------------------------
  getMaxPerformance: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to get the max performance for un environment/topic

    if (!body.environment == undefined || body.topic == undefined) {
      throw new AppError('No input data for getMaxPerfomance!', 200);
    }

    const result = await getMaxPerformance(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),

  // ---------------------------------------------------------------------------
  // get avearge performance info by the code (environment + topic)
  // ---------------------------------------------------------------------------
  getAveragePerformance: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to get the average performance for un environment/topic on the first 10 records

    if (!body.environment == undefined || body.topic == undefined) {
      throw new AppError('No input data for getMaxPerfomance!', 200);
    }

    const result = await getAveragePerformance(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),




  // ---------------------------------------------------------------------------
  // update a performance
  // ---------------------------------------------------------------------------
  updatePerformance: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to update a performance
    const result = await updatePerformance(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "performance updated successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // update a performance by Id
  // ---------------------------------------------------------------------------
  updatePerformanceById: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to update a performance
    const result = await updatePerformanceById(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "performance updated successfully",
    });
  }),


  // ---------------------------------------------------------------------------
  // Delete a performance
  // ---------------------------------------------------------------------------
  deletePerformance: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to delete a performance
    const result = await deletePerformance(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Performance deleted successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // Delete all the performance of the user
  // ---------------------------------------------------------------------------
  deleteAllPerformance: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to delete a performance
    const result = await deleteAllPerformance(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Full performance deleted successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // Export performances
  // ---------------------------------------------------------------------------
  exportPerformance: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to delete a performance
    const result = await exportPerformance(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to export record!', 200);
    }
    return res.json({
      success: 1,
      message: "Performance exported successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // Download an export json file
  // ---------------------------------------------------------------------------
  downloadFile: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const path = require('path')
    let fileName = req.params.id;
    console.log('fileName: ', fileName)
    fileName = './data/' + fileName.replace(/@/g, '/')
    console.log('fileName: ', fileName)

    res.download(
      fileName,
      (err) => {
        if (err) {
          res.send({
            error: err,
            msg: "Problem downloading the file"
          })
        }
      });
  }),

};



