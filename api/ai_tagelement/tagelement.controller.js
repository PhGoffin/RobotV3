
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-20
 * @Last Modified by: 
 * @Last Modified time: 2024-04-25 08:01:24
 * @Description: All the controllers (call operations) for the API AI TagElement
 */


const {
  createTagElement,
  getTagElement,
  getTagElementByProject,
  getTagElementByTraining,
  getTagElementByPattern,
  getPathTagElement,
  updateTagElement,
  deleteTagElement,
  deleteAllTagElement,
  updateTagElementPosition,
  reorderTagElement,
  copyTagElement
} = require("./tagelement.service");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new TagElement 
  // -----------------------------------------------------------
  createTagElement: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;

    // Call the database services to insert a TagElement
    const result = await createTagElement(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "TagElement created successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // get a TagElement
  // ---------------------------------------------------------------------------
  getTagElement: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to get a TagElement
    const id = req.params.id;
    const result = await getTagElement(id);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // get TagElements by projects
  // ---------------------------------------------------------------------------
  getTagElementByProject: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to get TagElements by project
    const id = req.params.id;
    const result = await getTagElementByProject(id);
    return res.json({
      success: 1,
      data: result
    });
  }),

  // ---------------------------------------------------------------------------
  // get distinct path for TagElements by selector and project
  // ---------------------------------------------------------------------------
  getPathTagElement: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to get distinct path TagElements by selector and by project
    const body = req.body;
    const result = await getPathTagElement(body);
    return res.json({
      success: 1,
      data: result
    });
  }),

  // ---------------------------------------------------------------------------
  // get TagElements by training (and by project)
  // ---------------------------------------------------------------------------
  getTagElementByTraining: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to get TagElements by training
    const body = req.body;
    const result = await getTagElementByTraining(body);
    return res.json({
      success: 1,
      data: result
    });
  }),

  // ---------------------------------------------------------------------------
  // get TagElement by pattern 
  // ---------------------------------------------------------------------------
  getTagElementByPattern: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to get TagElement by pattern
    const body = req.body;
    const result = await getTagElementByPattern(body);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // update a TagElement
  // ---------------------------------------------------------------------------
  updateTagElement: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;

    // Call the database services to update a TagElement
    const result = await updateTagElement(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "updated successfully",
    });
  }),


  // ---------------------------------------------------------------------------
  // update a TagElement position
  // ---------------------------------------------------------------------------
  updateTagElementPosition: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;

    // Call the database services to update a TagElement position
    const result = await updateTagElementPosition(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "updated successfully",
    });
  }),


  // ---------------------------------------------------------------------------
  // Reorder the TagElements
  // ---------------------------------------------------------------------------
  reorderTagElement: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;

    // Call the database services to reorder the TagElements
    const result = await reorderTagElement(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to reorder TagElement!', 200);
    }
    return res.json({
      success: 1,
      message: "reorder successfully",
    });
  }),


  // ---------------------------------------------------------------------------
  // Copy a TagElement
  // ---------------------------------------------------------------------------
  copyTagElement: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;

    // Call the database services to reorder the TagElements
    const result = await copyTagElement(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to copy TagElement!', 200);
    }
    return res.json({
      success: 1,
      message: "copy successfully",
    });
  }),


  // ---------------------------------------------------------------------------
  // Delete a TagElement
  // ---------------------------------------------------------------------------
  deleteTagElement: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const id = req.params.id;
    // Call the database services to delete a TagElement
    const result = await deleteTagElement(id);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "TagElement deleted successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // Delete all TagElements of a project
  // ---------------------------------------------------------------------------
  deleteAllTagElement: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to delete TagElements
    const result = await deleteAllTagElement(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to full delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "TagElement full deleted successfully",
    });
  }),


};



