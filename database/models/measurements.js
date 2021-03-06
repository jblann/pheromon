'use strict';

require('es6-shim');
var sql = require('sql');
sql.setDialect('postgres');
var databaseP = require('../management/databaseClientP');

var measurements = require('../management/declarations.js').measurements;

module.exports = {
    create: function (data) {
        return databaseP.then(function (db) {

        var cloneData = Object.assign({}, data);

        cloneData.value = JSON.stringify(cloneData.value);

            var query = measurements
                .insert(cloneData)
                .returning('*')
                .toQuery();

            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);
                    else {
                        resolve(result.rows[0]);
                    }
                });
            });
        });
    },

    // Delete all measurements of a sensor.
    deleteBySim: function(sim) {
        return databaseP.then(function (db) {

            var query = measurements
                .delete()
                .where(measurements.sensor_sim.equals(sim))
                .returning('*')
                .toQuery();

            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);
                    else resolve(result.rows[0]);
                });
            });
        })
        .catch(function(err){
            console.log('ERROR in delete measurements', err);
        });
    },


    deleteAll: function() {
        return databaseP.then(function (db) {

            var query = measurements
                .delete()
                .returning('*')
                .toQuery();

            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);
                    else resolve(result.rows);
                });
            });
        })
        .catch(function(err){
            console.log('ERROR in deleteAll measurements', err);
        });
    }
};
