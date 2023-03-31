const invModel = require("../models/inventory-model")
const utilities = require("../utilities")
const invCont = {}

invCont.buildByClassification = async function (req, res, next) {
    const classificationId = parseInt(req.params.classificationId)
    let data = await invModel.getVehiclesByClassificationId(classificationId)
    let nav = await utilities.getNav()
    let className = "No"
    if(data.length > 0){
    className = data[0].classification_name}
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
        data
    })

}

invCont.management = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.getClassifications()
    res.render("../views/inventory/management-view", {
        title: "Vehicle Management",
        nav,
        message: null,
        classificationSelect
    })

}

invCont.addClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("../views/inventory/add-classification-view", {
        title: "Add New Classification",
        errors: null,
        nav,
        message: null,
    })

}

invCont.addVehicle = async function (req, res, next) {
    let nav = await utilities.getNav()
    let classifications = await utilities.getClassifications(classification_id = null)
    res.render("../views/inventory/add-vehicle-view", {
        title: "Add New Vehicle",
        nav,
        errors: null,
        classifications,
        message: null,
    })

}

/* ****************************************
 *  Process classification request
 **************************************** */
invCont.registerClassification = async function (req, res) {
    const { classification_name } = req.body
  
    const regResult = await invModel.registerClassification(classification_name)
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.getClassifications()
    if (regResult) {
      res.status(201).render("inventory/management-view.ejs", {
        title: "Vehicle Management",
        nav,
        message: `The ${classification_name} classification was successfully added.`,
        errors: null,
        classificationSelect
      })
    } else {
      const message = "Sorry, it failed to add the new classification."
      res.status(501).render("inventory/add-classification-view.ejs", {
        title: "Add New Classification",
        nav,
        message,
        errors: null
      })
    }
  }

/* ****************************************
 *  Process vehicle request
 **************************************** */  
invCont.registerVehicle = async function (req, res) {
    const { inv_make, inv_model, inv_year, inv_image, inv_thumbnail, inv_description, inv_price, inv_miles, inv_color, classification_id } = req.body

    const regResult = await invModel.registerVehicle(
        inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id, inv_image, inv_thumbnail)
    let nav = await utilities.getNav()
    
    if (regResult) {
      let classificationSelect = await utilities.getClassifications()
      res.status(201).render("inventory/management-view.ejs", {
        title: "Vehicle Management",
        nav,
        message: `The ${inv_make} ${inv_model} vehicle was successfully added.`,
        errors: null,
        classificationSelect
      })
    } else {
      let classificationSelect = await utilities.getClassifications(classification_id)
      const message = "Sorry, it failed to add the new vehicle."
      res.status(501).render("inventory/add-vehicle-view.ejs", {
        title: "Add New Vehicle",
        nav,
        classificationSelect,
        message,
        errors: null
      })
    }
  }

/* ***************************
 *  Return Vehicles by Classification As JSON
 * ************************** */
invCont.getVehiclesJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  let vehicleData = await invModel.getVehiclesByClassificationId(classification_id)
  if (vehicleData[0].inv_id) {
    return res.json(vehicleData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit vehicle view
 * ************************** */
invCont.editVehicle = async (req, res, next) => {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const vehicle = await invModel.getVehiclesByInvId(inv_id)
  const vehicleData = vehicle.rows[0]
  let classifications = await utilities.getClassifications(vehicleData.classification_id)
  const vehicleName = `${vehicleData.inv_make} ${vehicleData.inv_model}`
  res.render("./inventory/edit-vehicle", {
    title: "Edit " + vehicleName,
    nav,
    classifications,
    message: null,
    errors: null,
    inv_id: vehicleData.inv_id,
    inv_make: vehicleData.inv_make,
    inv_model: vehicleData.inv_model,
    inv_year: vehicleData.inv_year,
    inv_description: vehicleData.inv_description,
    inv_image: vehicleData.inv_image,
    inv_thumbnail: vehicleData.inv_thumbnail,
    inv_price: vehicleData.inv_price,
    inv_miles: vehicleData.inv_miles,
    inv_color: vehicleData.inv_color,
    classification_id: vehicleData.classification_id
  })
}


/* ***************************
 *  Update Vehicle Data
 * ************************** */
invCont.updateVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

  const updateResult = await invModel.updateVehicle(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const vehicleName = updateResult.rows[0].inv_make + " " + updateResult.rows[0].inv_model
    let classificationSelect = await utilities.getClassifications()
    res.status(201).render("inventory/management-view", {
      title: "Vehicle Management",
      nav,
      message: `The ${vehicleName} was successfully updated.`,
      errors: null,
      classificationSelect
    })
  } else {
    const classifications = await utilities.getClassifications(classification_id)
    const vehicleName = `${inv_make} ${inv_model}`
    res.status(501).render("inventory/edit-vehicle", {
    title: "Edit " + vehicleName,
    nav,
    classifications,
    message: "Sorry, the update failed.",
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Confirm Deletion of Vehicle
 * ************************** */
invCont.confirmRemovalVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.params.inv_id)
  const data = await invModel.getVehiclesByInvId(inv_id)
  const result = data.rows[0]
  
  if (result) {
    const vehicleName = result.inv_make + " " + result.inv_model
    res.status(201).render("inventory/delete-confirm", {
      title: "Delete " + vehicleName,
      nav,
      message: `Please confirm deletion for ${vehicleName}`,
      errors: null,
      inv_id: result.inv_id,
      inv_make: result.inv_make,
      inv_model: result.inv_model,
      inv_year: result.inv_year,
      inv_price: result.inv_price,
    })
  } else {
    const classificationSelect = await utilities.getClassifications()
    res.status(501).render("inventory/management-view", {
    title: "Vehicle Management",
    nav,
    classificationSelect,
    message: "Sorry, that vehicle doesn't exist.",
    errors: null
    })
  }
}

/* ***************************
 *  Delete Vehicle Data
 * ************************** */
invCont.deleteVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_price,
    inv_year,
    classification_id,
  } = req.body
  const deleteResult = await invModel.deleteVehicle(inv_id)
  const vehicleName = inv_make + " " + inv_model
  if (deleteResult) {
    let classificationSelect = await utilities.getClassifications()
    res.status(201).render("inventory/management-view", {
      title: "Vehicle Management",
      nav,
      message: `The ${vehicleName} was successfully deleted.`,
      errors: null,
      classificationSelect
    })
  } else {
    res.status(501).render("inventory/delete-confirm", {
    title: "Delete" + vehicleName,
    nav,
    message: "Sorry, the deletion failed for " + vehicleName,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price
    })
  }
}

module.exports = invCont;