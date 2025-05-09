
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2023-12-18 07:48:15 
 * @Last Modified by: 
 * @Last Modified time: 2024-05-14 08:04:17
 * @Description: All the controllers (call operations) for the API subproject
 */


const {
  createSubproject,
  getSubprojectById,
  getSubprojectByName,
  getSubprojectByProject,
  updateSubproject,
  updateSubprojectPosition,
  reorderSubproject,
  deleteSubproject
} = require("./subproject.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new subproject 
  // -----------------------------------------------------------
  createSubproject: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to insert a project
    const result = await createSubproject(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Subproject created successfully",
    });
  }),


  // ---------------------------------------------------------------------------
  // get subproject info by the ID
  // ---------------------------------------------------------------------------
  getSubprojectById: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to get a specific subproject
    const id = req.params.id;
    const result = await getSubprojectById(id);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),


  // ---------------------------------------------------------------------------
  // get subproject by the NAME
  // ---------------------------------------------------------------------------
  getSubprojectByName: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to get a specific project
    const body = req.body;
    const result = await getSubprojectByName(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),

  // ---------------------------------------------------------------------------
  // get all subprojects from project info
  // ---------------------------------------------------------------------------
  getSubprojectByProject: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to get all Projects
    const id = req.params.id;
    const result = await getSubprojectByProject(id);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // update the subproject
  // ---------------------------------------------------------------------------
  updateSubproject: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to update a subproject
    const result = await updateSubproject(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "updated successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // update the subproject position
  // ---------------------------------------------------------------------------
  updateSubprojectPosition: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to update position
    const result = await updateSubprojectPosition(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "position updated successfully",
    });
  }),

  
  // -----------------------------------------------------------
  // Reorder the Subproject table
  // -----------------------------------------------------------
  reorderSubproject: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to reorder the subproject table
    const body = req.body;
    const result = await reorderSubproject(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! reordering record', 200);
    }
    return res.status(200).json({
      success: 1,
      result: result,
      message: "Subproject reordered successfully",
    });
  }),  


  // ---------------------------------------------------------------------------
  // Delete a subproject
  // ---------------------------------------------------------------------------
  deleteSubproject: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to delete a user
    const result = await deleteSubproject(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "subproject deleted successfully",
    });
  })

};



