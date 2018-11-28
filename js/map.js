var ROUTE = './trajectories/route.txt';
var START_ICON = './images/icons/start.png';
var FINISH_ICON = './images/icons/finish.png';
var START_FINISH_ICON_WIDTH = 80;
var START_FINISH_ICON_HEIGHT = 40;
var map;
var routePoly;
var g_routeArray = [];
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 12
    });
    if(competitorsRoutes.length == 0){
        loadAllTrajectories(function(){
            initLeaderboard();
        });
    }
    drawRoutePolyline(ROUTE);
    
}

function loadTrajectory(routeFile,compNumber,callback){
    var routeArr = [];
    $.get(routeFile,function(txt){
        var posArr  = txt.split("\n");
        var info = posArr[0];
        for (i = 1 ; i < posArr.length ; i++){
            var tr = posArr[i].split(/\s+/);
            var lat = parseFloat(tr[0]);
            var lng = parseFloat(tr[1]);
            var timestamp = parseInt(tr[2]);    
            if(!isNaN(lat) && !isNaN(lng) && !isNaN(timestamp)){ //lat,lng,timestamp are numbers
                var position = {lat, lng};
                var distFromStart = 0;
                if(routeArr.length != 0){  
                    distFromStart = getDistanceFromStart(position,routeArr);                    
                }
                routeArr.push({position, timestamp, distFromStart});            
            }            
        }        
        callback(routeArr,compNumber,info);   
    });    
}
function drawRoutePolyline(routeFile){
    loadTrajectory(routeFile,0,function(routeArr){
        g_routeArray = routeArr;
        let coordinates = routeArr.map(a => a.position);
        routePoly = new google.maps.Polyline({
            path: coordinates,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        routePoly.setMap(map);
        map.setCenter(coordinates[0]);

        var start_icon={
            url: START_ICON,
            size:new google.maps.Size(START_FINISH_ICON_WIDTH,START_FINISH_ICON_HEIGHT),
            scaledSize:new google.maps.Size(START_FINISH_ICON_WIDTH,START_FINISH_ICON_HEIGHT),
            origin:new google.maps.Point(0,0),
            anchor:new google.maps.Point(START_FINISH_ICON_WIDTH/2,START_FINISH_ICON_HEIGHT/2)
        }
        var finish_icon={
            url: FINISH_ICON,
            size:new google.maps.Size(START_FINISH_ICON_WIDTH,START_FINISH_ICON_HEIGHT),
            scaledSize:new google.maps.Size(START_FINISH_ICON_WIDTH,START_FINISH_ICON_HEIGHT),
            origin:new google.maps.Point(0,0),
            anchor:new google.maps.Point(START_FINISH_ICON_WIDTH/2,START_FINISH_ICON_HEIGHT/2)
        }
        var start_marker = new google.maps.Marker({
            position: coordinates[0], 
            map: map,
            icon: start_icon
        }); 
        var finish_marker = new google.maps.Marker({
            position: coordinates[coordinates.length-1], 
            map: map,
            icon: finish_icon
        }); 
    }); 
      
}
function getDistanceFromStart(newPoint, trajectory){
    var lastPoint = trajectory[trajectory.length-1];
    return lastPoint.distFromStart + calculateDistance(newPoint,lastPoint.position);
}

function calculateDistance(pos1,pos2) {
    var R = 6371e3; // meter
    var fi1 = deg2rad(pos1.lat);
    var fi2 = deg2rad(pos2.lat);
    var deltafi = deg2rad(pos2.lat - pos1.lat);
    var deltalambda = deg2rad(pos2.lng - pos1.lng);

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
