const pool = require("../database")

async function getClassifications(){
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
};

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

module.exports = {getClassifications, getVehiclesByClassificationId, getVehiclesByInvId, registerClassification};