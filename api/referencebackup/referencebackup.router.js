
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-03-04
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-04 11:47
 * @Description: All the routes available for the API reference backup
 */

const router = require("express").Router();
const {
  importRefrencebackup,
  exportReferencebackup,
  deleteReferencebackup
} = require("./referencebackup.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.post("/import", importRefrencebackup); 
router.post("/export", exportReferencebackup);
router.post("/delete", deleteReferencebackup);


module.exports = router;
