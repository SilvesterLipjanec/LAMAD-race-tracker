function ShowProgressBar(){    
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
   
    
}   

function FitTexts(){  
    var fitties = document.getElementsByClassName(".fit");
    for (let index = 0; index < fitties.length; index++) {
        fitties[index].fit();   
    }
}
