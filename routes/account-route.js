const express = require("express"); 
const router = new express.Router(); 
const util = require("../utilities")
const accController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation')
const baseController = require("../controllers/baseController")


router.get("/login", accController.buildLogin);
router.get("/logout", util.deleteJwt, baseController.buildHome);
router.get("/register", accController.buildRegister);
router.get("/", util.checkClientLogin, accController.buildManagement);

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    accController.registerClient
  )

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    accController.loginClient
  )

module.exports = router;