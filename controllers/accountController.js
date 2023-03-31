const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ****************************************
*  Deliver login view
**************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("clients/login", {
      title: "Login",
      nav,
      errors: null,
      message: null,
    })
  }


/* ****************************************
*  Deliver registration view
**************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("clients/register", {
    title: "Register",
    nav,
    errors: null,
    message: null,
  })
}


/* ****************************************
 *  Process registration request
 **************************************** */
async function registerClient(req, res) {
  let nav = await utilities.getNav()
  const { client_firstname, client_lastname, client_email, client_password } = req.body
    // Hash the password before storing
  let hashedPassword
  try {
    // pass regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(client_password, 10)
  } catch (error) {
    res.status(500).render("clients/register", {
      title: "Registration",
      nav,
      message: 'Sorry, there was an error processing the registration.',
      errors: null,
    })
  }

  const regResult = await accountModel.registerClient(
    client_firstname,
    client_lastname,
    client_email,
    hashedPassword
  )

  if (regResult) {
    res.status(201).render("clients/login.ejs", {
      title: "Login",
      nav,
      message: `Congratulations, you\'re registered ${client_firstname}. Please log in.`,
      errors: null,
    })
  } else {
    const message = "Sorry, the registration failed."
    res.status(501).render("clients/register.ejs", {
      title: "Registration",
      nav,
      message,
      errors: null,
    })
  }
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function loginClient(req, res) {
  let nav = await utilities.getNav()
  const { client_email, client_password } = req.body
  const clientData = await accountModel.getClientByEmail(client_email)
  if (!clientData) {
    const message = "Please check your credentials and try again."
    res.status(400).render("clients/login", {
      title: "Login",
      nav,
      message,
      errors: null,
      client_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(client_password, clientData.client_password)) {
      delete clientData.client_password
      const accessToken = jwt.sign(clientData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      res.cookie("jwt", accessToken, { httpOnly: true })
      return res.redirect("/client/")
    }
  } catch (error) {
    return res.status(403).send('Access Forbidden')
  }
}


/* ****************************************
*  Deliver account view
**************************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("clients/account", {
    title: "Account Management",
    nav,
    errors: null,
    message: null,
  })
}

/* ****************************************
*  Deliver account update view
**************************************** */
async function updateClient(req, res, next) {
  const client_id = parseInt(req.params.client_id)
  let nav = await utilities.getNav()
  const clientData = await accountModel.getClientById(client_id)
  if (clientData) {
    res.render("clients/update-account", {
      title: "Edit Account",
      nav,
      errors: null,
      message: null,
      client_id: clientData.client_id,
      client_email: clientData.client_email,
      client_firstname: clientData.client_firstname,
      client_lastname: clientData.client_lastname
    })
  } else{
    const message = "Please check your credentials and try again."
    res.status(400).render("clients/login", {
      title: "Login",
      nav,
      message,
      errors: null
    })
  }

}

/* ****************************************
 *  Process update request
 **************************************** */
async function updateClientInfo(req, res, next) {
  let nav = await utilities.getNav()
  const { client_firstname, client_lastname, client_email, client_id } = req.body
  const updateResult = await accountModel.updateClientInfo(
    client_firstname,
    client_lastname,
    client_email,
    client_id
  )

  if (updateResult) {
    utilities.deleteJwt
    const clientData = await accountModel.getClientByEmail(client_email)
    const accessToken = jwt.sign(clientData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    res.cookie("jwt", accessToken, { httpOnly: true })  
    res.status(201).redirect("/client/")
  } else {
    const message = "Sorry, the update failed."
    res.status(501).render("clients/update-account", {
      title: "Edit Account",
      nav,
      message,
      errors: null,
    })
  }
}


/* ****************************************
 *  Process password change request
 **************************************** */
async function updateClientPassword(req, res) {
  let nav = await utilities.getNav()
  const { client_firstname, client_lastname, client_email, client_password, client_id} = req.body
  // Hash the password before storing
  let hashedPassword
  try {
    // pass regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(client_password, 10)
  } catch (error) {
    res.status(500).render("clients/update-account", {
      title: "Edit Account",
      nav,
      message: 'Sorry, there was an error processing the registration.',
      errors: null,
      client_email,
      client_firstname,
      client_lastname,
      client_id
    })
  }

  const passwordResult = await accountModel.updateClientPassword( hashedPassword, client_id)
  const clientData = await accountModel.getClientById(client_id)

  if (passwordResult) {
    res.status(201).render("clients/account", {
      title: "Account Management",
      nav,
      message: `You've successfully changed your password. Please log out and log back in.`,
      errors: null,
      client_email: clientData.client_email,
      client_firstname: clientData.client_firstname,
      client_id: clientData.client_id,
      client_lastname: clientData.client_lastname
    })
  } else {
    const message = "Sorry, the password change failed."
    res.status(501).render("clients/update-account", {
      title: "Edit Account",
      nav,
      message,
      errors: null,
      client_email: clientData.client_email,
      client_firstname: clientData.client_firstname,
      client_id: clientData.client_id,
      client_lastname: clientData.client_lastname
    })
  }
}


module.exports = { buildLogin, buildRegister, registerClient, loginClient, buildManagement, updateClient, updateClientInfo, updateClientPassword }
