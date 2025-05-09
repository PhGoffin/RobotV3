
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-21
 * @Last Modified by: 
 * @Last Modified time: 2023-12-18 13:17:42
 * @Description: All the controllers (call operations) for the API Story
 */


const {
  createStory,
  getStory,
  getStoryByCode,
  getStoryByHeader,
  updateStory,
  updateStoryPosition, 
  reorderStory,
  copyStory,
  copyAllStory, 
  deleteStory,
  deleteAllStory
} = require("./story.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new Story 
  // -----------------------------------------------------------
  createStory: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to insert a Story
    const result = await createStory(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Story created successfully"
    });
  }),

  // ---------------------------------------------------------------------------
  // get a Story by ID
  // ---------------------------------------------------------------------------
  getStory: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get a Story
    const id = req.params.id;
    //console.log ('Id: ' + id)
    const result = await getStory(id);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // get Story info by the code
  // ---------------------------------------------------------------------------
  getStoryByCode: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to get a specific code for a Story
    const result = await getStoryByCode(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),


  // ---------------------------------------------------------------------------
  // get all Stories info for a Storyheader
  // ---------------------------------------------------------------------------
  getStoryByHeader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get all Stories per subprojects
    const body = req.body;
    const result = await getStoryByHeader(body);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // update a Story
  // ---------------------------------------------------------------------------
  updateStory: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to update a Story
    const result = await updateStory(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "Story updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Update a Story position
  // -----------------------------------------------------------
  updateStoryPosition: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to update the position of a Story
    const result = await updateStoryPosition(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! updating the record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Story position updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Reorder the Story table
  // -----------------------------------------------------------
  reorderStory: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to reorder the Story table
    const body = req.body;
    const result = await reorderStory(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! reordering record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Story reordered successfully",
    });
  }),

  // -----------------------------------------------------------
  // Copy a Story 
  // -----------------------------------------------------------
  copyStory: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to copy a Story
    const result = await copyStory(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! copying a Story record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Story copied successfully",
    });
  }),

  // -----------------------------------------------------------
  // Copy All Story from a Storyheader
  // -----------------------------------------------------------
  copyAllStory: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to copy all Story from a Storyheader
    const result = await copyAllStory(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! copying a Full Story', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Full Story copied successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // Delete a Story
  // ---------------------------------------------------------------------------
  deleteStory: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete a Story
    const result = await deleteStory(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Story deleted successfully",
    });
  }) , 

  // ---------------------------------------------------------------------------
  // Delete all Story from a Storyheader
  // ---------------------------------------------------------------------------
  deleteAllStory: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete a Story
    const result = await deleteAllStory(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete Full Story!', 200);
    }
    return res.json({
      success: 1,
      message: "Full Story deleted successfully",
    });
  })

};



