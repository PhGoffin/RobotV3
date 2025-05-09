
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-09
 * @Last Modified by: 
 * @Last Modified time: 2023-12-07 09:20:34
 * @Description: All the routes available for the API Dictionaryheader
 */

const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
  createDictionaryheader,
  getDictionaryheader,
  getDictionaryheaderByCode,
  getDictionaryheaderByProject,
  updateDictionaryheader,
  updateDictionaryheaderPosition, 
  reorderDictionaryheader, 
  copyDictionaryheader, 
  deleteDictionaryheader
} = require("./dictionaryheader.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/:id", getDictionaryheader); 
router.get("/project/:id", getDictionaryheaderByProject); 
router.post("/value", getDictionaryheaderByCode);
router.post("/update", updateDictionaryheader); 
router.post("/position", updateDictionaryheaderPosition); 
router.post("/reorder", reorderDictionaryheader); 
router.post("/copy", copyDictionaryheader);
router.post("/delete", deleteDictionaryheader);
router.post("/create", createDictionaryheader); 


module.exports = router;
