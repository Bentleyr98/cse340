const pool = require("../database")

// Register new Client
async function registerClient (
    client_firstname,
    client_lastname,
    client_email,
    client_password
) {
    try {
        const sql = 
            "INSERT INTO client (client_firstname, client_lastname, client_email, client_password, client_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
            return await pool.query(sql, [
                client_firstname,
                client_lastname,
                client_email,
                client_password
            ])
    }

    catch (error) {
        return error.message
    }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(client_email){
    try {
      const sql = 'SELECT * FROM client WHERE client_email = $1'
      const email = await pool.query(sql, [client_email])
      return email.rowCount
    } catch (error) {
      return error.message
    }
  }

async function checkExistingPassword(client_password){
    try {
      const sql = 'SELECT * FROM client WHERE client_password = $1'
      const password = await pool.query(sql, [client_password])
      return password.rowCount
    } catch (error) {
      console.log("ERROR!")
      console.log(error.message)
      return error.message
    } 
  }

module.exports = { registerClient, checkExistingEmail, checkExistingPassword }