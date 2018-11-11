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


