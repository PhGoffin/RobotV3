
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-21
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-14 15:38:03
 * @Description: All the controllers (call operations) for the API Suite
 */


const {
  createSuite,
  getSuite,
  getSuiteBySubProject,
  getSuiteByHeader,
  updateSuite,
  updateSuitePosition, 
  reorderSuite,
  copySuite,
  copyAllSuite, 
  deleteSuite,
  deleteAllSuite
} = require("./suite.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new Suite 
  // -----------------------------------------------------------
  createSuite: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to insert a Suite
    const result = await createSuite(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Suite created successfully"
    });
  }),

  // ---------------------------------------------------------------------------
  // get a Suite by ID
  // ---------------------------------------------------------------------------
  getSuite: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get a Suite
    const id = req.params.id;
    //console.log ('Id: ' + id)
    const result = await getSuite(id);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // get all Suites info for a subproject
  // ---------------------------------------------------------------------------
  getSuiteBySubProject: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get all Suites per subprojects
    const body = req.body;
    //console.log ('Body: ', body)
    const result = await getSuiteBySubProject(body);
    return res.json({
      success: 1,
      data: result
    });
  }),

  // ---------------------------------------------------------------------------
  // get all Suites info for a Suiteheader
  // ---------------------------------------------------------------------------
  getSuiteByHeader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get all Suites per suiteheader
    const body = req.body;
    //console.log ('Body: ', body)
    const result = await getSuiteByHeader(body);
    return res.json({
      success: 1,
      data: result
    });
  }),




  // ---------------------------------------------------------------------------
  // update a Suite
  // ---------------------------------------------------------------------------
  updateSuite: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to update a Suite
    const result = await updateSuite(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "Suite updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Update a Suite position
  // -----------------------------------------------------------
  updateSuitePosition: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to update the position of a Suite
    const result = await updateSuitePosition(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! updating the record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Suite position updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Reorder the Suite table
  // -----------------------------------------------------------
  reorderSuite: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to reorder the Suite table
    const body = req.body;
    const result = await reorderSuite(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! reordering record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Suite reordered successfully",
    });
  }),

  // -----------------------------------------------------------
  // Copy a Suite 
  // -----------------------------------------------------------
  copySuite: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to copy a Suite
    const result = await copySuite(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! copying a Suite record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Suite copied successfully",
    });
  }),

  // -----------------------------------------------------------
  // Copy All Suite from a Suiteheader
  // -----------------------------------------------------------
  copyAllSuite: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to copy all Suite from a Suiteheader
    const result = await copyAllSuite(body);
    // if (!result.affectedRows) {
    //   throw new AppError('Failed! copying a Full Suite', 200);
    //}
    return res.status(200).json({
      success: 1,
      message: "Full Suite copied successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // Delete a Suite
  // ---------------------------------------------------------------------------
  deleteSuite: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete a Suite
    const result = await deleteSuite(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Suite deleted successfully",
    });
  }) , 

  // ---------------------------------------------------------------------------
  // Delete all Suite from a Suiteheader
  // ---------------------------------------------------------------------------
  deleteAllSuite: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete a Suite
    const result = await deleteAllSuite(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete Full Suite!', 200);
    }
    return res.json({
      success: 1,
      message: "Full Suite deleted successfully",
    });
  })

};



