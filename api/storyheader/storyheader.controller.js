
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-21
 * @Last Modified by: 
 * @Last Modified time: 2023-12-18 13:17:42
 * @Description: All the controllers (call operations) for the API StoryHeader
 */


const {
  createStoryHeader,
  getStoryHeader,
  getStoryHeaderByCode,
  getStoryHeaderBySubProject,
  updateStoryHeader,
  updateStoryHeaderPosition,
  copyStoryHeader,  
  reorderStoryHeader, 
  deleteStoryHeader
} = require("./storyheader.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new StoryHeader 
  // -----------------------------------------------------------
  createStoryHeader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to insert a StoryHeader
    const result = await createStoryHeader(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Story set created successfully"
    });
  }),

  // ---------------------------------------------------------------------------
  // get a StoryHeader by ID
  // ---------------------------------------------------------------------------
  getStoryHeader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get a StoryHeader
    const id = req.params.id;
    //console.log ('Id: ' + id)
    const result = await getStoryHeader(id);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // get StoryHeader info by the code
  // ---------------------------------------------------------------------------
  getStoryHeaderByCode: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to get a specific code for a StoryHeader
    const result = await getStoryHeaderByCode(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),


  // ---------------------------------------------------------------------------
  // get all StoryHeaders info for a subproject
  // ---------------------------------------------------------------------------
  getStoryHeaderBySubProject: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get all StoryHeaders per subprojects
    const body = req.body;
    const result = await getStoryHeaderBySubProject(body);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // update a StoryHeader
  // ---------------------------------------------------------------------------
  updateStoryHeader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to update a StoryHeader
    const result = await updateStoryHeader(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "Story set updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Update a StoryHeader position
  // -----------------------------------------------------------
  updateStoryHeaderPosition: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to update the position of a StoryHeader
    const result = await updateStoryHeaderPosition(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! updating the record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Story set position updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Reorder the StoryHeader table
  // -----------------------------------------------------------
  reorderStoryHeader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to reorder the StoryHeader table
    const body = req.body;
    const result = await reorderStoryHeader(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! reordering record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Story set reordered successfully",
    });
  }),

  // -----------------------------------------------------------
  // Copy a StoryHeader 
  // -----------------------------------------------------------
  copyStoryHeader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to copy a StoryHeader
    const result = await copyStoryHeader(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! copying a StoryHeader record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Story set copied successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // Delete a StoryHeader
  // ---------------------------------------------------------------------------
  deleteStoryHeader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete a StoryHeader
    const result = await deleteStoryHeader(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Story set deleted successfully",
    });
  })

};



