
const TRAJECTORIES_DIR = './trajectories/';
const COMP_ICON_DIR = './images/competitors/';
const NUM_COMPETITORS = 2;
var competitorMarkers = [];
var competitorsRoutes = [];

function loadCompetitorRoute(compNumber, callback){    
        var txtFileName =  TRAJECTORIES_DIR+'tr'+i+'.txt';
        loadTrajectory(txtFileName,function(routeArr){
            competitorsRoutes.push(routeArr);
            callback(routeArr,compNumber);
        });       
}

function initCompetitorMarkers(){
    for(i = 1 ; i <= NUM_COMPETITORS ; i++){
        loadCompetitorRoute(i, function(routeArr,compNumber){
            var iconUrl = COMP_ICON_DIR+'c'+compNumber+'.png';
            var icon={
                url: iconUrl,
                size:new google.maps.Size(20,20),
                scaledSize:new google.maps.Size(20,20),
                origin:new google.maps.Point(0,0),
                anchor:new google.maps.Point(10,10)
            }
            var marker = new google.maps.Marker({
                position: routeArr[0].position, 
                map: map ,
                icon: icon
            });            
        });
    }
}
function simulateRacing(){
   initCompetitorMarkers();  

    
}