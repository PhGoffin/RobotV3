
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-07
 * @Last Modified by: 
 * @Last Modified time: 2024-09-03 08:31:29
 * @Description: All the controllers (call operations) for the API dummy users
 */


const {
  createDummyuser,
  getDummyuser,
  getDummyuserByUser,
  getDummyuserByProject,
  updateDummyuser,
  updateDummyuserPosition, 
  reorderDummyuser, 
  copyDummyuser, 
  deleteDummyuser
} = require("./dummyuser.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new Dummyuser record 
  // -----------------------------------------------------------
  createDummyuser: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to insert a faker
    const result = await createDummyuser(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Dummy user created successfully"
    });
  }),


  // ---------------------------------------------------------------------------
  // get Dummyuser info
  // ---------------------------------------------------------------------------
  getDummyuser: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const id = req.params.id;
    // Call the database services to get a specific dummy user
    const result = await getDummyuser(id);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),

  // ---------------------------------------------------------------------------
  // get Dummyuser info by the user and project
  // ---------------------------------------------------------------------------
  getDummyuserByUser: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to get a specific code for a Dummyuser
    const result = await getDummyuserByUser(body);
    //console.log (result)
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),


  // ---------------------------------------------------------------------------
  // get all records from dummyuser by a project
  // ---------------------------------------------------------------------------
  getDummyuserByProject: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get all Dummyuser
    const id = req.params.id;
    const result = await getDummyuserByProject(id);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // update a dummy user
  // ---------------------------------------------------------------------------
  updateDummyuser: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to update a dummyuser
    const result = await updateDummyuser(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "Dummy user updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Update a dummy user position
  // -----------------------------------------------------------
  updateDummyuserPosition: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to update the position of a dummyuser
    const result = await updateDummyuserPosition(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! updating the record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Dummy user position updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Reorder the dummyuser table
  // -----------------------------------------------------------
  reorderDummyuser: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to reorder the Dummyuser table
    const body = req.body;
    const result = await reorderDummyuser(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! reordering record', 200);
    }
    return res.status(200).json({
      success: 1,
      result: result,
      message: "dummy user reordered successfully",
    });
  }),

  // -----------------------------------------------------------
  // Copy a dummy user 
  // -----------------------------------------------------------
  copyDummyuser: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to copy adDummyuser
    const result = await copyDummyuser(body);
    //console.log ('Result: ', result)
    if (!result.affectedRows) {
      throw new AppError('Failed! copying a Dummyuser record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Dummy user copied successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // Delete a record in the dummyuser
  // ---------------------------------------------------------------------------
  deleteDummyuser: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete a dummy user
    const result = await deleteDummyuser(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Dummy user deleted successfully",
    });
  })

};



