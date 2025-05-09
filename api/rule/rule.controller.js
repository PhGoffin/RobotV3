
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-01
 * @Last Modified by: 
 * @Last Modified time: 2024-11-25 10:02:20
 * @Description: All the controllers (call operations) for the API Rule
 */


const {
  createRule,
  getRule,
  getRulesByProject,
  getRulesByCode,
  getRulesByDictionary,  
  getRulesByHeader,
  exportRule,
  updateRule,
  updateRuleResult,  
  updateRulePosition, 
  updateActive,  
  updateCommentType, 
  reorderRule,
  copyRule, 
  copyAllRules, 
  importRule,  
  deleteRule,
  deleteAllRules
} = require("./rule.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new Rule 
  // -----------------------------------------------------------
  createRule: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to insert a Rule
    const result = await createRule(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Rule created successfully"
    });
  }),

  // ---------------------------------------------------------------------------
  // get a Rule by ID
  // ---------------------------------------------------------------------------
  getRule: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get a Rule
    const id = req.params.id;
    //console.log ('Id: ' + id)
    const result = await getRule(id);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // get Rule info by the code
  // ---------------------------------------------------------------------------
  getRulesByCode: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to get a specific code for a Rule
    const result = await getRulesByCode(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),

  // ---------------------------------------------------------------------------
  // get Rules by dictionary word in the Result field
  // ---------------------------------------------------------------------------
  getRulesByDictionary: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to search for a dictionary word in the result of a Rule
    const result = await getRulesByDictionary(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),


  // ---------------------------------------------------------------------------
  // get all Rules by project
  // ---------------------------------------------------------------------------
  getRulesByProject: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get all Rules
    const id = req.params.id;
    const result = await getRulesByProject(id);
    return res.json({
      success: 1,
      data: result
    });
  }),

  // ---------------------------------------------------------------------------
  // get all Rules info for a ruleheader
  // ---------------------------------------------------------------------------
  getRulesByHeader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get all rules per rule header
    const id = req.params.id;
    const result = await getRulesByHeader(id);
    return res.json({
      success: 1,
      data: result
    });
  }),

  // ---------------------------------------------------------------------------
  // Export Rules into a json file
  // ---------------------------------------------------------------------------
  exportRule: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to export rules
    const result = await exportRule(body);
    //console.log ('Result: ', result)
    if (!result.affectedRows) {
      //console.log (result)
      throw new AppError('Failed to export rule!', 200);
    }
    return res.json({
      success: 1,
      message: "Rule exported successfully with " + result.affectedRows + " record(s)",
    });
  }), 

  // ---------------------------------------------------------------------------
  // Download an export json file
  // ---------------------------------------------------------------------------
  downloadFile: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const path = require('path')
    let fileName = req.params.id;
    console.log('fileName: ', fileName)
    fileName = './data/' + fileName.replace(/@/g, '/')
    console.log('fileName: ', fileName)

    res.download(
      fileName,
      (err) => {
        if (err) {
          res.send({
            error: err,
            msg: "Problem downloading the file"
          })
        }
      });
  }),


  // ---------------------------------------------------------------------------
  // update a Rule
  // ---------------------------------------------------------------------------
  updateRule: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to update a Rule
    const result = await updateRule(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "Rule updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Update a Rule result
  // -----------------------------------------------------------
  updateRuleResult: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to update the result of a Rule
    const result = await updateRuleResult(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! updating the record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Rule result updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Update a Rule position
  // -----------------------------------------------------------
  updateRulePosition: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to update the position of a Rule
    const result = await updateRulePosition(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! updating the record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Rule position updated successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // update active status
  // ---------------------------------------------------------------------------
  updateActive: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to update rule active status
    const result = await updateActive(body);
    if (!result.affectedRows) {
      //console.log (result)
      throw new AppError('Failed to update rule active!', 200);
    }
    return res.json({
      success: 1,
      message: "Rule active updated successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // update Comment Type
  // ---------------------------------------------------------------------------
  updateCommentType: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to update comment type
    const result = await updateCommentType(body);
    if (!result.affectedRows) {
      //console.log (result)
      throw new AppError('Failed to update test Comment Type!', 200);
    }
    return res.json({
      success: 1,
      message: "Test Comment Type updated successfully",
    });
  }),


  // -----------------------------------------------------------
  // Reorder the Rule table
  // -----------------------------------------------------------
  reorderRule: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to reorder the Rule table
    const body = req.body;
    const result = await reorderRule(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! reordering record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Rule reordered successfully",
    });
  }),

  // -----------------------------------------------------------
  // Copy a Rule 
  // -----------------------------------------------------------
  copyRule: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to copy a Rule
    const result = await copyRule(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! copying a Rule record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Rule copied successfully",
    });
  }),

  // -----------------------------------------------------------
  // Copy all Rules from the same ruleheader 
  // -----------------------------------------------------------
  copyAllRules: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to copy a Rule
    const result = await copyAllRules(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! copying a All Rules', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "All Rules copied successfully",
    });
  }),

  // -----------------------------------------------------------
  // Import Rules from another project 
  // -----------------------------------------------------------
  importRule: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to import Rules
    const result = await importRule(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! importing Rules', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Rules imported successfully",
    });
  }),


  // ---------------------------------------------------------------------------
  // Delete a Rule
  // ---------------------------------------------------------------------------
  deleteRule: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete a Rule
    const result = await deleteRule(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Rule deleted successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // Delete all Rules from the same ruleheader 
  // ---------------------------------------------------------------------------
  deleteAllRules: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete all Rules
    const result = await deleteAllRules(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete records!', 200);
    }
    return res.json({
      success: 1,
      message: "All Rules deleted successfully",
    });
  })

};



