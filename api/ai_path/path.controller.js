
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-15
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-21 11:35:19
 * @Description: All the controllers (call operations) for the API AI Path
 */


const {
    createPath,
    getPath,
    getPathByProject,
    updatePath,
    deletePath,
    deleteAllPath,
    importPath,
    updatePathPosition, 
    reorderPath, 
    copyPath 
  } = require("./path.service");
  const AppError = require("../../utils/appError");
  const catchAsync = require("../../utils/catchAsync");
  
  
  module.exports = {
  
  
    // -----------------------------------------------------------
    // Insert a new Path 
    // -----------------------------------------------------------
    createPath: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');
      const body = req.body;
  
      // Call the database services to insert a Path
      const result = await createPath(body);
      if (!result.affectedRows) {
        throw new AppError('Failed! Insert record', 200);
      }
      return res.status(200).json({
        success: 1,
        id: result.insertId,
        message: "Path created successfully",
      });
    }),
  
    // ---------------------------------------------------------------------------
    // get a Path
    // ---------------------------------------------------------------------------
    getPath: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');
      // Call the database services to get a Path
      const id = req.params.id;
      const result = await getPath(id);
      return res.json({
        success: 1,
        data: result
      });
    }),
  
  
    // ---------------------------------------------------------------------------
    // get Paths by projects
    // ---------------------------------------------------------------------------
    getPathByProject: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');
      // Call the database services to get Paths by project
      const body = req.body;
      const result = await getPathByProject(body);
      return res.json({
        success: 1,
        data: result
      });
    }),
  
  
    // ---------------------------------------------------------------------------
    // update a Path
    // ---------------------------------------------------------------------------
    updatePath: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');    
      const body = req.body;
  
      // Call the database services to update a Path
      const result = await updatePath(body);
      if (!result.affectedRows) {
        throw new AppError('Failed to update record!', 200);
      }
      return res.json({
        success: 1,
        message: "updated successfully",
      });
    }),
  
  
    // ---------------------------------------------------------------------------
    // update a Path position
    // ---------------------------------------------------------------------------
    updatePathPosition: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');    
      const body = req.body;
  
      // Call the database services to update a Path position
      const result = await updatePathPosition(body);
      if (!result.affectedRows) {
        throw new AppError('Failed to update record!', 200);
      }
      return res.json({
        success: 1,
        message: "updated successfully",
      });
    }),
  
  
    // ---------------------------------------------------------------------------
    // Reorder the Paths
    // ---------------------------------------------------------------------------
    reorderPath: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');    
      const body = req.body;
  
      // Call the database services to reorder the Paths
      const result = await reorderPath(body);
      if (!result.affectedRows) {
        throw new AppError('Failed to reorder Path!', 200);
      }
      return res.json({
        success: 1,
        message: "reorder successfully",
      });
    }),
  
  
    // ---------------------------------------------------------------------------
    // Copy a Path
    // ---------------------------------------------------------------------------
    copyPath: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');    
      const body = req.body;
  
      // Call the database services to reorder the Paths
      const result = await copyPath(body);
      if (!result.affectedRows) {
        throw new AppError('Failed to copy Path!', 200);
      }
      return res.json({
        success: 1,
        message: "copy successfully",
      });
    }),
  
  
    // ---------------------------------------------------------------------------
    // Delete a Path
    // ---------------------------------------------------------------------------
    deletePath: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');    
      const id = req.params.id;
      // Call the database services to delete a Path
      const result = await deletePath(id);
      if (!result.affectedRows) {
        throw new AppError('Failed to delete record!', 200);
      }
      return res.json({
        success: 1,
        message: "Path deleted successfully",
      });
    }),

  // ---------------------------------------------------------------------------
  // Delete all paths of a project
  // ---------------------------------------------------------------------------
  deleteAllPath: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete paths
    const result = await deleteAllPath(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to full delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Path full deleted successfully",
    });
  }),    

  // ---------------------------------------------------------------------------
  // Import Paths into a project
  // ---------------------------------------------------------------------------
  importPath: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to import Paths
    const result = await importPath(body);
    console.log ('result: ' , result)
    if (!result.success) {
      throw new AppError('Failed to import attributes', 200);
    }
    return res.json({
      success: 1,
      message: result.message,
    });
  })
      
  
  };
  
  
  
  