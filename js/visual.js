function showProgressBar(){    
    var t = $("#progressBar").css('top');
    if  (t=='0px'){
        $("#progressBar").css({'top' : '-15vmin'});
    }
    else{
        $("#progressBar").css({'top' : '0px'});
    }    
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
    $("#distPassed").text("0 m");
    $("#distToGo").text("0 m");
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