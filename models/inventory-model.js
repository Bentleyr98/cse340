const pool = require("../database")

async function getClassifications(){
    try {
        return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
    }
    catch(error){
        console.error('getclassifications error' + error)
    }
}

async function checkExistingClassification(classification_name){
    try {
        const data = await pool.query("SELECT * FROM public.classification WHERE classification_name = $1",
        [classification_name])
        return data.rowcount
    }
    catch(error){
        console.error('create classification error' + error)
    }
}

async function getVehiclesByClassificationId(classificationId){
    try {
        const data = await pool.query("SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.classification_id = $1",
        [classificationId])
        return data.rows
    }
    catch(error){
        console.error('getclassificationsbyid error' + error)
    }
}

async function getVehiclesByInvId(vehicleId){
    try {
        const data = await pool.query("SELECT * FROM public.inventory AS i WHERE i.inv_id = $1", [vehicleId])
        return data
    }
    catch(error){
        console.error('getvehiclesbyid error' + error)
    }
}


async function registerClassification( classification_name ){
    try {
        const sql = 
            "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
            return await pool.query(sql, [
                classification_name
            ])
    }

    catch (error) {
        return error.message
    }
}

async function registerVehicle( inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id, inv_image, inv_thumbnail ){
    try {
        const sql = 
            "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id, inv_image, inv_thumbnail) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
            return await pool.query(sql, [
                inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id, inv_image, inv_thumbnail
            ])
    }

    catch (error) {
        return error.message
    }
}

/* ***************************
 *  Update Vehicle Data
 * ************************** */
async function updateVehicle(
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
  ) {
    try {
      const sql =
        "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
      const data = await pool.query(sql, [
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
        inv_id
      ])
      return data
    } catch (error) {
      console.error("model error: " + error)
    }
  }

  /* ***************************
 * Delete Vehicle Data
 * ************************** */
async function deleteVehicle(inv_id) {
    try {
      const sql = "DELETE FROM inventory WHERE inv_id = $1"
      return await pool.query(sql, [inv_id])
    } catch (error) {
      console.error("model error: " + error)
    }
  }

module.exports = {getClassifications, getVehiclesByClassificationId, getVehiclesByInvId, registerClassification, registerVehicle, checkExistingClassification, updateVehicle, deleteVehicle};