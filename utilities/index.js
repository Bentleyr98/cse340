const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

// Constructs the nav HTML unordered list
Util.buildNav = function (data) {
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

// Builds the navigation bar
// This builds the site nav
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    nav = Util.buildNav(data)
    return nav
}

// builds html for individual vehicle detail view
Util.buildVehicle = async function (data) {
    let view =  `
    <div class="inv-detail">
    <img src="${data.rows[0].inv_image}" alt="Image of ${data.rows[0].inv_make + "" + data.rows[0].inv_model}"/>
    <div class="details">
    <p><span class="bold">Price:</span> $${new Intl.NumberFormat('en-US').format(data.rows[0].inv_price)}</p>
    <p><span class="bold">Color:</span> ${data.rows[0].inv_color}</p>
    <p><span class="bold">Miles:</span> ${new Intl.NumberFormat('en-US').format(data.rows[0].inv_miles)}</p>
    <hr />
    <p><span class="bold">Description:</span> ${data.rows[0].inv_description}</p></div></div>`
    return view
}

Util.buildClassificationDropDown = function (data, classification_id = null) {
    let list = "<select id='classificationList' name='classification_id' required>"
    list += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
        list += "<option value='" + row.classification_id + "'"
        if (classification_id != null && row.classification_id == classification_id){
            list += " selected "
        }
        list += ">" + row.classification_name + "</option>"
    })
    list += "</select>"
    return list
}

Util.getClassifications = async function (classification_id) {
    let data = await invModel.getClassifications()
    classifications = Util.buildClassificationDropDown(data, classification_id)
    return classifications
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, clientData) {
        if (err) {
          res.clearCookie("jwt")
          return res.redirect("/client/login")
        }
      res.locals.clientData = clientData
      res.locals.loggedin = 1
      if (res.locals.clientData.client_type == "Employee" || res.locals.clientData.client_type == "Admin"){
        res.locals.clientClearance = 1
    } else {
        res.locals.clientClearance = 0
        }
    next()
      })
  } else {
    next()
  }
}


  /* ****************************************
 *  Authorize JWT Token
 * ************************************ */
 Util.jwtAuth = (req, res, next) => {
  if(res.locals.clientData){
    if (res.locals.clientClearance){
      next()
  } else {
      return res.redirect("/client/login")
      }}
  else{
    return res.redirect("/client/login")
  }
}

// Middleware to check for client login
Util.checkClientLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    return res.redirect("/client/login")
  }
}


  /* ****************************************
 *  Delete JWT Token
 * ************************************ */
  Util.deleteJwt= (req, res, next) => {
    if(req.cookies.jwt){
      res.clearCookie("jwt", { httpOnly: true })
      return res.status(403).redirect("/")
    } else {
      next()
    }
   }

module.exports = Util