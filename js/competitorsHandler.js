
const TRAJECTORIES_DIR = './trajectories/';
const COMP_ICON_DIR = './images/competitors/';
const NUM_COMPETITORS = 2;
var competitorsRoutes = [];
var time = 0;
var simulationPaused = false;

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
function updateMarker(compNumber,time){
    var posInTime = $.grep(competitorsRoutes[compNumber], function(posInTime){
        return posInTime.timestamp === time})[0];
    if(posInTime){
        competitorsRoutes[compNumber].marker.setPosition(posInTime.position);
    }
}
function updateCompetitorMarkers(time){
    for(i = 0 ; i < NUM_COMPETITORS ; i++){
        if(time == 0){
            initMarker(i);          
        }else{
            updateMarker(i,time);               
        }
    }
}
function startTime(time,timeout){
    time = time + timeout;
    return time; 
}
function simulateRacing(timeout,speed){
    if(simulationPaused == false){
        var simulationSpeed = timeout / speed;      
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
            if(competitorsRoutes.length == NUM_COMPETITORS){
                callback();
            }
        });
    }
}
function playSimulation(){
    simulationPaused = false;
    var timeout = 1000;
    var speed = 4;
    if(competitorsRoutes.length != NUM_COMPETITORS){
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
 
