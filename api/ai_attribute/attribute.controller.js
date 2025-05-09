
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-15
 * @Last Modified by: 
 * @Last Modified time: 2024-04-15 13:57:24
 * @Description: All the controllers (call operations) for the API AI Attribute
 */


const {
    createAttribute,
    getAttribute,
    getAttributeByProject,
    updateAttribute,
    deleteAttribute,
    deleteAllAttribute,
    importAttribute,
    updateAttributePosition, 
    reorderAttribute, 
    copyAttribute 
  } = require("./attribute.service");
  const AppError = require("../../utils/appError");
  const catchAsync = require("../../utils/catchAsync");
  
  
  module.exports = {
  
  
    // -----------------------------------------------------------
    // Insert a new Attribute 
    // -----------------------------------------------------------
    createAttribute: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');
      const body = req.body;
  
      // Call the database services to insert a Attribute
      const result = await createAttribute(body);
      if (!result.affectedRows) {
        throw new AppError('Failed! Insert record', 200);
      }
      return res.status(200).json({
        success: 1,
        id: result.insertId,
        message: "Attribute created successfully",
      });
    }),
  
    // ---------------------------------------------------------------------------
    // get a Attribute
    // ---------------------------------------------------------------------------
    getAttribute: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');
      // Call the database services to get a Attribute
      const id = req.params.id;
      const result = await getAttribute(id);
      return res.json({
        success: 1,
        data: result
      });
    }),
  
  
    // ---------------------------------------------------------------------------
    // get Attributes by projects
    // ---------------------------------------------------------------------------
    getAttributeByProject: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');
      // Call the database services to get Attributes by project
      const body = req.body;
      const result = await getAttributeByProject(body);
      return res.json({
        success: 1,
        data: result
      });
    }),
  
  
    // ---------------------------------------------------------------------------
    // update a Attribute
    // ---------------------------------------------------------------------------
    updateAttribute: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');    
      const body = req.body;
  
      // Call the database services to update a Attribute
      const result = await updateAttribute(body);
      if (!result.affectedRows) {
        throw new AppError('Failed to update record!', 200);
      }
      return res.json({
        success: 1,
        message: "updated successfully",
      });
    }),
  
  
    // ---------------------------------------------------------------------------
    // update a Attribute position
    // ---------------------------------------------------------------------------
    updateAttributePosition: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');    
      const body = req.body;
  
      // Call the database services to update a Attribute position
      const result = await updateAttributePosition(body);
      if (!result.affectedRows) {
        throw new AppError('Failed to update record!', 200);
      }
      return res.json({
        success: 1,
        message: "updated successfully",
      });
    }),
  
  
    // ---------------------------------------------------------------------------
    // Reorder the Attributes
    // ---------------------------------------------------------------------------
    reorderAttribute: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');    
      const body = req.body;
  
      // Call the database services to reorder the Attributes
      const result = await reorderAttribute(body);
      if (!result.affectedRows) {
        throw new AppError('Failed to reorder Attribute!', 200);
      }
      return res.json({
        success: 1,
        message: "reorder successfully",
      });
    }),
  
  
    // ---------------------------------------------------------------------------
    // Copy a Attribute
    // ---------------------------------------------------------------------------
    copyAttribute: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');    
      const body = req.body;
  
      // Call the database services to reorder the Attributes
      const result = await copyAttribute(body);
      if (!result.affectedRows) {
        throw new AppError('Failed to copy Attribute!', 200);
      }
      return res.json({
        success: 1,
        message: "copy successfully",
      });
    }),
  
  
    // ---------------------------------------------------------------------------
    // Delete a Attribute
    // ---------------------------------------------------------------------------
    deleteAttribute: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');    
      const id = req.params.id;
      // Call the database services to delete a Attribute
      const result = await deleteAttribute(id);
      if (!result.affectedRows) {
        throw new AppError('Failed to delete record!', 200);
      }
      return res.json({
        success: 1,
        message: "Attribute deleted successfully",
      });
    }),

  // ---------------------------------------------------------------------------
  // Delete all attributes of a project
  // ---------------------------------------------------------------------------
  deleteAllAttribute: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete attributes
    const result = await deleteAllAttribute(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to full delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Attribute full deleted successfully",
    });
  }),    

  // ---------------------------------------------------------------------------
  // Import attributes into a project
  // ---------------------------------------------------------------------------
  importAttribute: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to import Patterns
    const result = await importAttribute(body);
    console.log ('result: ' , result)
    if (!result.success) {
      throw new AppError('Failed to import attributes', 200);
    }
    return res.json({
      success: 1,
      message: result.message,
    });
  }),
  
  };
  
  
  
  