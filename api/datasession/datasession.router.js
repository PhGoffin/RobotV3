
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2023-11-28 07:46:48 
 * @Last Modified by: 
 * @Last Modified time: 2023-12-07 09:19:27
 * @Description: All the routes available for the API datasession (data is used to exchange information during a session )
 */

const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
  createDataSession,
  getDataSession,
  getDataSessionByCode,
  updateDataSession,
  deleteDataSession,
  resetDataSession  
} = require("./datasession.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/", getDataSession);
router.post("/create", createDataSession);
router.post("/value", getDataSessionByCode);
router.patch("/", updateDataSession);
router.delete("/reset/:id", resetDataSession);
router.post("/delete", deleteDataSession);


module.exports = router;
