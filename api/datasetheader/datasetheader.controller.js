
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-05
 * @Last Modified by: 
 * @Last Modified time: 2024-05-28 11:07:13
 * @Description: All the controllers (call operations) for the API Datasetheader
 */


const {
  createDatasetheader,
  getDatasetheader,
  getDatasetheaderByCode,
  getDatasetheaderBySubProject,
  updateDatasetheader,
  updateDatasetheaderPosition,
  copyDatasetheader,  
  importDatasetheader,
  reorderDatasetheader, 
  deleteDatasetheader
} = require("./datasetheader.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new Datasetheader 
  // -----------------------------------------------------------
  createDatasetheader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to insert a Datasetheader
    const result = await createDatasetheader(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Datasetheader created successfully"
    });
  }),

  // ---------------------------------------------------------------------------
  // get a Datasetheader by ID
  // ---------------------------------------------------------------------------
  getDatasetheader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get a Datasetheader
    const id = req.params.id;
    //console.log ('Id: ' + id)
    const result = await getDatasetheader(id);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // get Datasetheader info by the code
  // ---------------------------------------------------------------------------
  getDatasetheaderByCode: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to get a specific code for a Datasetheader
    const result = await getDatasetheaderByCode(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),


  // ---------------------------------------------------------------------------
  // get all Datasetheaders info for a subproject
  // ---------------------------------------------------------------------------
  getDatasetheaderBySubProject: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get all Datasetheaders per subprojects
    const body = req.body;
    const result = await getDatasetheaderBySubProject(body);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // update a Datasetheader
  // ---------------------------------------------------------------------------
  updateDatasetheader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to update a Datasetheader
    const result = await updateDatasetheader(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "Datasetheader updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Update a Datasetheader position
  // -----------------------------------------------------------
  updateDatasetheaderPosition: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to update the position of a Datasetheader
    const result = await updateDatasetheaderPosition(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! updating the record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Datasetheader position updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Reorder the Datasetheader table
  // -----------------------------------------------------------
  reorderDatasetheader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to reorder the Datasetheader table
    const body = req.body;
    const result = await reorderDatasetheader(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! reordering record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Datasetheader reordered successfully",
    });
  }),

  // -----------------------------------------------------------
  // Copy a Datasetheader 
  // -----------------------------------------------------------
  copyDatasetheader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to copy a Datasetheader
    const result = await copyDatasetheader(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! copying a Datasetheader record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Datasetheader copied successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // import a datasetheader
  // ---------------------------------------------------------------------------
  importDatasetheader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to import a datasetheader
    const result = await importDatasetheader(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! importing a datasetheader', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Datasetheader imported successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // Delete a Datasetheader
  // ---------------------------------------------------------------------------
  deleteDatasetheader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete a Datasetheader
    const result = await deleteDatasetheader(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Datasetheader deleted successfully",
    });
  })

};



