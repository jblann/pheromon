"use strict";

module.exports = function(request, origin){

    var origin = origin || '';

    return {
        // SENSORS
        createSensor: function(data){
            return request('POST', origin + '/sensor/create', data);
        },
        updateSensor: function(data){
            return request('POST', origin + '/sensor/update', data);
        },
        deleteSensor: function(id){
            return request('DELETE', origin + '/sensor/delete/' + id);
        },
        deleteAllSensors: function(){
            return request('DELETE', origin + '/sensor/deleteAll');
        },
        getSensor: function(id){
            return request('GET', origin + '/sensor/get/' + id);
        },
        getAllSensors: function(){
            return request('GET', origin + '/sensor/getAll');
        },

        // PLACES
        createPlace: function(data){
            return request('POST', origin + '/place/create', data);
        },
        updatePlace: function(data){
            return request('POST', origin + '/place/update', data);
        },
        deletePlace: function(id){
            return request('DELETE', origin + '/place/delete/' + id);
        },
        deleteAllPlaces: function(){
            return request('DELETE', origin + '/place/deleteAll');
        },
        getPlace: function(id){
            return request('GET', origin + '/place/get/' + id);
        },
        getAllPlaces: function(){
            return request('GET', origin + '/place/getAll');
        },
        
        // TO UPDATE
        getLiveAffluence: function(){
            return request('GET', '/currentAffluence');
        },
        getPlaceMeasurements: function(id){
            return request('GET', '/measurements/get/:placeId' + id);
        },
        getAllPlacesInfos: function(){
            return request('GET', '/allPlacesInfos');
        }
    };
};




