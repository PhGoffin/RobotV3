
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-18
 * @Last Modified by: 
 * @Last Modified time: 2024-04-25 06:38:17
 * @Description: All the controllers (call operations) for the API AI Training
 */


const {
    createTraining,
    getTraining,
    getTrainingByProject,
    updateTraining,
    updateTrainingActive,
    deleteTraining,
    deleteAllTraining,
    updateTrainingPosition, 
    reorderTraining, 
    copyTraining 
  } = require("./training.service");
  const AppError = require("../../utils/appError");
  const catchAsync = require("../../utils/catchAsync");
  
  
  module.exports = {
  
  
    // -----------------------------------------------------------
    // Insert a new Training 
    // -----------------------------------------------------------
    createTraining: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');
      const body = req.body;
  
      // Call the database services to insert a Training
      const result = await createTraining(body);
      if (!result.affectedRows) {
        throw new AppError('Failed! Insert record', 200);
      }
      return res.status(200).json({
        success: 1,
        id: result.insertId,
        message: "Training created successfully",
      });
    }),
  
    // ---------------------------------------------------------------------------
    // get a Training
    // ---------------------------------------------------------------------------
    getTraining: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');
      // Call the database services to get a Training
      const id = req.params.id;
      const result = await getTraining(id);
      return res.json({
        success: 1,
        data: result
      });
    }),
  
  
    // ---------------------------------------------------------------------------
    // get Trainings by projects
    // ---------------------------------------------------------------------------
    getTrainingByProject: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');
      // Call the database services to get Trainings by project
      const id = req.params.id;
      const result = await getTrainingByProject(id);
      return res.json({
        success: 1,
        data: result
      });
    }),
  
  
    // ---------------------------------------------------------------------------
    // update a Training
    // ---------------------------------------------------------------------------
    updateTraining: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');    
      const body = req.body;
  
      // Call the database services to update a Training
      const result = await updateTraining(body);
      if (!result.affectedRows) {
        throw new AppError('Failed to update record!', 200);
      }
      return res.json({
        success: 1,
        message: "updated successfully",
      });
    }),
  
    // ---------------------------------------------------------------------------
    // update a Training active status
    // ---------------------------------------------------------------------------
    updateTrainingActive: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');    
      const body = req.body;
  
      // Call the database services to update a Training active status
      const result = await updateTrainingActive(body);
      if (!result.affectedRows) {
        throw new AppError('Failed to update record!', 200);
      }
      return res.json({
        success: 1,
        message: "updated successfully",
      });
    }),
  
    // ---------------------------------------------------------------------------
    // update a Training position
    // ---------------------------------------------------------------------------
    updateTrainingPosition: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');    
      const body = req.body;
  
      // Call the database services to update a Training position
      const result = await updateTrainingPosition(body);
      if (!result.affectedRows) {
        throw new AppError('Failed to update record!', 200);
      }
      return res.json({
        success: 1,
        message: "updated successfully",
      });
    }),
  
  
    // ---------------------------------------------------------------------------
    // Reorder the Trainings
    // ---------------------------------------------------------------------------
    reorderTraining: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');    
      const body = req.body;
  
      // Call the database services to reorder the Trainings
      const result = await reorderTraining(body);
      if (!result.affectedRows) {
        throw new AppError('Failed to reorder Training!', 200);
      }
      return res.json({
        success: 1,
        message: "reorder successfully",
      });
    }),
  
  
    // ---------------------------------------------------------------------------
    // Copy a Training
    // ---------------------------------------------------------------------------
    copyTraining: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');    
      const body = req.body;
  
      // Call the database services to reorder the Trainings
      const result = await copyTraining(body);
      if (!result.affectedRows) {
        throw new AppError('Failed to copy Training!', 200);
      }
      return res.json({
        success: 1,
        message: "copy successfully",
      });
    }),
  
  
    // ---------------------------------------------------------------------------
    // Delete a Training
    // ---------------------------------------------------------------------------
    deleteTraining: catchAsync(async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');    
      const id = req.params.id;
      // Call the database services to delete a Training
      const result = await deleteTraining(id);
      if (!result.affectedRows) {
        throw new AppError('Failed to delete record!', 200);
      }
      return res.json({
        success: 1,
        message: "Training deleted successfully",
      });
    }),

  // ---------------------------------------------------------------------------
  // Delete all Trainings of a project
  // ---------------------------------------------------------------------------
  deleteAllTraining: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete Trainings
    const result = await deleteAllTraining(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to full delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Training full deleted successfully",
    });
  }),    


  
  };
  
  
  
  