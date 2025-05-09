
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-21
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-09 08:38:22
 * @Description: All the controllers (call operations) for the API SuiteHeader
 */


const {
  createSuiteHeader,
  getSuiteHeader,
  getSuiteHeaderBylabel,
  getSuiteHeaderBySubProject,
  updateSuiteHeader,
  updateSuiteHeaderPosition,
  copySuiteHeader,  
  reorderSuiteHeader, 
  deleteSuiteHeader
} = require("./suiteheader.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new SuiteHeader 
  // -----------------------------------------------------------
  createSuiteHeader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to insert a SuiteHeader
    const result = await createSuiteHeader(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Suite set created successfully"
    });
  }),

  // ---------------------------------------------------------------------------
  // get a SuiteHeader by ID
  // ---------------------------------------------------------------------------
  getSuiteHeader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get a SuiteHeader
    const id = req.params.id;
    //console.log ('Id: ' + id)
    const result = await getSuiteHeader(id);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // get SuiteHeader info by the label
  // ---------------------------------------------------------------------------
  getSuiteHeaderBylabel: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to get a specific label for a SuiteHeader
    const result = await getSuiteHeaderBylabel(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),


  // ---------------------------------------------------------------------------
  // get all SuiteHeaders info for a subproject
  // ---------------------------------------------------------------------------
  getSuiteHeaderBySubProject: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get all SuiteHeaders per subprojects
    const body = req.body;
    const result = await getSuiteHeaderBySubProject(body);
    //console.log ('Result: ', result)
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // update a SuiteHeader
  // ---------------------------------------------------------------------------
  updateSuiteHeader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to update a SuiteHeader
    const result = await updateSuiteHeader(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "Suite set updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Update a SuiteHeader position
  // -----------------------------------------------------------
  updateSuiteHeaderPosition: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to update the position of a SuiteHeader
    const result = await updateSuiteHeaderPosition(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! updating the record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Suite set position updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Reorder the SuiteHeader table
  // -----------------------------------------------------------
  reorderSuiteHeader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to reorder the SuiteHeader table
    const body = req.body;
    const result = await reorderSuiteHeader(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! reordering record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Suite set reordered successfully",
    });
  }),

  // -----------------------------------------------------------
  // Copy a SuiteHeader 
  // -----------------------------------------------------------
  copySuiteHeader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to copy a SuiteHeader
    const result = await copySuiteHeader(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! copying a Suite set record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Suite set copied successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // Delete a SuiteHeader
  // ---------------------------------------------------------------------------
  deleteSuiteHeader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete a SuiteHeader
    const result = await deleteSuiteHeader(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Suite set deleted successfully",
    });
  })

};



