// Needed Resources 
const express = require("express"); 
const router = new express.Router(); 
const invController = require("../controllers/invController");
const regValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassification);
// Route to build inventory by vehicle view
router.get("/detail/:inv_id", invController.buildByVehicleID);


//manage
router.get("/", invController.management);

router.get("/add-classification", invController.addClassification);
router.post("/add-classification", regValidate.classificationRules(), regValidate.checkClassData ,invController.registerClassification);
router.get("/add-vehicle", invController.addVehicle);
router.post("/add-vehicle", regValidate.vehicleRules(), regValidate.checkVehicleData ,invController.registerVehicle);

module.exports = router;