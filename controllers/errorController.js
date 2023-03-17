const utilities = require("../utilities")
const errorController = {}

errorController.getError = async function (req, res) {
    const nav = await utilities.getNav(myerror)
    res.render("errors/error-view.ejs", 
    { 
        title: "ERROR ERROR!", 
        nav,
        message: null
    })
}

module.exports = errorController