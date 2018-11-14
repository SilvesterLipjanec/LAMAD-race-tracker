var ROUTE = './trajectories/route.txt';
var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });
    drawRoutePolyline(ROUTE);
}

function loadTrajectory(routeFile,callback){
    var destRouteArr = [];
    $.get(routeFile,function(txt){
        var posArr  = txt.split("\n");
        for (i = 0 ; i < posArr.length ; i++){
            var tr = posArr[i].split(/\s+/);
            var lat = parseFloat(tr[0]);
            var lng = parseFloat(tr[1]);
            var timestamp = parseInt(tr[2]);
            if(!isNaN(lat) && !isNaN(lng) && !isNaN(timestamp)){ //lat,lng,timestamp are numbers
                var position = {lat, lng};   
                destRouteArr.push({position, timestamp});
            }            
        }
        callback(destRouteArr);   
    });    
}
function drawRoutePolyline(routeFile){
    loadTrajectory(routeFile,function(routeArr){
        let coordinates = routeArr.map(a => a.position);
        var routePoly = new google.maps.Polyline({
            path: coordinates,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        routePoly.setMap(map);
        map.setCenter(coordinates[0]);
    });    
}


function calculateDistance(lat1, lon1, lat2, lon2) {
    var R = 6371e3; // meter
    var fi1 = deg2rad(lat1);
    var fi2 = deg2rad(lat2);
    var deltafi = deg2rad(lat2 - lat1);
    var deltalambda = deg2rad(lon2 - lon1);

    var a = Math.sin(deltafi / 2) * Math.sin(deltafi / 2) +
        Math.cos(fi1) * Math.cos(fi2) *
        Math.sin(deltalambda / 2) * Math.sin(deltalambda / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = R * c;
    return d; //where d is the disatnce in meter
}

function deg2rad(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}

function checkAPIs() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
}
function loadTrajectoryForRacer(racerID, file) {

    function addDoc() {
        //var file = document.getElementById("myFile").files[0]; //for input type=file
        var reader = new FileReader();
        reader.onload = function (e) { }
        reader.readAsText(file);
        var error = reader.error;
        var texte = reader.result;
        console.log(reader.result);
        //document.getElementById("DisplayText").innerText = reader.result; /*<p id="DisplayText>*/
    }
    /*
    var textByLine = FileReader.(textfile);
    for (i = 0; i < textByLine.length; i++) {
        var tr = textByLine[i].split(" ");
        var lat = parseFloat(tr[0]);
        var lng = parseFloat(tr[1]);
        var position = { lat, lng };
        routeCoord.push(racerID, lat, lng);
    }
*/

    /*var fs = require("fs");
    fs.readFile(textfile, function (text) {
        var textByLine = text.split("\n")
        for (i = 0; i < textByLine.length; i++) {
            var tr = textByLine[i].split(" ");
            var lat = parseFloat(tr[0]);
            var lng = parseFloat(tr[1]);
            var position = { lat, lng };
            routeCoord.push(racerID, lat, lng);
        }
    });*/
}

//testline