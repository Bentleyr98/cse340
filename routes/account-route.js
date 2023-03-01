const express = require("express"); 
const router = new express.Router(); 
const util = require("../utilities")
const accController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation')

router.get("/login", accController.buildLogin);
router.get("/register", accController.buildRegister);

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
    (req, res) => {
        res.status(200).send('login process')
      }
  )

  
module.exports = router;