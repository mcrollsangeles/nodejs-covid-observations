const { exit } = require('process');
const pool = require('../../database');
const queries = require('./observations.queries');

const getAllData = (req, res) => {
    pool.query(queries.getAllData, (error, results) => {
        if(error) throw error;
        res.status(200).json(results.rows);
    });
};

const loadCSV = (req, res) => {
    const csv = require('csv-parser');
    const fs = require('fs');
    const async = require('async');
    const results = [];
    //read CSV file to load
    fs.createReadStream('././resources/covid_19_data.csv')
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        //use async library to prevent memory overload of insert queries
        async.each(results, bulkInsert, function(err) {
            done();
            if (err) {
                res.status(500).send({ message: "An error occured."});
            }
        })
        res.status(201).send({ message: "CSV data has been inserted."});
    });
}

function bulkInsert(data){
    const datearray = data.ObservationDate.split("/");
    const newdate = datearray[2] + '-' + datearray[0] + '-' + datearray[1];
    pool.query('INSERT INTO covid_observations (country, confirmed, recovered, deaths, observation_date) VALUES ($1, $2, $3, $4, $5)', [
                data['Country/Region'], parseInt(data.Confirmed), parseInt(data.Recovered), parseInt(data.Deaths), newdate])
}

const topConfirmed = (req, res) => {
    const date = new Date(req.query.observation_date);
    if(!(date instanceof Date && !isNaN(date.valueOf()))){
        res.status(400).send({ message: "Date not valid."});
        return;
    }

    const obDate = req.query.observation_date,
          maxRes = (req.query.max_result) ? req.query.max_result : 1;
    // if(maxRes == 0)
    //     maxRes = 1;
    pool.query(queries.getTopConfirmed, [obDate, maxRes], (error, results) => {
        if(error) throw error;
        res.status(200).send({
                observation_date: obDate,
                countries: results.rows
        });
    });
}

const create = (req, res) => {
    if (!req.body || !req.body.country || !req.body.confirmed 
        || !req.body.recovered  || !req.body.deaths || !req.body.observation_date) {
        res.status(400).send({
            message: "Required field/s: country, confirmed, recovered, deaths, observation_date"
        });
        return;
    }
    //can add more validation if values are in correct format
    const { country, confirmed, recovered, deaths, observation_date } = req.body; 
    pool.query(queries.create, [country, confirmed, recovered, deaths, observation_date], (error, results) => {
        if(error) throw error;
        res.status(200).send({ message: "Record has been created successfully" });
    }); 
}

const update = (req, res) => {
    if(!req.params.id){
        res.status(400).send({ message: "ID not found" });
    }
    if (!req.body || !req.body.country || !req.body.confirmed 
        || !req.body.recovered  || !req.body.deaths || !req.body.observation_date) {
        res.status(400).send({
            message: "Required field/s: country, confirmed, recovered, deaths, observation_date"
        });
        return;
    }
    const id = parseInt(req.params.id);
    const { country, confirmed, recovered, deaths, observation_date } = req.body; 
    
    //check if id exists
    pool.query(queries.getDataByID, [id], (error, results) => {
        const noRecordsFound = !results.rows.length;
        if(noRecordsFound){
            res.status(400).send({ message: "Record does not exist."});
            return;
        }

        // update record
        pool.query(queries.update, [id, country, confirmed, recovered, deaths, observation_date], (error, results) => {
            if(error) throw error;
            res.status(200).send({ message:"Record has been updated successfully."});
        });
   });
};

const remove = (req, res) => {
    const id = parseInt(req.params.id);
    
    //check if id exists
    pool.query(queries.getDataByID, [id], (error, results) => {
        const noRecordsFound = !results.rows.length;
        if(noRecordsFound){
            res.status(400).send({ message: "Record does not exist."});
            return;
        }

        pool.query(queries.remove, [id], (error, results) => {
            if(error) throw error;
            res.status(200).send({ message: "Record has been deleted." });
        });
   });
};

module.exports = {
    getAllData,
    loadCSV,
    topConfirmed,
    create,
    update,
    remove
};