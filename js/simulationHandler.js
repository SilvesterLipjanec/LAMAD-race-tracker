
const TRAJECTORIES_DIR = './trajectories/';
const COMP_ICON_DIR = './images/competitors/';
const AVATAR_DIR = './images/avatars/';
const AVATAR_IMG_NAME = 'avatar_';
const PNG = '.png';
const NUM_COMPETITORS = 2;
const MARKER_SIZE = 20;
var competitorsRoutes = [];
var time = 0;
var simulationPaused = false;
var tr_loaded_inverse_cnt = NUM_COMPETITORS;

function getCompetitorInfo(compNumber){
    return "Firstname"+compNumber+" Secondname"+compNumber;
}
function initMarker(compNumber){
    var iconUrl = COMP_ICON_DIR+'c'+compNumber+'.png';
    var icon={
        url: iconUrl,
        size:new google.maps.Size(MARKER_SIZE,MARKER_SIZE),
        scaledSize:new google.maps.Size(MARKER_SIZE,MARKER_SIZE),
        origin:new google.maps.Point(0,0),
        anchor:new google.maps.Point(MARKER_SIZE/2,MARKER_SIZE/2)
    }
    competitorsRoutes[compNumber].marker = new google.maps.Marker({
        position: competitorsRoutes[compNumber][0].position, 
        map: map,
        icon: icon
    });
    var competitorInfo = getCompetitorInfo(compNumber);
    var infowindow = new google.maps.InfoWindow({
        content: competitorInfo
      });
    competitorsRoutes[compNumber].marker.addListener('click', function() {
        infowindow.open(map, competitorsRoutes[compNumber].marker);
      });
        

}
function getActualPosition(compNumber,time){
    var posInTime = $.grep(competitorsRoutes[compNumber], function(posInTime){
        return posInTime.timestamp === time})[0];
    return posInTime;
}
function getActualPositionId(compNumber,time){
    index = competitorsRoutes[compNumber].findIndex(x => x.timestamp==time);
    return index;
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
    return pointUpdated; 
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
    var nearestPoint = nearestPointObj.npObj.position;
    if(time == 0){
        initProjectionLine(compNumber,actualPosPoint,nearestPoint);
    }
    else{
        updateProjectionLine(compNumber,actualPosPoint,nearestPoint);
    }    
}
function findNearestRoutePointObj(position,route){
    var minDistance;
    var npObj; //nearest point object
    var i;
    for(i = 0 ; i < route.length ; i++){        
        var trajectoryPoint = {
            lat: route[i].position.lat,
            lng: route[i].position.lng
        }
        var distance = calculateDistance(position,trajectoryPoint);
        if(i == 0){
            minDistance = distance;
            npObj = route[i];
        }
        else{ 
            if(distance < minDistance){
                minDistance = distance;
                npObj = route[i];
            }
        }
    }
    return {i,npObj};
}
function startTime(time,timeout){
    time = time + timeout;
    var sec = time / 1000;
    var s = Math.floor(sec % 60);
    var min = sec / 60;
    var m = Math.floor(min % 60);
    var hrs = min / 60;
    var h = Math.floor(hrs % 60);
    s = checkTime(s);
    m = checkTime(m);
    h = checkTime(h);    
    $("#time").text(h + ":" + m + ":" + s);
    return time; 
}
function stopTime(){
    time = 0; 
    $("#time").text("00:00:00");
}
function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}

function simulateRacing(timeout,speed){
    if(simulationPaused == false){
        var simulationSpeed = timeout / speed; 
        var pointUpdated = updateCompetitorMarkers(time);
        if(pointUpdated && time != 0){
            var positionArr = getCompetitorsOrder(time);
            updateLeaderboard(positionArr,time);    
        }         
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
    var speed = 10;
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
    stopTime();
    initLeaderboard();
    if(competitorsRoutes){
        for(i = 0 ; i < competitorsRoutes.length ; i++){
            competitorsRoutes[i].marker.setMap(null);
            competitorsRoutes[i].projectionLine.setMap(null);
        }
    }
}
function sortAndRankArray(arr){
    var sorted = arr.slice().sort(function(a,b){return b-a})
    compRanks = arr.slice().map(function(v){ return sorted.indexOf(v)+1 });
    return compRanks;
}
function getCompetitorsOrder(time){
    var i; 
    var distancesArr = [];
    var actualPositions = [];
    var npArr = []; //array of nearest points indexes
    var compRanks = []; //index = competitor number, value = rank
    for(i = 0 ; i < NUM_COMPETITORS ; i++ ){        
        var actualPos = getActualPosition(i, time);
        var actualPosPoint = actualPos.position;
        actualPositions.push(actualPosPoint);
        var nearestPointObj = findNearestRoutePointObj(actualPosPoint,g_routeArray);
        distancesArr.push(nearestPointObj.npObj.distFromStart);
        npArr.push(nearestPointObj.i);
    }    
    var compRanks = sortAndRankArray(distancesArr);

    for(var i = 0; i <= compRanks.length; i++) {
        for(var j = i; j <= compRanks.length; j++) {
            if(i != j && compRanks[i] == compRanks[j]) {                
                var distI;
                var distJ;
                var pointI;
                var pointJ;
                var nextP = true; //computation based on next point
                if(g_routeArray[npArr[i]+1] && g_routeArray[npArr[J]+1]){ //if next point exist, nearest point is not last
                    pointI = g_routeArray[npArr[i]+1].position;
                    pointJ = g_routeArray[npArr[j]+1].position;   
                }
                else{ //nearest point is last point, check previous point
                    nextP = false;
                    if(g_routeArray[npArr[i]-1] && g_routeArray[npArr[i]-1]){
                        pointI = g_routeArray[npArr[i]-1].position;
                        pointJ = g_routeArray[npArr[j]-1].position; 
                    }
                    else{
                        alert('error in order finding');
                        return;
                    }
                }
                distI = calculateDistance(actualPositions[i],pointI);
                distJ = calculateDistance(actualPositions[j],pointJ);
                
                if(nextP){ //computation based on next point from nearest point 
                    if(distI < distJ){ 
                        compRanks[i]++;
                    }
                    else{
                        compRanks[j]++;
                    }
                }
                else{ //computation based on previous point from nearest point
                    if(distI < distJ){ //comp. i is further from prev. point rank++
                        compRanks[j]++;
                    }
                    else{
                        compRanks[i]++;
                    }
                }
            }
        }
    }
    var positionArr = createPositionArray(compRanks);
    return positionArr; //index of array is position (0 is undefined),value = competitor id
}
function createPositionArray(rankArr){
    var positionArr = [];
    for(var i = 0 ; i < rankArr.length ; i++){
        positionArr[rankArr[i]] = i;
    }
    return positionArr;
}
