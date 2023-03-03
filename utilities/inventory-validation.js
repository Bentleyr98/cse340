const utilities = require("./")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
      // firstname is required and must be string
      body("classification_name")
        .trim()
        .escape()
        .isLength({ min: 3 })
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


  validate.vehicleRules = () => {
    return [
      // valid make is required
      body("inv_make")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage("A valid make is required."),

      // valid model is required
      body("inv_model")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage("A valid model is required."),

      // valid year is required
      body("inv_year")
      .trim()
      .escape()
      .isLength({ min: 4 })
      .isNumeric()
      .withMessage("A valid year is required."),

      // valid description is required
      body("inv_description")
      .trim()
      .escape()
      .isLength({ min: 20 })
      .withMessage("A valid description is required."),

      // valid price is required
      body("inv_price")
      .trim()
      .escape()
      .isDecimal()
      .isLength({ min: 2 })
      .withMessage("A valid price is required."),

      // valid miles is required
      body("inv_miles")
      .trim()
      .escape()
      .isDecimal()
      .isLength({ min: 1 })
      .withMessage("A valid milage is required."),

      // valid color is required
      body("inv_color")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage("A valid color is required."),
  
      // classification is required and must be strong password
      body("classification_id")
        .trim()
        .escape()
        .custom(async (classification_id) => {
            const classificationExists = await invModel.checkExistingClassification(classification_id)
            if (classificationExists){
              throw new Error("Classification doesn't exist")
            }
          })
    ]
  }

    // Check data and return errors or continue to login
    validate.checkVehicleData = async (req, res, next) => {
        const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color } = req.body
        let errors = []
        errors = validationResult (req)
        if (!errors.isEmpty()){
            let nav = await utilities.getNav()
            let classifications = await utilities.getClassifications(classification_id)
            res.render("../views/inventory/add-vehicle-view", {
                errors,
                message: null,
                title: "Login",
                nav,
                classifications,
                inv_make,
                inv_model,
                inv_year,
                inv_description,
                inv_price,
                inv_miles,
                inv_color
            })
            return
        }
        next()
      }

  module.exports = validate;
