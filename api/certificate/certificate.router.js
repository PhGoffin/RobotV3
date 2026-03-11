
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2026-03-10
 * @Last Modified by: 
 * @Last Modified time: 2024-06-03 09:38:24
 * @Description: All the routes available for the API Certificate
 */

const router = require("express").Router();
const {
  createCertificate,
  getCertificateByCode,
  updateCertificate,
  deleteCertificate
} = require("./certificate.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.post("/code", getCertificateByCode);
router.post("/update", updateCertificate); 
router.post("/delete", deleteCertificate);
router.post("/create", createCertificate); 


module.exports = router;
