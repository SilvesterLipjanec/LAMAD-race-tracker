
var routeCoord = [];
var ROUTE = './trajectories/route.txt';
var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });
    drawRoutePolyline();
}
var routeCoord = [];
var ROUTE = './trajectories/route.txt';

function loadTrajectory(callback){
    $.get(ROUTE,function(txt){
        var posArr  = txt.split("\n");
        for (i = 0 ; i < posArr.length ; i++){
            var tr = posArr[i].split(" ");
            var lat = parseFloat(tr[0]);
            var lng = parseFloat(tr[1]);
            var position = {lat, lng};
            routeCoord.push(position);
        }
        routeCoord.pop();
        callback(routeCoord);   
    });    
}
function drawRoutePolyline(){
    loadTrajectory(function(coord){
        var route = new google.maps.Polyline({
            path: coord,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        route.setMap(map);
        map.setCenter(coord[0]);
    });    
}


