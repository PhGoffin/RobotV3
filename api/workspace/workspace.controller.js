
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2023-11-28 07:48:15 
 * @Last Modified by: 
 * @Last Modified time: 2023-12-18 13:18:19
 * @Description: All the controllers (call operations) for the API workspace
 */


const {
  createWorkspace,
  getWorkspaceById,  
  getWorkspaceByName,
  getWorkspaces,
  updateWorkspace,
  deleteWorkspace
} = require("./workspace.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new Workspace 
  // -----------------------------------------------------------
  createWorkspace: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to insert a faker
    const result = await createWorkspace(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Workspace created successfully"
    });
  }),


  // ---------------------------------------------------------------------------
  // get Workspace info by the Name
  // ---------------------------------------------------------------------------
  getWorkspaceByName: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to get a specific code for a user

    if (!body.workspace == undefined) {
      throw new AppError('No input data for getWorkspaceByCode!', 200);
    }

    const result = await getWorkspaceByName(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),

  // ---------------------------------------------------------------------------
  // get detail of a Workspace
  // ---------------------------------------------------------------------------
  getWorkspaceById: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get one Workspace
    const id = req.params.id;
    const result = await getWorkspaceById(id);
    return res.json({
      success: 1,
      data: result
    });
  }),



  // ---------------------------------------------------------------------------
  // get all Workspace info
  // ---------------------------------------------------------------------------
  getWorkspaces: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get all Workspaces
    const result = await getWorkspaces();
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // update a Workspace
  // ---------------------------------------------------------------------------
  updateWorkspace: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to update a Workspace
    const result = await updateWorkspace(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "Workspace updated successfully",
    });
  }),


  // ---------------------------------------------------------------------------
  // Delete a Workspace
  // ---------------------------------------------------------------------------
  deleteWorkspace: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete a workspace
    const result = await deleteWorkspace(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Workspace deleted successfully",
    });
  })

};



