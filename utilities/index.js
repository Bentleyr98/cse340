const invModel = require("../models/inventory-model")
const Util = {}

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

Util.buildClassificationDropDown = function (data) {
    let list = "<select id='classificationId' name='classification_id' required>"
    list += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
        list += "<option value='" + row.classification_id + "'>"
        list += row.classification_name
        list += "</option>"
    })
    list += "</select>"
    return list
}

Util.getClassifications = async function (req, res, next) {
    let data = await invModel.getClassifications()
    classifications = Util.buildClassificationDropDown(data)
    return classifications
}

module.exports = Util