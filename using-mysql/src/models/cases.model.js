const Connection = require('../database/connection')

//Constructor
const Cases = function(cases) {
    this.country = cases.country;
    this.confirmed = cases.confirmed;
    this.deaths = cases.deaths;
    this.recovered = cases.recovered;
    this.observationDate = cases.observationDate;
};

Cases.massInsert = async (cases, result) => {
    for (let i = 0; i < cases.length; i++) {
        try {
            let datearray = cases[i].ObservationDate.split("/");
            let newdate = datearray[2] + '-' + datearray[0] + '-' + datearray[1];
            const query = `INSERT INTO covid_observations (country, confirmed, deaths, recovered, observationDate)` + 
                      ` VALUES` +
                      `('${cases[i]['Country/Region']}', '${cases[i].Confirmed}', '${cases[i].Deaths}', '${cases[i].Recovered}', '${newdate}')`;
            queryDetails = await Connection(query);
        } catch (error) {
            console.log(error);
            return true
        }
    }
    return false;
};

Cases.retrieve = async (params, result) => {
    try{         
        let query = `SELECT country, SUM(confirmed) AS 'confirmed', SUM(deaths) as 'deaths', SUM(recovered) as 'recovered' 
                    FROM covid_observations 
                    WHERE observationDate='${params.obDate}' GROUP BY country LIMIT ${params.maxRes}`;
        result(false, await Connection(query));
        return;
    }catch(ex){
        console.log(ex);
        return true;
    }
};

module.exports = Cases;