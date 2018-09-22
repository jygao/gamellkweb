var GATE_BEGIN_MSG = "gamellkweb_gateBeginMsg";
var GATE_FINISH_MSG = "gamellkweb_gateFinishMsg";
var PLAY_OR_STOP_MSG = "gamellkweb_playOrStopMsg";
var FINISH_GAME_MSG = "gamellkweb_finishGameMsg";

function sendGateBeginMsg(gameId,curLevel) {
    localCallAS(GATE_BEGIN_MSG,{"gid":gameId,"lv":curLevel});
}


function sendGateFinishMsg(){
    localCallAS(GATE_FINISH_MSG,{});
}

function sendPlayOrStopMsg(isPlay){
    localCallAS(PLAY_OR_STOP_MSG,{"isPlay":isPlay});
}

function sendFinishGameMsg(totalScore){
    localCallAS(FINISH_GAME_MSG,{"s":totalScore,"sucessJsCallbackName":"afterSendFinishGame"});
}

if(parent){
    parent.afterSendFinishGame = function(params) {
        console.log("afterSendFinishGame:"+params);
    }
}

function localCloseVBox() {
    if(parent&&parent.closeVBox){
        parent.closeVBox();
    }else{
        window.location.reload();
    }
}


function localCallAS(eventName,params) {
    console.log(eventName+" "+params);
    if(parent&&parent.callAS){
        parent.callAS(eventName,params);
    }
}

function localGetAntiAddictionStateForJs() {
    if(parent&&parent.getAntiAddictionStateForJs){
        return parent.getAntiAddictionStateForJs().state;
    }else{
        return 0;
    }
}
