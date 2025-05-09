
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-08
 * @Last Modified by: 
 * @Last Modified time: 2023-12-18 13:17:42
 * @Description: All the controllers (call operations) for the API Rule header
 */


const {
  createRuleheader,
  getRuleheader,
  getRuleheadersByProject,
  getRuleheadersByCode,
  updateRuleheader,
  updateRuleheaderPosition, 
  reorderRuleheader,
  copyRuleheader, 
  importRuleheader,  
  deleteRuleheader
} = require("./ruleheader.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new Ruleheader 
  // -----------------------------------------------------------
  createRuleheader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to insert a Ruleheader
    const result = await createRuleheader(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Rule set created successfully"
    });
  }),

  // ---------------------------------------------------------------------------
  // get a Ruleheader by ID
  // ---------------------------------------------------------------------------
  getRuleheader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get a Ruleheader
    const id = req.params.id;
    //console.log ('Id: ' + id)
    const result = await getRuleheader(id);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // get Ruleheader info by the code
  // ---------------------------------------------------------------------------
  getRuleheadersByCode: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const id = req.params.id;
    // Call the database services to get a specific code for a Ruleheader
    const result = await getRuleheadersByCode(id);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),


  // ---------------------------------------------------------------------------
  // get all Ruleheaders  by project
  // ---------------------------------------------------------------------------
  getRuleheadersByProject: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get all Ruleheaders
    const id = req.params.id;
    const result = await getRuleheadersByProject(id);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // update a Ruleheader
  // ---------------------------------------------------------------------------
  updateRuleheader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to update a Ruleheader
    const result = await updateRuleheader(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "Rule set updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Update a Ruleheader position
  // -----------------------------------------------------------
  updateRuleheaderPosition: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to update the position of a Ruleheader
    const result = await updateRuleheaderPosition(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! updating the record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Rule set position updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Reorder the Ruleheader table
  // -----------------------------------------------------------
  reorderRuleheader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to reorder the Ruleheader table
    const body = req.body;
    const result = await reorderRuleheader(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! reordering record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Rule set reordered successfully",
    });
  }),

  // -----------------------------------------------------------
  // Copy a Ruleheader 
  // -----------------------------------------------------------
  copyRuleheader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to copy a Ruleheader
    const result = await copyRuleheader(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! copying a Rule set record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Rule set copied successfully",
    });
  }),


  // -----------------------------------------------------------
  // Import a Ruleheader from another project
  // -----------------------------------------------------------
  importRuleheader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to copy a Ruleheader
    const result = await importRuleheader(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! importing a Rule set record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Rule set imported successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // Delete a Ruleheader
  // ---------------------------------------------------------------------------
  deleteRuleheader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete a Ruleheader
    const result = await deleteRuleheader(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Rule set deleted successfully",
    });
  })

};



