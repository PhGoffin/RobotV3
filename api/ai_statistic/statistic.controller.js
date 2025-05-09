
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-18
 * @Last Modified by: 
 * @Last Modified time: 2024-04-15 13:57:24
 * @Description: All the controllers (call operations) for the API AI Statistic
 */


const {
    createStatistic,
    getStatistic,
    getStatisticByProject,
    getStatisticByPath,
    updateStatistic,
    deleteStatistic,
    deleteAllStatistic,
    updateStatisticPosition, 
    updateStatisticCondition,
    reorderStatistic, 
    copyStatistic 
  } = require("./statistic.service");
  const AppError = require("../../utils/appError");
  const catchAsync = require("../../utils/catchAsync");
  
  
  module.exports = {
  
  
    // -----------------------------------------------------------
    // Insert a new Statistic 
    // -----------------------------------------------------------
    createStatistic: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');
      const body = req.body;
  
      // Call the database services to insert a Statistic
      const result = await createStatistic(body);
      if (!result.affectedRows) {
        throw new AppError('Failed! Insert record', 200);
      }
      return res.status(200).json({
        success: 1,
        id: result.insertId,
        message: "Statistic created successfully",
      });
    }),
  
    // ---------------------------------------------------------------------------
    // get a Statistic
    // ---------------------------------------------------------------------------
    getStatistic: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');
      // Call the database services to get a Statistic
      const id = req.params.id;
      const result = await getStatistic(id);
      return res.json({
        success: 1,
        data: result
      });
    }),
  
  
    // ---------------------------------------------------------------------------
    // get Statistics by projects
    // ---------------------------------------------------------------------------
    getStatisticByProject: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');
      // Call the database services to get Statistics by project
      const id = req.params.id;
      const result = await getStatisticByProject(id);
      return res.json({
        success: 1,
        data: result
      });
    }),
  
    
    // ---------------------------------------------------------------------------
    // get Statistics by path (projectID, pathID, selectorID)
    // ---------------------------------------------------------------------------
    getStatisticByPath: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');
      // Call the database services to get Statistics by path
      const body = req.body;
      const result = await getStatisticByPath(body);
      return res.json({
        success: 1,
        data: result
      });
    }),



    // ---------------------------------------------------------------------------
    // update a Statistic
    // ---------------------------------------------------------------------------
    updateStatistic: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');    
      const body = req.body;
  
      // Call the database services to update a Statistic
      const result = await updateStatistic(body);
      if (!result.affectedRows) {
        throw new AppError('Failed to update record!', 200);
      }
      return res.json({
        success: 1,
        message: "updated successfully",
      });
    }),
  
  
    // ---------------------------------------------------------------------------
    // update a Statistic position
    // ---------------------------------------------------------------------------
    updateStatisticPosition: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');    
      const body = req.body;
  
      // Call the database services to update a Statistic position
      const result = await updateStatisticPosition(body);
      if (!result.affectedRows) {
        throw new AppError('Failed to update record!', 200);
      }
      return res.json({
        success: 1,
        message: "updated successfully",
      });
    }),
  

    // ---------------------------------------------------------------------------
    // update a Statistic condition
    // ---------------------------------------------------------------------------
    updateStatisticCondition: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');    
      const body = req.body;
  
      // Call the database services to update a Statistic position
      const result = await updateStatisticCondition(body);
      if (!result.affectedRows) {
        throw new AppError('Failed to update record!', 200);
      }
      return res.json({
        success: 1,
        message: "updated successfully",
      });
    }),
      
  
    // ---------------------------------------------------------------------------
    // Reorder the Statistics
    // ---------------------------------------------------------------------------
    reorderStatistic: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');    
      const body = req.body;
  
      // Call the database services to reorder the Statistics
      const result = await reorderStatistic(body);
      if (!result.affectedRows) {
        throw new AppError('Failed to reorder Statistic!', 200);
      }
      return res.json({
        success: 1,
        message: "reorder successfully",
      });
    }),
  
  
    // ---------------------------------------------------------------------------
    // Copy a Statistic
    // ---------------------------------------------------------------------------
    copyStatistic: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');    
      const body = req.body;
  
      // Call the database services to reorder the Statistics
      const result = await copyStatistic(body);
      if (!result.affectedRows) {
        throw new AppError('Failed to copy Statistic!', 200);
      }
      return res.json({
        success: 1,
        message: "copy successfully",
      });
    }),
  
  
    // ---------------------------------------------------------------------------
    // Delete a Statistic
    // ---------------------------------------------------------------------------
    deleteStatistic: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');    
      const id = req.params.id;
      // Call the database services to delete a Statistic
      const result = await deleteStatistic(id);
      if (!result.affectedRows) {
        throw new AppError('Failed to delete record!', 200);
      }
      return res.json({
        success: 1,
        message: "Statistic deleted successfully",
      });
    }),

  // ---------------------------------------------------------------------------
  // Delete all Statistics of a project
  // ---------------------------------------------------------------------------
  deleteAllStatistic: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete Statistics
    const result = await deleteAllStatistic(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to full delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Statistic full deleted successfully",
    });
  }),    

  
  };
  
  
  
  