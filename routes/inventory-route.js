// Needed Resources 
const express = require("express"); 
const router = new express.Router();
const util = require("../utilities");
const invController = require("../controllers/invController");
const regValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassification);
// Route to build inventory by vehicle view
router.get("/detail/:inv_id", invController.buildByVehicleID);


//manage
router.get("/", util.jwtAuth, invController.management);

router.get("/add-classification", util.jwtAuth, invController.addClassification);
router.post("/add-classification", util.jwtAuth, regValidate.classificationRules(), regValidate.checkClassData ,invController.registerClassification);

router.get("/add-vehicle", util.jwtAuth, invController.addVehicle);
router.post("/add-vehicle", util.jwtAuth, regValidate.vehicleRules(), regValidate.checkVehicleData ,invController.registerVehicle);

module.exports = router;