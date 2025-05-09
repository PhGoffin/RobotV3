
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-17
 * @Last Modified by: 
 * @Last Modified time: 2024-06-12 12:35:37
 * @Description: All the controllers (call operations) for the API AI TagAttribute
 */


const {
  createTagAttribute,
  getTagAttribute,
  getTagAttributeByProject,
  getTagAttributeByTraining,
  getTagAttributeByTagelement,
  getTagAttributeByPath,  
  updateTagAttribute,
  deleteTagAttribute,
  deleteByTagElement,
  deleteAllTagAttribute,
  updateTagAttributePosition,
  reorderTagAttribute,
  copyTagAttribute
} = require("./tagattribute.service");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new TagAttribute 
  // -----------------------------------------------------------
  createTagAttribute: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;

    // Call the database services to insert a TagAttribute
    const result = await createTagAttribute(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "TagAttribute created successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // get a TagAttribute
  // ---------------------------------------------------------------------------
  getTagAttribute: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to get a TagAttribute
    const id = req.params.id;
    const result = await getTagAttribute(id);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // get TagAttributes by projects
  // ---------------------------------------------------------------------------
  getTagAttributeByProject: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to get TagAttributes by project
    const id = req.params.id;
    const result = await getTagAttributeByProject(id);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // get TagAttributes by training (and by project)
  // ---------------------------------------------------------------------------
  getTagAttributeByTraining: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to get TagAttributes by training
    const body = req.body;
    const result = await getTagAttributeByTraining(body);
    return res.json({
      success: 1,
      data: result
    });
  }),

  // ---------------------------------------------------------------------------
  // get TagAttributes by tag element (and by project)
  // ---------------------------------------------------------------------------
  getTagAttributeByTagelement: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to get TagAttributes by tag element
    const body = req.body;
    const result = await getTagAttributeByTagelement(body);
    return res.json({
      success: 1,
      data: result
    });
  }),

  // ---------------------------------------------------------------------------
  // get TagAttributes by pathID (and by project)
  // ---------------------------------------------------------------------------
  getTagAttributeByPath: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to get TagAttributes by pathID
    const body = req.body;
    const result = await getTagAttributeByPath(body);
    return res.json({
      success: 1,
      data: result
    });
  }),

  // ---------------------------------------------------------------------------
  // update a TagAttribute
  // ---------------------------------------------------------------------------
  updateTagAttribute: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;

    // Call the database services to update a TagAttribute
    const result = await updateTagAttribute(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "updated successfully",
    });
  }),


  // ---------------------------------------------------------------------------
  // update a TagAttribute position
  // ---------------------------------------------------------------------------
  updateTagAttributePosition: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;

    // Call the database services to update a TagAttribute position
    const result = await updateTagAttributePosition(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "updated successfully",
    });
  }),


  // ---------------------------------------------------------------------------
  // Reorder the TagAttributes
  // ---------------------------------------------------------------------------
  reorderTagAttribute: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;

    // Call the database services to reorder the TagAttributes
    const result = await reorderTagAttribute(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to reorder TagAttribute!', 200);
    }
    return res.json({
      success: 1,
      message: "reorder successfully",
    });
  }),


  // ---------------------------------------------------------------------------
  // Copy a TagAttribute
  // ---------------------------------------------------------------------------
  copyTagAttribute: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;

    // Call the database services to reorder the TagAttributes
    const result = await copyTagAttribute(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to copy TagAttribute!', 200);
    }
    return res.json({
      success: 1,
      message: "copy successfully",
    });
  }),


  // ---------------------------------------------------------------------------
  // Delete a TagAttribute
  // ---------------------------------------------------------------------------
  deleteTagAttribute: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const id = req.params.id;
    // Call the database services to delete a TagAttribute
    const result = await deleteTagAttribute(id);
    if (!result.affectedRows) {
      throw new AppError('Failed to disable record!', 200);
    }
    return res.json({
      success: 1,
      message: "TagAttribute disabled successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // Delete all TagAttributes of a project
  // ---------------------------------------------------------------------------
  deleteAllTagAttribute: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to delete TagAttributes
    const result = await deleteAllTagAttribute(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to full delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "TagAttribute full deleted successfully",
    });
  }),


  // ---------------------------------------------------------------------------
  // Delete all TagAttributes of a tag element
  // ---------------------------------------------------------------------------
  deleteByTagElement: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to delete TagAttributes
    const result = await deleteByTagElement(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record by tag element!', 200);
    }
    return res.json({
      success: 1,
      message: "TagAttribute by TagElement deleted successfully",
    });
  }),


};



