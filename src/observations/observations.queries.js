const getAllData = 'SELECT * FROM covid_observations';
const getDataByID = 'SELECT * FROM covid_observations WHERE id=$1';
const create = 'INSERT INTO covid_observations (country, confirmed, recovered, deaths, observation_date) VALUES ($1, $2, $3, $4, $5)';
const remove = 'DELETE FROM covid_observations WHERE id=$1';
const update = 'UPDATE covid_observations SET country=$2, confirmed=$3, recovered=$4, deaths=$5, observation_date=$6 WHERE id=$1';
const getTopConfirmed = 'SELECT country, SUM(confirmed) AS confirmed, SUM(deaths) as deaths, SUM(recovered) as recovered FROM covid_observations WHERE observation_date=$1 GROUP BY country LIMIT $2';

module.exports = {
    getAllData,
    getTopConfirmed,
    create,
    getDataByID,
    update,
    remove
};