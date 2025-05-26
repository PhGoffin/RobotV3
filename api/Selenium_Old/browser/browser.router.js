const router = require("express").Router();


const {
    getBrowser,
    startBrowser,
    stopBrowser

  } = require("./browser.controller");
  
  // -------------------------------------------------------------
  // Call the operation in the controller depending of the route
  // -------------------------------------------------------------
  router.get("/get", getBrowser); 
  router.get("/start/:id", startBrowser); 
  router.get("/stop", stopBrowser); 



module.exports = router;