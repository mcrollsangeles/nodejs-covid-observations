module.exports = app => {
    const cases = require("../controllers/cases.controller.js");
    var router = require("express").Router();
    router.get("/", cases.loadCSV);
    router.get("/top/confirmed", cases.topConfirmed);
    app.use('/covid-res', router);
};