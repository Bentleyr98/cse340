const express = require("express"); 
const router = new express.Router(); 
const util = require("../utilities")
const accController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation')
const baseController = require("../controllers/baseController")


router.get("/login", util.handleErrors(accController.buildLogin));
router.get("/logout", util.deleteJwt, util.handleErrors(baseController.buildHome));
router.get("/register", util.handleErrors(accController.buildRegister));
router.get("/", util.checkClientLogin, util.handleErrors(accController.buildManagement));

// Process the registration data
router.post("/register", regValidate.registationRules(), regValidate.checkRegData, util.handleErrors(accController.registerClient))

// Process the login attempt
router.post("/login", regValidate.loginRules(), regValidate.checkLoginData, util.handleErrors(accController.loginClient))


router.get("/account/:client_id", util.handleErrors(accController.updateClient))

//update info
router.post("/update-info", regValidate.updateInfoRules(), regValidate.checkUpdateData, util.handleErrors(accController.updateClientInfo))

//update info
router.post("/update-password", regValidate.passwordUpdateRules(), regValidate.checkPasswordData, util.handleErrors(accController.updateClientPassword))
module.exports = router;