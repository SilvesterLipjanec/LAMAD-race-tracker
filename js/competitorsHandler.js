
const TRAJECTORIES_DIR = './trajectories/';
const COMP_ICON_DIR = './images/competitors/';
const NUM_COMPETITORS = 2;
var competitorsRoutes = [];
var time = 0;
var simulationPaused = false;
var done = false;

function loadCompetitorRoute(compNumber, callback){    
        var txtFileName =  TRAJECTORIES_DIR+'rt'+compNumber+'.txt';
        loadTrajectory(txtFileName,function(routeArr){
            competitorsRoutes[compNumber]=routeArr;
            callback(routeArr,compNumber);
        });       
}
function initMarker(routeArr, compNumber){
    var iconUrl = COMP_ICON_DIR+'c'+compNumber+'.png';
    var icon={
        url: iconUrl,
        size:new google.maps.Size(20,20),
        scaledSize:new google.maps.Size(20,20),
        origin:new google.maps.Point(0,0),
        anchor:new google.maps.Point(10,10)
    }
    routeArr.marker = new google.maps.Marker({
        position: routeArr[0].position, 
        map: map,
        icon: icon
    });
}
function updateMarker(competitorsRoutes,compNumber,time){
    console.log(competitorsRoutes[compNumber]);
    var posInTime = $.grep(competitorsRoutes[compNumber], function(posInTime){
        return posInTime.timestamp === time})[0];
    if(posInTime){
        competitorsRoutes[compNumber].marker.setPosition(posInTime.position);
    }
}
function updateCompetitorMarkers(time){
    for(i = 0 ; i < NUM_COMPETITORS ; i++){
        if(time == 0){ //initialize markers
            loadCompetitorRoute(i, function(routeArr,compNumber){
                initMarker(routeArr,compNumber);
                
            });                
        }else{
            if(competitorsRoutes){
                updateMarker(competitorsRoutes,i,time);
            }
            else{
                alert('Routes still not loaded!');
                return false;
            }
        }
    }
}
function startTime(time,timeout){
    time = time + timeout;
    return time; 
}
function simulateRacing(timeout,speed){
    var simulationSpeed = timeout / speed;    
    var notUpdateTime = updateCompetitorMarkers(time);
    if(!notUpdateTime){
        time = startTime(time, timeout);
    }    
    if(simulationPaused == false){
        setTimeout(function(){
            simulateRacing(timeout,speed);    
        },simulationSpeed);
    }
           
}
function pauseSimulation(){
    simulationPaused = true;
}
function playSimulation(){
    simulationPaused = false;
    var timeout = 1000;
    var speed = 4;
    simulateRacing(timeout, speed);
    
    $(".progressBar").text("Simulation active"); 
}
function stopSimulation(){
    simulationPaused = true;
    if(competitorsRoutes){
        for(i = 0 ; i < competitorsRoutes.length ; i++){
            competitorsRoutes[i].marker.setMap(null);
        }
    }
}
