
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-09
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-09 16:04:04
 * @Description: All the controllers (call operations) for the API selector
 */


const {
  createSelector,
  getSelector,
  getSelectorByProject,
  updateSelector,
  deleteSelector,
  deleteAllSelector,
  importSelector,
  updateSelectorPosition, 
  reorderSelector, 
  copySelector 
} = require("./selector.service");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new selector 
  // -----------------------------------------------------------
  createSelector: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;

    // Call the database services to insert a selector
    const result = await createSelector(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "selector created successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // get a selector
  // ---------------------------------------------------------------------------
  getSelector: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to get a selector
    const id = req.params.id;
    const result = await getSelector(id);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // get selectors by projects
  // ---------------------------------------------------------------------------
  getSelectorByProject: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to get selectors by project
    const body = req.body;
    const result = await getSelectorByProject(body);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // update a selector
  // ---------------------------------------------------------------------------
  updateSelector: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;

    // Call the database services to update a selector
    const result = await updateSelector(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "updated successfully",
    });
  }),


  // ---------------------------------------------------------------------------
  // update a selector position
  // ---------------------------------------------------------------------------
  updateSelectorPosition: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;

    // Call the database services to update a selector position
    const result = await updateSelectorPosition(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "updated successfully",
    });
  }),


  // ---------------------------------------------------------------------------
  // Reorder the selectors
  // ---------------------------------------------------------------------------
  reorderSelector: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;

    // Call the database services to reorder the selectors
    const result = await reorderSelector(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to reorder selector!', 200);
    }
    return res.json({
      success: 1,
      message: "reorder successfully",
    });
  }),


  // ---------------------------------------------------------------------------
  // Copy a selector
  // ---------------------------------------------------------------------------
  copySelector: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;

    // Call the database services to reorder the selectors
    const result = await copySelector(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to copy selector!', 200);
    }
    return res.json({
      success: 1,
      message: "copy successfully",
    });
  }),


  // ---------------------------------------------------------------------------
  // Delete a selector
  // ---------------------------------------------------------------------------
  deleteSelector: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const id = req.params.id;
    // Call the database services to delete a selector
    const result = await deleteSelector(id);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Selector deleted successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // Delete all selectors of a project
  // ---------------------------------------------------------------------------
  deleteAllSelector: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete selectors
    const result = await deleteAllSelector(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to full delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Selector full deleted successfully",
    });
  }),    

  // ---------------------------------------------------------------------------
  // Import selector into a project
  // ---------------------------------------------------------------------------
  importSelector: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to import selector
    const result = await importSelector(body);
    console.log ('result: ' , result)
    if (!result.success) {
      throw new AppError('Failed to import selectors', 200);
    }
    return res.json({
      success: 1,
      message: result.message,
    });
  }),
  

};



