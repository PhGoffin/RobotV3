
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2023-11-28 07:48:15 
 * @Last Modified by: 
 * @Last Modified time: 2023-12-21 15:01:11
 * @Description: All the controllers (call operations) for the API project
 */


const {
  createProject,
  getProjectById,
  getProjectByName,
  getProjectsByUser,
  getProjectsByWorkspace,
  updateProject,
  deleteProject
} = require("./project.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new project 
  // -----------------------------------------------------------
  createProject: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to insert a project
    const result = await createProject(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Project created successfully",
      // ????   profile_url: 'http://localhost:5000/public/${req.file.filename}',
    });
  }),


  // ---------------------------------------------------------------------------
  // get project info by the ID
  // ---------------------------------------------------------------------------
  getProjectById: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to get a specific project
    const id = req.params.id;
    const result = await getProjectById(id);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),


  // ---------------------------------------------------------------------------
  // get project by the NAME
  // ---------------------------------------------------------------------------
  getProjectByName: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to get a specific project
    const body = req.body;
    const result = await getProjectByName(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),

  // ---------------------------------------------------------------------------
  // get all projects info by user
  // ---------------------------------------------------------------------------
  getProjectsByUser: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to get all Projects
    const id = req.params.id;
    const result = await getProjectsByUser(id);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // get all projects info by workspace
  // ---------------------------------------------------------------------------
  getProjectsByWorkspace: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to get all Projects
    const id = req.params.id;
    const result = await getProjectsByWorkspace(id);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // update the project
  // ---------------------------------------------------------------------------
  updateProject: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to update a user
    const result = await updateProject(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "updated successfully",
    });
  }),


  // ---------------------------------------------------------------------------
  // Delete a project
  // ---------------------------------------------------------------------------
  deleteProject: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to delete a user
    const result = await deleteProject(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "project deleted successfully",
    });
  })

};



