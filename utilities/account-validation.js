const utilities = require("./")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
  return [
    // firstname is required and must be string
    body("client_firstname")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    // lastname is required and must be string
    body("client_lastname")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a last name."),

    // valid email is required and cannot already exist in the DB
    body("client_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (client_email) => {
        const emailExists = await accountModel.checkExistingEmail(client_email)
        if (emailExists) {
          throw new Error("Email exists. Please login or use a different email")
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
      .withMessage("Password does not meet requirements."),
  ]
}

// Check data and return errors or continue to registration
validate.checkRegData = async (req, res, next) => {
  const { client_firstname, client_lastname, client_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("../views/clients/register", {
      errors,
      message: null,
      title: "Registration",
      nav,
      client_firstname,
      client_lastname,
      client_email,
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
        if (!emailExists) {
          throw new Error(
            "Email doesn't exist in our system. Please create an account or use a different email"
          )
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
  ]
}

// Check data and return errors or continue to login
validate.checkLoginData = async (req, res, next) => {
  const { client_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
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


/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.updateInfoRules = () => {
  return [
    // firstname is required and must be string
    body("client_firstname")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    // lastname is required and must be string
    body("client_lastname")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a last name."),

    // valid email is required and cannot already exist in the DB
    body("client_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (client_email, {req}) => {
        const emailExists = await accountModel.checkExistingEmail(client_email)
        const email = req.body.client_email
        if (emailExists & (email != client_email)) {
          throw new Error("Email address is already in our system. Please use a different email.")
        }
      })
  ]
}

// Check data and return errors or continue to update information
validate.checkUpdateData = async (req, res, next) => {
  const { client_firstname, client_lastname, client_email, client_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("../views/clients/update-account", {
      errors,
      message: null,
      title: "Edit Account",
      nav,
      client_firstname,
      client_lastname,
      client_email,
      client_id
    })
    return
  }
  next()
}


validate.passwordUpdateRules = () => {
  return [
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
  ]
}

// Check data and return errors or continue to update password
validate.checkPasswordData = async (req, res, next) => {
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("../views/clients/update-account", {
      errors,
      message: null,
      title: "Edit Account",
      nav,
      client_firstname: res.locals.clientData.client_firstname,
      client_lastname: res.locals.clientData.client_lastname,
      client_email: res.locals.clientData.client_email,
      client_id: res.locals.clientData.client_id
    })
    return
  }
  next()
}

module.exports = validate
