const WHITE_COMP_CLASS = "competitor_white";
const GREY_COMP_CLASS = "competitor_grey";

function getActualSpeed(compId, time){
    var posId = getActualPositionId(compId, time);
    if(posId){
        var actualPos = competitorsRoutes[compId][posId];
        var prevPos = competitorsRoutes[compId][posId-1];
        var distancePassed = (calculateDistance(actualPos.position, prevPos.position) / 1000); //km
        var timeDiff = (((actualPos.timestamp - prevPos.timestamp) / 1000) / 3600); //hours
        var speed = distancePassed / timeDiff;
        return speed; 
    }
}
function getActualPassedDistance(compId, time){ //metres
    var actualPos = getActualPosition(compId, time);
    var t = time;
    while(!actualPos){
        t = t - 1000; //solving problem that data about position is not every 1000ms but every 4000ms
                        //therefore you want neariest previous position
        actualPos = getActualPosition(compId, t);
    }
    var nearestPointObj = findNearestRoutePointObj(actualPos.position,g_routeArray);
    return nearestPointObj.npObj.distFromStart;
}
function getDistanceToGo(distancePassed){
    var distToGo = g_routeArray[g_routeArray.length-1].distFromStart;
    if(distancePassed){
        distToGo = distToGo - distancePassed;
    }
    return distToGo;
}
function initLeaderboard(){
    $("#leaderboard").empty();    
    for(var compId = 0 ; compId < NUM_COMPETITORS ; compId++){
        var img_src = AVATAR_DIR+AVATAR_IMG_NAME+compId+PNG;
        var name = getCompetitorInfo(compId);
        var speed = 0;
        var distance = 0;
        var diff = 0;
        var classId = getDivCompClass(compId);
        var compDiv = createCompetitorDiv(img_src,(compId+1),name,speed,distance,diff,classId);
        $("#leaderboard").append(compDiv);
    }
}

function updateLeaderboard(positionArr,time){ 
    $("#leaderboard").empty();    
    for(var pos = 1 ; pos <= NUM_COMPETITORS ; pos++){        
        var compId  = positionArr[pos]; 
        var img_src = AVATAR_DIR+AVATAR_IMG_NAME+compId+PNG;
        var name = getCompetitorInfo(compId);
        var speed = getActualSpeed(compId, time);
        speed = speed.toFixed(1);
        var distance = getActualPassedDistance(compId, time) / 1000; //km;
        distance = distance.toFixed(2); 
        var diff = 10;
        var classId = getDivCompClass(pos);
        var compDiv = createCompetitorDiv(img_src,pos,name,speed,distance,diff,classId);
        $("#leaderboard").append(compDiv);
    }
}
function getDivCompClass(index){
    if(index % 2 == 0){
        return WHITE_COMP_CLASS;
    }
    else{
        return GREY_COMP_CLASS;
    }
}
function createCompetitorDiv(img_src,pos,name,speed,distance,diff,classId){
    var compPhoto = $("<img></img>",{
        class:"photo",
        src: img_src
    });
    var compPosition = $("<div></div>",{
        class:"place"
    }).text(pos+".");
    var compName = $("<div></div>",{
            class:"name"
    }).text(name);
    var compStat = $("<div></div>",{
        class:"stat"
    }).text("Speed: "+speed+" km/h | Distance: "+distance+" km");//| Diff: "+diff+" s");
    var compDiv = $("<div ></div>",{
        "class": classId,
    }).append(compPhoto,compPosition,compName,compStat);
    return compDiv;
}