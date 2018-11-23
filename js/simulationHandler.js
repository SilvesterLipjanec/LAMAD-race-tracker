
const TRAJECTORIES_DIR = './trajectories/';
const COMP_ICON_DIR = './images/competitors/';
const NUM_COMPETITORS = 2;
var competitorsRoutes = [];
var time = 0;
var simulationPaused = false;
var tr_loaded_inverse_cnt = NUM_COMPETITORS;


function initMarker(compNumber){
    var iconUrl = COMP_ICON_DIR+'c'+compNumber+'.png';
    var icon={
        url: iconUrl,
        size:new google.maps.Size(20,20),
        scaledSize:new google.maps.Size(20,20),
        origin:new google.maps.Point(0,0),
        anchor:new google.maps.Point(10,10)
    }
    competitorsRoutes[compNumber].marker = new google.maps.Marker({
        position: competitorsRoutes[compNumber][0].position, 
        map: map,
        icon: icon
    });

}
function getActualPosition(compNumber,time){
    var posInTime = $.grep(competitorsRoutes[compNumber], function(posInTime){
        return posInTime.timestamp === time})[0];
    return posInTime;
}
function updateMarker(compNumber,time){
    var posInTime = getActualPosition(compNumber,time);
    if(posInTime){
        competitorsRoutes[compNumber].marker.setPosition(posInTime.position);
        return true;
    }
    else{
        return false; //marker not updated
    }
}
function updateCompetitorMarkers(time){
    var i;
    for(i = 0 ; i < NUM_COMPETITORS ; i++){
        var pointUpdated = false;
        if(time == 0){
            initMarker(i);  
            pointUpdated = true;        
        }else{
            if(updateMarker(i,time)){
                pointUpdated = true;
            }                           
        }
        if(pointUpdated){ 
            drawProjectionPolyline(i,time);
        }
    }    
    //getCompetitorsOrder(time);
}
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function initProjectionLine(compNumber,actualPosPoint,nearestPoint){
    var strokeColor = getRandomColor();
    var lineSymbol = {
        path: 'M 0,-1 0,1',
        strokeOpacity: 1,
        scale: 2,
        strokeColor: strokeColor
    };
    competitorsRoutes[compNumber].projectionLine = new google.maps.Polyline({
        path: [actualPosPoint, nearestPoint],
        strokeOpacity: 0,
        icons: [{
          icon: lineSymbol,
          offset: '0',
          repeat: '20px'
        }],
        map: map
      });
}
function updateProjectionLine(compNumber,actualPosPoint,nearestPoint){
    competitorsRoutes[compNumber].projectionLine.setPath(
        [actualPosPoint,nearestPoint]);
}
function drawProjectionPolyline(compNumber, time){
    var actualPos = getActualPosition(compNumber, time);
    var actualPosPoint = actualPos.position;
    var nearestPointObj = findNearestRoutePointObj(actualPosPoint,g_routeArray);
    var nearestPoint = nearestPointObj.position;
    if(time == 0){
        initProjectionLine(compNumber,actualPosPoint,nearestPoint);
    }
    else{
        updateProjectionLine(compNumber,actualPosPoint,nearestPoint);
    }    
}
function findNearestRoutePointObj(position,route){
    var minDistance;
    var nearestPointObj;
    var i;
    for(i = 0 ; i < route   .length ; i++){        
        var trajectoryPoint = {
            lat: route[i].position.lat,
            lng: route[i].position.lng
        }
        var distance = calculateDistance(position,trajectoryPoint);
        if(i == 0){
            minDistance = distance;
            nearestPointObj = route[i];
        }
        else{ 
            if(distance < minDistance){
                minDistance = distance;
                nearestPointObj = route[i];
            }
        }
    }
    return nearestPointObj;
}
function startTime(time,timeout){
    time = time + timeout;
    return time; 
}
function simulateRacing(timeout,speed){
    if(simulationPaused == false){
        var simulationSpeed = timeout / speed;      
        var order = [];
        updateCompetitorMarkers(time);      
        time = startTime(time,timeout);   
        setTimeout(function(){
            simulateRacing(timeout,speed);    
        },simulationSpeed);
    }           
}
function loadAllTrajectories(callback){
    for(i = 0 ; i < NUM_COMPETITORS ; i++){
        //initialize markers
        var txtFileName =  TRAJECTORIES_DIR+'rt'+i+'.txt';
        loadTrajectory(txtFileName,i,function(routeArr,compNumber){
            competitorsRoutes[compNumber] = routeArr;
            tr_loaded_inverse_cnt--; //decrease variable after trajectory is loaded 
            if(tr_loaded_inverse_cnt == 0){ //all trajectories are loaded
                callback();
            }
        });
    }
}
function playSimulation(){
    simulationPaused = false;
    var timeout = 1000;
    var speed = 4;
    if(competitorsRoutes.length == 0){
        loadAllTrajectories(function(){
            simulateRacing(timeout, speed);
        });
    }
    else{
        simulateRacing(timeout, speed);
    }    
}
function pauseSimulation(){
    simulationPaused = true;
}

function stopSimulation(){
    simulationPaused = true;
    time = 0;
    if(competitorsRoutes){
        for(i = 0 ; i < competitorsRoutes.length ; i++){
            competitorsRoutes[i].marker.setMap(null);            
        }
    }
}
function getCompetitorsOrder(time){
    var i; 
    var distancesArr = [];
    var compRanks = []; //index = competitor number, value = rank
    for(i = 0 ; i < NUM_COMPETITORS ; i++ ){        
        var actualPos = getActualPosition(i, time);
        var actualPosPoint = actualPos.position;
        var nearestPointObj = findNearestRoutePointObj(actualPosPoint,g_routeArray);
        distancesArr.push(nearestPointObj.distFromStart);        
    }
    // var method1 = function(a) {
    //     for(var i = 0; i <= a.length; i++) {
    //         for(var j = i; j <= a.length; j++) {
    //             if(i != j && a[i] == a[j]) {
    //                 return true; //compute distance to next point from nearest point 

    //             }
    //         }
    //     }
    //     return false;
    // }

    

    var sorted = distancesArr.slice().sort(function(a,b){return b-a})
    compRanks = distancesArr.slice().map(function(v){ return sorted.indexOf(v)+1 });

   

    console.log(compRanks);
}
 
