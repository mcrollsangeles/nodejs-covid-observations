const Cases = require("../models/cases.model.js");

exports.loadCSV = (req, res) => {
    const csv = require('csv-parser')
    const fs = require('fs')
    const results = [];
    
    fs.createReadStream('../nodejs-covid-observations/src/resources/covid_19_data.csv')
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        Cases.massInsert(results, (err, data) => {
            if (err) {
                res.status(404)
                   .send({
                        message: 'An error occured'
                    });
            } else{
                res.status(200)
                   .send({
                        message: 'Covid Data has been insrted'
                    });
            }
        });
      });
}

/* Retrieving one or all user */ 
exports.topConfirmed = async (req, res) => {
    let date = new Date(req.query.observation_date);
    if(!(date instanceof Date && !isNaN(date.valueOf()))){
        res.status(200)
           .send({
                message: "Invalid date"
            });
    }

    let params = {
        obDate: req.query.observation_date,
        maxRes: (req.query.max_result) ? req.query.max_result : 1
    };

    Cases.retrieve(params, (err, data) => {
        if (err) {
            res.status(500)
               .send({
                    message: err.message || "An error occured while retrieving cases."
                });
        }
        else{
            if(data && data.length > 0){
                res.status(200)
                   .send({
                        "observation_date": params.obDate,
                        "countries": data
                   });
            }else{
                res.status(200)
                   .send({
                        message: "No cases found."
                    });
            }
            
        } 
    });
};