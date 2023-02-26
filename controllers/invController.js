const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

invCont.buildByClassification = async function (req, res, next) {
    const classificationId = req.params.classificationId
    let data = await invModel.getVehiclesByClassificationId(classificationId)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification-view", {
        title: className + " vehicles",
        nav,
        message: null,
        data,
    })
}

invCont.buildByVehicleID = async function (req, res, next) {
    const vehicleId = req.params.inv_id
    let data = await invModel.getVehiclesByInvId(vehicleId)
    let nav = await utilities.getNav()
    let view = await utilities.buildVehicle(data);
    const vehicleMake = data.rows[0].inv_make
    const vehicleModel = data.rows[0].inv_model  
    res.render("../views/inventory/vehicle-detail", {
        title: vehicleMake + " " + vehicleModel,
        view,
        nav,
        message: null,
        data,
    })

}

invCont.management = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("../views/inventory/management-view", {
        title: "Vehicle Management",
        nav,
        message: null,
    })

}

invCont.addClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("../views/inventory/add-classification-view", {
        title: "Add New Classification",
        nav,
        message: null,
    })

}

invCont.addVehicle = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("../views/inventory/add-vehicle-view", {
        title: "Add New Vehicle",
        nav,
        message: null,
    })

}

/* ****************************************
 *  Process classification request
 **************************************** */
invCont.registerClassification = async function (req, res) {
    let nav = await utilities.getNav()
    const { classification_name } =
      req.body
  
    const regResult = await invModel.registerClassification(
        classification_name
    )
    console.log(regResult)
    if (regResult) {
      res.status(201).render("inventory/management-view.ejs", {
        title: "Vehicle Management",
        nav,
        message: `The ${classification_name} classification was successfully added.`,
        errors: null,
      })
    } else {
      const message = "Sorry, it failed to add the new classification."
      res.status(501).render("inventory/add-classification-view.ejs", {
        title: "Add New Classification",
        nav,
        message,
        errors: null,
      })
    }
  }

/* ****************************************
 *  Process vehicle request
 **************************************** */  
invCont.registerVehicle = async function (req, res) {
    let nav = await utilities.getNav()
    return nav
  }

module.exports = invCont;