
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2023-11-28 07:48:15 
 * @Last Modified by: 
 * @Last Modified time: 2024-12-19 07:21:59
 * @Description: All the controllers (call operations) for the API reference
 */


const {
  createReference,
  getReference,
  getReferenceByCode,
  getReferenceByProject,
  getReferenceByDashboard,
  updateReference,
  updateReferencePosition,
  copyReference,  
  reorderReference, 
  deleteReference,
  deleteAllReference
} = require("./reference.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new reference 
  // -----------------------------------------------------------
  createReference: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to insert a reference
    const result = await createReference(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Reference created successfully"
    });
  }),

  // ---------------------------------------------------------------------------
  // get a reference by ID
  // ---------------------------------------------------------------------------
  getReference: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get a reference
    const id = req.params.id;
    //console.log ('Id: ' + id)
    const result = await getReference(id);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // get reference info by the code
  // ---------------------------------------------------------------------------
  getReferenceByCode: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to get a specific code for a reference

    if (!body.user == undefined || body.code == undefined) {
      throw new AppError('No input data for getReferenceByCode!', 200);
    }

    const result = await getReferenceByCode(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),


  // ---------------------------------------------------------------------------
  // get all references info for a project
  // ---------------------------------------------------------------------------
  getReferenceByProject: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get all references
    const body = req.body;
    const result = await getReferenceByProject(body);
    return res.json({
      success: 1,
      data: result
    });
  }),

  // ---------------------------------------------------------------------------------------------------------------
  // get the references ready for the dashboard (by projectID, userID and defined in the parameters of the project)
  // ---------------------------------------------------------------------------------------------------------------
  getReferenceByDashboard: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get all references
    const body = req.body;
    const result = await getReferenceByDashboard(body);
    return res.json({
      success: 1,
      data: result
    });
  }),



  // ---------------------------------------------------------------------------
  // update a reference
  // ---------------------------------------------------------------------------
  updateReference: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to update a user
    const result = await updateReference(body);
    //console.log ('Result:', result)
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "reference updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Update a Reference position
  // -----------------------------------------------------------
  updateReferencePosition: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to update the position of a reference
    const result = await updateReferencePosition(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! updating the record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Reference position updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Reorder the Reference table
  // -----------------------------------------------------------
  reorderReference: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to reorder the reference table
    const body = req.body;
    const result = await reorderReference(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! reordering record', 200);
    }
    return res.status(200).json({
      success: 1,
      result: result,
      message: "Reference reordered successfully",
    });
  }),

  // -----------------------------------------------------------
  // Copy a Reference 
  // -----------------------------------------------------------
  copyReference: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to copy a reference
    const result = await copyReference(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! copying a reference record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Reference copied successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // Delete a reference
  // ---------------------------------------------------------------------------
  deleteReference: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete a reference
    const result = await deleteReference(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "reference deleted successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // Delete all the references of the user
  // ---------------------------------------------------------------------------
  deleteAllReference: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete a reference
    const result = await deleteAllReference(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Full reference deleted successfully",
    });
  })


};



