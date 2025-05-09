
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-30
 * @Last Modified by: 
 * @Last Modified time: 2024-08-07 12:03:30
 * @Description: All the controllers (call operations) for the API Dataset
 */


const {
  createDataset,
  getDataset,
  getDatasetByCode,
  getDatasetBySubProject,
  getDatasetByHeader,
  updateDataset,
  updateDatasetPosition,
  reorderDataset,
  copyDataset,
  copyAllDataset,
  exportDataset,
  importDataset,
  deleteDataset,
  deleteAllDataset
} = require("./dataset.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new Dataset 
  // -----------------------------------------------------------
  createDataset: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to insert a Dataset
    const result = await createDataset(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Dataset created successfully"
    });
  }),

  // ---------------------------------------------------------------------------
  // get a Dataset by ID
  // ---------------------------------------------------------------------------
  getDataset: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to get a Dataset
    const id = req.params.id;
    //console.log ('Id: ' + id)
    const result = await getDataset(id);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // get Dataset info by the code
  // ---------------------------------------------------------------------------
  getDatasetByCode: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to get a specific code for a Dataset
    const result = await getDatasetByCode(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),


  // ---------------------------------------------------------------------------
  // get all Datasets info for a subproject
  // ---------------------------------------------------------------------------
  getDatasetBySubProject: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to get all Datasets per subprojects
    const body = req.body;
    const result = await getDatasetBySubProject(body);
    return res.json({
      success: 1,
      data: result
    });
  }),

  // ---------------------------------------------------------------------------
  // get all Datasets info for a datasetheader
  // ---------------------------------------------------------------------------
  getDatasetByHeader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to get all Datasets per subprojects
    const body = req.body;
    const result = await getDatasetByHeader(body);
    return res.json({
      success: 1,
      data: result
    });
  }),




  // ---------------------------------------------------------------------------
  // update a Dataset
  // ---------------------------------------------------------------------------
  updateDataset: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to update a Dataset
    const result = await updateDataset(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "Dataset updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Update a Dataset position
  // -----------------------------------------------------------
  updateDatasetPosition: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to update the position of a Dataset
    const result = await updateDatasetPosition(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! updating the record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Dataset position updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Reorder the Dataset table
  // -----------------------------------------------------------
  reorderDataset: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to reorder the Dataset table
    const body = req.body;
    const result = await reorderDataset(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! reordering record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Dataset reordered successfully",
    });
  }),

  // -----------------------------------------------------------
  // Copy a Dataset 
  // -----------------------------------------------------------
  copyDataset: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to copy a Dataset
    const result = await copyDataset(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! copying a Dataset record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Dataset copied successfully",
    });
  }),

  // -----------------------------------------------------------
  // Copy All Dataset from a datasetheader
  // -----------------------------------------------------------
  copyAllDataset: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to copy all Dataset from a datasetheader
    const result = await copyAllDataset(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! copying a Full Dataset', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Full Dataset copied successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // Export Datasets into a json file
  // ---------------------------------------------------------------------------
  exportDataset: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to export datasets
    const result = await exportDataset(body);
    //console.log ('Result: ', result)
    if (!result.affectedRows) {
      //console.log (result)
      throw new AppError('Failed to export dataset!', 200);
    }
    return res.json({
      success: 1,
      message: "Datset exported successfully with " + result.affectedRows + " record(s)",
    });
  }),

  // ---------------------------------------------------------------------------
  // import Datasets from another datasetheader
  // ---------------------------------------------------------------------------
  importDataset: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to import datasets
    const result = await importDataset(body);
    //console.log ('Result: ', result)
    if (!result.affectedRows) {
      //console.log (result)
      throw new AppError('Failed to import dataset!', 200);
    }
    return res.json({
      success: 1,
      message: "Datset imported successfully with " + result.affectedRows + " record(s)",
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
  // Delete a Dataset
  // ---------------------------------------------------------------------------
  deleteDataset: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to delete a Dataset
    const result = await deleteDataset(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Dataset deleted successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // Delete all Dataset from a datasetheader
  // ---------------------------------------------------------------------------
  deleteAllDataset: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to delete a Dataset
    const result = await deleteAllDataset(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete Full dataset!', 200);
    }
    return res.json({
      success: 1,
      message: "Full Dataset deleted successfully",
    });
  })

};



