
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2026-04-13
 * @Last Modified by: Someone
 * @Last Modified time: 2026-04-14 15:42:39
 * @Description: All the routes available for the API Android
 */

const router = require("express").Router();
const {
  getSnapshot,
  clickOn,
  HomeKey,
  BackKey
} = require("./android.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/snapshot", getSnapshot);
router.get("/home", HomeKey);
router.get("/back", BackKey); 
router.post("/click", clickOn); 

module.exports = router;
