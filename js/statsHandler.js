function getActualSpeed(compId, time){

}
function initLeaderboard(){
    $("#leaderboard").empty();    
    for(var compId = 0 ; compId < NUM_COMPETITORS ; compId++){
        var img_src = AVATAR_DIR+AVATAR_IMG_NAME+(compId+1)+PNG;
        var name = "Firstname"+compId+" Secondname"+compId;
        var speed = 0;
        var distance = 0;
        var diff = 0;
        var compDiv = createCompetitorDiv(img_src,(compId+1),name,speed,distance,diff);
        $("#leaderboard").append(compDiv);
    }
}

function updateLeaderboard(positionArr,time){ 
    $("#leaderboard").empty();    
    for(var pos = 1 ; pos <= NUM_COMPETITORS ; pos++){        
        var compId  = positionArr[pos]; 
        var img_src = AVATAR_DIR+AVATAR_IMG_NAME+pos+PNG;
        var name = "Firstname"+compId+" Secondname"+compId;
        var speed = 10//getActualSpeed(compId, time);
        var distance = 10;
        var diff = 10;
        var compDiv = createCompetitorDiv(img_src,pos,name,speed,distance,diff);
        $("#leaderboard").append(compDiv);
    }
}

function createCompetitorDiv(img_src,pos,name,speed,distance,diff){
    var compPhoto = $("<img></img>",{
        class:"photo",
        src: img_src
    });
    var compPosition = $("<div></div>",{
        class:"place"
    }).text(pos);
    var compName = $("<div></div>",{
            class:"name"
    }).text(name);
    var compStat = $("<div></div>",{
        class:"stat"
    }).text("Speed: "+speed+"km/h | Distance: "+distance+" km | Diff: "+diff+" s");
    var compDiv = $("<div></div>",{
        class: "competitor"
    }).append(compPhoto,compPosition,compName,compStat);
    return compDiv;
}