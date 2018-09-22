var Dialog = {
    createNew:function (options) {
        var dialog = {};
        var container = options.container||document.body;
        var bgUrl = options.bgUrl;

        var grayImage = document.createElement("img");
        grayImage.src = "image/bg_gray.png";
        grayImage.onload = function (ev) {
            grayImage.style.position = "absolute";
            grayImage.style.left = "0px";
            grayImage.style.top ="0px";
            grayImage.style.zIndex ="99";
            grayImage.style.opacity = "0.5";
            container.appendChild(grayImage);
        }

        var bgImage = document.createElement("img");
        bgImage.src = bgUrl;
        bgImage.onload = function (ev) {
            bgImage.style.position = "absolute";
            bgImage.style.left = parseInt((960-bgImage.width)/2)+"px";
            bgImage.style.top = parseInt((560-bgImage.height)/2)+"px";
            bgImage.style.zIndex ="99";
            container.appendChild(bgImage);
        }

        dialog.elements = [grayImage,bgImage];

        dialog.close = function () {
            for (var i = 0; i < dialog.elements.length; i++) {
                container.removeChild(dialog.elements[i]);
            }
        };

        dialog.appendButton = function (onClick,clsName,isAutoClose) {
            var btn = createButton(container,clsName,function(){
                if(isAutoClose){
                    dialog.close();
                }
                onClick();
            },"")
            dialog.elements.push(btn);
        }
        
        dialog.appendTextDiv = function (textValue,clsName) {
            var txtDiv = createTextDiv(container,clsName,textValue);
            dialog.elements.push(txtDiv);
        }

        return dialog;
    }
}

function showNextLevelDialog(options) {
    var curGate = options.curGate;
    var onEndGame = options.onEndGame;
    var onNextLevel = options.onNextLevel;

    var tempDialog = Dialog.createNew({
        "bgUrl":"image/bg_next_level.png",
        "container":document.body
    });

    tempDialog.appendButton(function () {
        onNextLevel();
    },"btnNextLevel",true);

    tempDialog.appendButton(function () {
        onEndGame();
    },"btnEndGame",true);

    tempDialog.appendTextDiv(curGate,"txt_level_of_next_level_dialog");
}


var showExpTips = ["","奖励减半了，先休息会儿吧","奖励为0了，先休息会儿吧"];

function showGameEndDialog(options) {
    var totalScore = options.totalScore|0;
    var totalTime = options.totalTime|0;
    var onEndGame = options.onEndGame;
    var onRestart = options.onRestart;
    var antiAddictionState = options.antiAddictionState|0;
    var gotGoldNum = antiAddictionState==2?0:parseInt(totalScore/9);
    if(antiAddictionState==1){
        gotGoldNum = parseInt(gotGoldNum/2);
    }

    var tempDialog = Dialog.createNew({
        "bgUrl":"image/bg_result.png",
        "container":document.body
    });

    tempDialog.appendButton(function () {
        onRestart();
    },"btn_restart",true);

    tempDialog.appendButton(function () {
        onEndGame();
    },"btnEndGame",true);

    tempDialog.appendTextDiv(totalScore,"txtTotalScore");
    tempDialog.appendTextDiv(totalTime,"txtTotalTime");
    tempDialog.appendTextDiv(gotGoldNum,"txtGotGoldNum");
    tempDialog.appendTextDiv(showExpTips[antiAddictionState],"txtExp");
}


function showPassAllDialog(options) {
    var totalScore = options.totalScore|0;
    var totalTime = options.totalTime|0;
    var onEndGame = options.onEndGame;
    var antiAddictionState = options.antiAddictionState|0;
    var gotGoldNum = antiAddictionState==2?0:parseInt(totalScore/9);
    if(antiAddictionState==1){
        gotGoldNum = parseInt(gotGoldNum/2);
    }

    var tempDialog = Dialog.createNew({
        "bgUrl":"image/bg_pass_all.png",
        "container":document.body
    });

    tempDialog.appendButton(function () {
        onEndGame();
    },"btnEndGame_passall_dialog",true);

    tempDialog.appendTextDiv(totalScore,"txtTotalScore");
    tempDialog.appendTextDiv(totalTime,"txtTotalTime");
    tempDialog.appendTextDiv(gotGoldNum,"txtGotGoldNum");
    tempDialog.appendTextDiv(showExpTips[antiAddictionState],"txtExp");
}


function showStopDialog(options) {
    var onContinueGame = options.onContinueGame;

    var tempDialog = Dialog.createNew({
        "bgUrl":"image/bg_continue.png",
        "container":document.body
    });

    tempDialog.appendButton(function () {
        onContinueGame();
    },"btn_continue",true);
}

function showQuitConfirmDialog(options) {
    var onEndGame = options.onEndGame;
    var onContinueGame = options.onContinueGame;

    var tempDialog = Dialog.createNew({
        "bgUrl":"image/bg_quit_confirm.png",
        "container":document.body
    });

    tempDialog.appendButton(function () {
        onContinueGame();
    },"btn_cancel",true);

    tempDialog.appendButton(function () {
        onEndGame();
    },"btn_confirm",true);
}


