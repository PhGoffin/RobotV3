
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-28
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-09 17:23:24
 * @Description: All the controllers (call operations) for the API Story Exec
 */


const {
  getExecutedStory,
  resetExecutedStory,
  counterExecutedStory,
  deleteExecutedStory
} = require("./storyexec.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // ---------------------------------------------------------------------------
  // Get all Stories with the execution
  // ---------------------------------------------------------------------------
  getExecutedStory: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get all Stories with the results of the execution
    const body = req.body;
    const result = await getExecutedStory(body);

    return res.json({
      success: 1,
      data: result.filter((ar) => ar.storyheaderID == body.storyheaderID && ar.userID == body.userID)
    });
  }),


  // ---------------------------------------------------------------------------
  // Reset all the executed stories
  // ---------------------------------------------------------------------------
  resetExecutedStory: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to update a Story
    const result = await resetExecutedStory(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to reset record!', 200);
    }
    return res.json({
      success: 1,
      message: "Story exec reseted successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // Update the counter
  // ---------------------------------------------------------------------------
  counterExecutedStory: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to update a Story
    const result = await counterExecutedStory(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update the counter record!', 200);
    }
    return res.json({
      success: 1,
      message: "Story exec counter updated successfully",
    });
  }),



  // ---------------------------------------------------------------------------
  // Delete all Story from a Storyheader
  // ---------------------------------------------------------------------------
  deleteExecutedStory: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete a Exec Story
    const result = await deleteExecutedStory(body);
    return res.json({
      success: 1,
      message: "Exec Story deleted successfully: " + result.affectedRows + " row(s) deleted!",
    });
  })

};



