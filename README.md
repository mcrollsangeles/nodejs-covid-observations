Packages to install:
What to install:
npm init -y
npm install --save express
npm install pg 
npm install csv-parser  //csv file reader
npm install async       //for bulk insert of CSV data
npm install -g nodemon

To start the application, run this command:
nodemon server.js

//CREATE DB in PSQL CL
CREATE DATABASE observations;

//CREATE TABLE
CREATE TABLE covid_observations(
ID SERIAL PRIMARY KEY,
country VARCHAR(50),
confirmed INT
recovered INT,
deaths INT,
observation_date DATE);

ALL API endpoints are saved in the collection in resources folder.
The  DB config is on database.js file.