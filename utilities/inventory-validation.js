const utilities = require("./")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/account-model")

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
      // firstname is required and must be string
      body("classification_name")
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage("Please provide a valid classification.")
        .custom(async (classification_name) => {
            const classExists = await invModel.checkExistingClassification(classification_name)
            if (classExists){
              throw new Error("Classification already exists.")
            }
          }) // on error this message is sent.
    ]
  }

  // Check data and return errors or continue to registration
  validate.checkClassData = async (req, res, next) => {
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()){
        let nav = await utilities.getNav()
        res.render("../views/inventory/add-classification-view", {
            errors,
            message: null,
            title: "Add Classification",
            nav
        })
        return
    }
    next()
  }


  validate.loginRules = () => {
    return [
      // valid email is required and has to already exist in the DB
      body("client_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (client_email) => {
        const emailExists = await accountModel.checkExistingEmail(client_email)
        if (!emailExists){
          throw new Error("Email doesn't exist in our system. Please create an account or use a different email")
        }
      }),
  
      // password is required and must be strong password
      body("client_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements.")
        .custom(async (client_email, client_password) => {
            const passwordExists = await accountModel.checkExistingPassword(client_password)
            console.log(passwordExists)
            if (!passwordExists){
              throw new Error("Incorrect password, please try again.")
            }
          })
    ]
  }

    // Check data and return errors or continue to login
    validate.checkLoginData = async (req, res, next) => {
        const { client_email } = req.body
        let errors = []
        errors = validationResult (req)
        if (!errors.isEmpty()){
            let nav = await utilities.getNav()
            res.render("../views/clients/login", {
                errors,
                message: null,
                title: "Login",
                nav,
                client_email,
            })
            return
        }
        next()
      }

  module.exports = validate;
