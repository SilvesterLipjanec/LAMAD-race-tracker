function showProgressBar(){    
    var t = $("#progressBar").css('top');
    if  (t=='0px'){
        $("#progressBar").css({'top' : '-15vmin'});
    }
    else{
        $("#progressBar").css({'top' : '0px'});
    }
    rotate180deg(extendProgressBtn);   
}
function showSimulationSpeed(simulationSpeed){
    $("#speed").text(simulationSpeed+"x");
}
function hideSimulationSpeed(){
    $("#speed").text("");
}
function showFollowedCompInfo(compId,time){
    if(compId == -1){ //follow first competitor
        var positionArr = getCompetitorsOrder(time);
        compId = positionArr[1];
    }
    var distPassed = getActualPassedDistance(compId, time); //metres;
    var distToGo = getDistanceToGo(distPassed); //metres
    
    if(distPassed < 1000){
        distPassed = distPassed.toFixed(0);
        $("#distPassed").text(distPassed+" m");
    }
    else{
        distPassed = distPassed / 1000;
        distPassed = distPassed.toFixed(2);
        $("#distPassed").text(distPassed+" km");
    }
    if(distToGo < 1000){
        distToGo = distToGo.toFixed(0);
        $("#distToGo").text(distToGo+" m");
    }
    else{
        distToGo = distToGo / 1000;
        distToGo = distToGo.toFixed(2);
        $("#distToGo").text(distToGo+" km");
    }  
    var compInfo = getInfoWindowContent(compId,time);
    $("#nameCaption").text(compInfo);  
}
function initFollowedCompInfo(){
    $("#distPassed").text("0 km");
    $("#distToGo").text("0 km");
    $("#nameCaption").text("");
}    
function changePlayToPause(){
    $("#playBtn").text('pause_circle_outline').attr({"onclick" : "pauseSimulation()"});
} 
function changePauseToPlay(){
    $("#playBtn").text('play_circle_outline').attr({"onclick" : "playSimulation()"});
}
function setProgressBarMaximum(){
    var max = getMaximumTimestamp();
    $("progress").attr({"max" : max});
}
function updateProgressBar(time){
    $("progress").attr({"value" : time});
}
function changeSimulationIndicator(state){
    var text;
    switch (state) {
        case "stop":
            text="Simulation stopped"
            break;
        case "play":
            text="Simulation in progress..."
            break;
        case "pause":
            text="Simulation paused"
            break;
        default:
            text="";
            break;
    }
    $("#simulationIndicator").text(text);
}

function rotate180deg(element){
    var rot = $(element).css('transform');
    if (rot == "matrix(-1, 1.22465e-16, -1.22465e-16, -1, 0, 0)") {
        $(element).css({'transform' : 'rotate(0deg)'});
    } else {
        $(element).css({'transform' : 'rotate(180deg)'});
    }
    rot = $(element).css('transform');
}