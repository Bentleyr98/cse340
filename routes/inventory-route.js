// Needed Resources 
const express = require("express"); 
const router = new express.Router();
const util = require("../utilities");
const invController = require("../controllers/invController");
const regValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", util.handleErrors(invController.buildByClassification));
// Route to build inventory by vehicle view
router.get("/detail/:inv_id", util.handleErrors(invController.buildByVehicleID));


//manage
router.get("/", util.jwtAuth, util.handleErrors(invController.management));

router.get("/add-classification", util.jwtAuth, util.handleErrors(invController.addClassification));
router.post("/add-classification", util.jwtAuth, regValidate.classificationRules(), regValidate.checkClassData, util.handleErrors(invController.registerClassification));

router.get("/add-vehicle", util.jwtAuth, util.handleErrors(invController.addVehicle));
router.post("/add-vehicle", util.jwtAuth, regValidate.vehicleRules(), regValidate.checkVehicleData, util.handleErrors(invController.registerVehicle));

router.get("/getVehicles/:classification_id", util.handleErrors(invController.getVehiclesJSON))

// route to edit existing vehicles
router.get("/edit/:inv_id", util.handleErrors(invController.editVehicle))

// route to post updates for vehicles
router.post("/update/", regValidate.vehicleRules(), regValidate.checkUpdateData, util.handleErrors(invController.updateVehicle))

// route to delete existing vehicles
router.get("/delete/:inv_id", util.handleErrors(invController.confirmRemovalVehicle))

// route to post deletes for vehicles
router.post("/delete/", util.handleErrors(invController.deleteVehicle))

module.exports = router;