var canvas,ctx;
var animationCanvas,animationCtx;
var remainRefreshTime;
var remainSec ;
var remainTipTime;

var isAllUiReady = false;
var backgroundImage;
var infoImage;
var gamemainImage;
var chooseLightImage;

var cardImages= [];
var isCardReady = false;

var bgGrayImage;
var isBgGrayReady = false;

var verticalLineImages = [];
var isVerticalLineReady = false;
var crossLineImages = [];
var isCrossLineReady = false;
var readyGoAnimationImages = [];
var isReadyGoAnimationReady = false;
var boomIamges = [];
var isBoomReady = false;

var shineImages = [];
var isShineImageReady =false;

var isInitGame = false;
var hadStartedPlayReadyMovie = false;
var hadEndedPlayReadyMovie = false;

var btn_refresh;
var btn_tips;

var startX;
var startY;
var firstClickCard;
var secondClickCard;
var firstTipCard;
var secondTipCard;
var llk;
var totalCanChooseCardNum;
var countTime = 0;
var isGameTimeCounting = false;
var layout;
var isMissing = false;
var autoTipSec;
var autoTimeCounting = false;
var clickAudio;
var linkAudio;

// Cross-browser support for requestAnimationFrame
var w = window;
var then;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

function main() {

    canvas= document.getElementById('scene');
    ctx = canvas.getContext('2d');

    animationCanvas= document.getElementById('animation');
    animationCtx = animationCanvas.getContext('2d');

    var resNum = 0;
    function checkAllUiReady(){
        resNum++;
        if(resNum>=5){
            isAllUiReady = true;
        }
    }
    backgroundImage = new Image();
    backgroundImage.src = "image/bg_game_main.png";
    backgroundImage.onload = checkAllUiReady;

    gamemainImage = new Image();
    gamemainImage.src = "image/game_main.png";
    gamemainImage.onload = checkAllUiReady;

    infoImage = new Image();
    infoImage.src = "image/info_bar.png";
    infoImage.onload = checkAllUiReady;

    chooseLightImage = new Image();
    chooseLightImage.src = "image/light.png";
    chooseLightImage.onload = checkAllUiReady;

    bgGrayImage = new Image();
    bgGrayImage.src = "image/bg_gray.png";
    bgGrayImage.onload = checkAllUiReady;

    loadImages("card",1,GAME_CONST.maxCardNum,cardImages,function () {
        isCardReady = true;
    });


    loadImages("ready_go_movie",1,45,readyGoAnimationImages,function () {
        isReadyGoAnimationReady = true;
    });

    loadImages("crossline",1,7,crossLineImages,function () {
        isCrossLineReady = true;
    });

    loadImages("verticalline",1,7,verticalLineImages,function () {
        isVerticalLineReady = true;
    });

    loadImages("bomb_effect",1,8,boomIamges,function () {
        isBoomReady = true;
    });

    loadImages("shine",1,1,shineImages,function () {
        isShineImageReady = true;
    });

    clickAudio = document.createElement("audio");
    clickAudio.src="sound/click.wav";
    document.body.appendChild(clickAudio);

    linkAudio = document.createElement("audio");
    linkAudio.src="sound/link.wav";
    document.body.appendChild(linkAudio);


    function loadImages(keyName,startNum,endNum,images,completeCallback) {
        var num = 0;
        var totalNum = endNum - startNum+1;
        for (var i = startNum; i <= endNum; i++) {
            var image = new Image();
            var type = i;
            var realType = addPreZero(type.toString());
            image.src = "image/"+keyName+realType+".png";
            image.onload = function () {
                num++;
                if(num>=totalNum){
                    if(completeCallback!=null){
                        completeCallback();
                    }
                }
            }
            images[i-1] = image;
        }

        function addPreZero(numStr) {
            var remainNum = 4-numStr.length;
            var newStr="";
            for (var i = 0; i <remainNum ; i++) {
                newStr+="0";
            }
            return newStr+numStr;
        }
    }

    var container = document.body;

    var onClickClose = function(){
        onPopUpQuitConfirmDialog();
    }
    createButton(container,"btn_close_game",onClickClose);

    var onClickRefresh = function(){
        refreshMap();
    }
    btn_refresh = createButton(container,"btn_refresh",onClickRefresh,"刷新");

    var onClickTips = function(){
        onTipsShow();
    }
    btn_tips = createButton(container,"btn_tips",onClickTips,"提示");

    var onClickStop = function(){
        onPopUpStopDialog();
    }
    createButton(container,"btn_stop",onClickStop);

    layout = LayoutManager.createNew();
    resetGame();
    then = Date.now();
    updateAndRender();
}

function resetTipCard() {
    if(firstTipCard != null || secondTipCard != null) {
        firstTipCard.unShine();
        secondTipCard.unShine();
        firstTipCard = null;
        secondTipCard = null;
    }
}

function onTipsShow() {
    if(firstTipCard!= null || secondTipCard != null) {
        return;
    }
    if(remainTipTime<=0){
        btn_tips.disabled = true;
        return;
    }
    remainTipTime--;
    var p = llk.getLink();
    if(p){
        firstTipCard = llk.getMapArr()[p[0][0]][p[0][1]];
        firstTipCard.shine();
        secondTipCard = llk.getMapArr()[p[1][0]][p[1][1]];
        secondTipCard.shine();
    }
    else
    {
        while(p == null || p.length < 1)
        {
            refreshCurrentMap();
            p = llk.getLink();
        }

    }
}

function refreshMap() {
    resetTipCard();
    if(remainRefreshTime<=0){
        btn_refresh.disabled = true;
        return;
    }
    remainRefreshTime--;
    refreshCurrentMap();
    var p = llk.getLink();
    while(p == null || p.length < 1)
    {
        refreshCurrentMap();
        p = llk.getLink();
    }
}

/**
 * 对无解的数组进行重新洗牌
 **/
function refreshCurrentMap()
{
    var tmpMapArr= llk.getMapArr();
    var x_max = gameObj.levelConfig.col+2;
    var y_max = gameObj.levelConfig.row+2;
    //首先提取所有大于-1的数据存于一个临时数组arr里面
    var arr = new Array();
    for(var i=0; i<x_max; i++){
        for(var j=0; j<y_max; j++){
            if(i == 0 || j == 0 || i == x_max-1 || j == y_max-1) {
                continue;
            }
            if(tmpMapArr[i][j].type > -1)
                arr.push(tmpMapArr[i][j].type);
        }
    }
    //接着再对arr进行随机排序
    arr.sort(randomSort);
    //新数组替换原来的数据
    var arrCount=0;//arr数组的下标
    for(i=0; i<x_max; i++){
        for(j=0; j<y_max; j++){
            if(tmpMapArr[i][j].type > -1){
                tmpMapArr[i][j].type=arr[arrCount];
                tmpMapArr[i][j].changeTypeAndUpdateImage(arr[arrCount])
                arrCount++;
            }
        }
    }
}

/**
 * 数组随机排序帮助函数
 **/
function randomSort(a, b) {
    return Math.pow(-1,Math.floor(Math.random()*2));
}

function resetGame() {
    isInitGame = false;
    hadStartedPlayReadyMovie=false;
    hadEndedPlayReadyMovie =false;
    firstClickCard = null;
    secondClickCard = null;
    remainRefreshTime = gameObj.levelConfig.refresh;
    remainTipTime = gameObj.levelConfig.prompt;
    remainSec = gameObj.levelConfig.time;
    bgAudio.play();

    resetAutoTip();

    sendGateBeginMsg(GAME_CONST.GameId,gameObj.curLevel);
}

function resetAutoTip() {
    autoTimeCounting = true;
    autoTipSec = 0;
}

function clearCurrentCards() {
    var tmpMapArr= llk.getMapArr();
    var x_max = gameObj.levelConfig.col+2;
    var y_max = gameObj.levelConfig.row+2;

    for(var i=0; i<x_max; i++){
        for(var j=0; j<y_max; j++){
            if(i == 0 || j == 0 || i == x_max-1 || j == y_max-1) {
                continue;
            }
            var card = tmpMapArr[i][j];
            card.removeSelf(null,false);
        }
    }
}

function updateAndRender() {
    var now = Date.now();
    var delta = now - then;
    update(delta/1000);
    render();
    then = now;
    requestAnimationFrame(updateAndRender);
}

var update = function (modifier) {
    if(!isGameTimeCounting){
        return;
    }
    countTime+=modifier;
    if(countTime>=1){
        remainSec--;
        gameObj.totalTime++;
        autoTipSec++;
        if(remainSec<=0){
            timeUp();
        }
        countTime = 0;

        checkAutoTipTime();
    }
}

function checkAutoTipTime() {
    if(autoTimeCounting){
        if(autoTipSec>=GAME_CONST.AutoTipNeedSec){
            autoTimeCounting = false;
            onTipsShow();
        }
    }
}

function timeUp() {
    console.log("timeUp");
    isGameTimeCounting = false;
    autoTimeCounting = false;
    onPopUpGameEndDialog();
}

var Card ={
    createNew: function(image,type,rowIndex,colIndex,onClick){
        var card = {};
        card.image  =image;
        card.type = type;
        card.rowIndex = rowIndex;
        card.colIndex = colIndex;
        //兼容代码
        card.y = rowIndex;
        card.x = colIndex;

        card.initX = startX+card.colIndex*GAME_CONST.cardWidth;
        card.initY = startY + card.rowIndex*GAME_CONST.cardHeight;

        // console.log(card.initX+","+card.initY);


        if(card.image!=null){
            card.divContainer = document.createElement("div");
            card.divContainer.style.left= card.initX+"px";
            card.divContainer.style.top= card.initY+"px";
            card.divContainer.style.position="absolute";
            card.divContainer.style.zIndex  ="3";

            card.image.style.position= "absolute";
            card.image.style.left= "0px";
            card.image.style.top= "0px";
            card.divContainer.appendChild(card.image);

            card.divContainer.style.cursor ="pointer";

            document.body.appendChild(card.divContainer);
        }

        card.chooseLightIamge = chooseLightImage.cloneNode();

        card.getX = function(){
            return card.initX;
        }
        card.getY = function(){
            return card.initY;
        }
        card.setSelected = function(){
            clickAudio.load();
            clickAudio.play();
            card.divContainer.appendChild(card.chooseLightIamge);
            card.chooseLightIamge.style.position= "absolute";
            card.chooseLightIamge.style.left= "-8px";
            card.chooseLightIamge.style.top= "-8px";
            card.isSelected = true;
        }

        card.shineImage = shineImages[0].cloneNode();
        card.shine = function(){
            card.divContainer.appendChild(card.shineImage);
            card.shineImage.style.position= "absolute";
            card.shineImage.style.left= "-8px";
            card.shineImage.style.top= "-8px";
        }

        card.unShine = function(){
            if(card.divContainer){
                card.divContainer.removeChild(card.shineImage);
            }
        }

        card.cancelSelected = function(){
            if(card.divContainer&&card.chooseLightIamge.parentNode!=null){
                card.divContainer.removeChild(card.chooseLightIamge);
            }
            // card.divContainer.style.background = "";
            card.isSelected = false;
        }

        card.removeSelf = function(callback,withBoomMovie){
            card.cancelSelected();
            card.type = -1;
            if(card.image!=null){
                card.divContainer.removeChild(card.image);
                card.image = null;
            }
            if(card.divContainer){
                document.body.removeChild(card.divContainer);
            }
            if(withBoomMovie){
                playAnimation(animationCtx,boomIamges,card.initX,card.initY,function () {
                    if(callback!=null){
                        callback();
                    }
                },null);
            }else{
                if(callback!=null){
                    callback();
                }
            }
        }

        card.changeTypeAndUpdateImage = function (newType) {
            // console.log(card.x+":"+card.y);
            if(card.image!=null){
                card.type = newType;
                card.divContainer.removeChild(card.image);
                card.image = null;
            }
            if(newType>=0){
                card.image = cardImages[newType].cloneNode();
                card.divContainer.appendChild(card.image);
            }
            if(card.divContainer.parentNode==null){
                document.body.appendChild(card.divContainer);
            }
        }

        if(card.divContainer){
            card.divContainer.onclick = function (ev) {
                onClick.apply(null,[card])
            }
        }

        return card;

    }
};


function createMap() {
    var mapArr = [];
    llk = LLK_ROUTE.createNew();
    var colNum = gameObj.levelConfig.col;
    var rowNum = gameObj.levelConfig.row;
    totalCanChooseCardNum = colNum*rowNum;
    startX = 73 + ((14-colNum)*0.5>>0)*48.4;
    startY = 40 + ((8-rowNum)*0.5>>0)*49;
    var cardTypes = generateIcons(colNum,rowNum,GAME_CONST.maxCardNum);
    // console.log(cardTypes);
    //额外加两行两列边界
    for (var i = 0; i < colNum+2; i++) {
        var tmpMapArr = [];
        for (var j = 0; j < rowNum+2; j++) {
            var card;
            // console.log("i"+i+" "+"j"+j);
            if(i == 0 || j == 0 || i == colNum+1 || j == rowNum+1) {
                card = Card.createNew(null,-1,j,i,null);
            }else{
                var randomIdx = parseInt(Math.random()*cardTypes.length);
                var type = cardTypes.splice(randomIdx,1)[0];
                var image = cardImages[type].cloneNode();
                card = Card.createNew(image,type,j,i,onClickCard);
            }
            tmpMapArr[j] = card;
        }
        mapArr[i] = tmpMapArr;
    }
    llk.setMapArr(mapArr);
}

function onClickCard(card) {
    resetTipCard();
    if(isMissing){
        return;
    }
    if( card.isSelected){
        card.cancelSelected();
        if(card==firstClickCard) {
            firstClickCard = null;
        }
        if(card==secondClickCard){
            secondClickCard = null;
        }
    }else{
        card.setSelected();
        if(firstClickCard==null){
            firstClickCard = card;
        }else{
            secondClickCard = card;
            var path = llk.link([firstClickCard.x,firstClickCard.y], [secondClickCard.x,secondClickCard.y]);
            // console.log("!!!!!!"+firstClickCard.x+","+firstClickCard.y+" "+secondClickCard.x+","+secondClickCard.y);
            // console.log("~~~~~~"+path);
            if(!path){
                firstClickCard.cancelSelected();
                firstClickCard = secondClickCard;
                secondClickCard = null;
                return;
            }
            linkAudio.load();
            linkAudio.play();
            resetAutoTip();
            isMissing = true;
            totalCanChooseCardNum-=2;
            addTotalScore();
            drawLinkLine(firstClickCard,path,secondClickCard);
            firstClickCard.removeSelf(null);
            secondClickCard.removeSelf(function () {
                // 处理图标变化
                // console.log(llk.getMapArr());
                layout.handleLayout(gameObj.curLevel, llk.getMapArr());
                // console.log(llk.getMapArr());
                // 刷新图标
                refreshCard(llk.getMapArr());
                isMissing = false;
                firstClickCard = null;
                secondClickCard = null;
                checkIsFinished();
            },true);
        }
    }
}

function refreshCard(map) {
    var x_max = gameObj.levelConfig.col+2;
    var y_max = gameObj.levelConfig.row+2;
    for(var i=0; i<x_max; i++) {
    for(var j=0; j<y_max; j++) {
        if(i == 0 || j == 0 || i == x_max-1 || j == y_max-1) {
            continue;
        }else{
            // console.log("map[i][j].type:"+map[i][j].type);
            map[i][j].changeTypeAndUpdateImage(map[i][j].type);
        }
    }
}
}

function addTotalScore() {
    gameObj.totalScore += GAME_CONST.LINK_SCORE;
    if(gameObj.totalScore>=GAME_CONST.MAX_SCORES[gameObj.curLevel-1]){
        gameObj.totalScore = GAME_CONST.MAX_SCORES[gameObj.curLevel-1];
    }
}

function stopGameTime() {
    isGameTimeCounting = false;
}

function startGameTime() {
    isGameTimeCounting = true;
}

function addExtraTotalScore() {
    // 过关奖励，每省一秒得2分
    var extraScore =remainSec*2;
    gameObj.totalScore += extraScore;
    if(gameObj.totalScore>=GAME_CONST.MAX_SCORES[gameObj.curLevel-1]){
        gameObj.totalScore = GAME_CONST.MAX_SCORES[gameObj.curLevel-1];
    }
}

function checkIsFinished() {
    if(totalCanChooseCardNum<=0){
        bgAudio.pause();
        stopGameTime();
        addExtraTotalScore();
        sendGateFinishMsg();
        if(hasPassAllLevel()){
            onPopUpPassAllDialog();
        }else{
            showNextLevelDialog({
                "curGate":gameObj.curLevel,
                "onEndGame":function () {
                    onPopUpGameEndDialog();
                },
                "onNextLevel":function () {
                    gameObj.curLevel++;
                    updateLevelConfig();
                    resetGame();
                    startGameTime();
                }
            })
        }
    }else{
        var p = llk.getLink();
        while(p == null || p.length < 1)
        {
            refreshCurrentMap();
            p = llk.getLink();
        }
    }
}

function onPopUpPassAllDialog() {
    showPassAllDialog({
        "totalScore":gameObj.totalScore,
        "totalTime":gameObj.totalTime,
        "antiAddictionState":localGetAntiAddictionStateForJs(),
        "onEndGame":function () {
            sendData2FlashAndGoBack2Flash();
        }
    })
}

function onPopUpGameEndDialog() {
    sendFinishGameMsg(gameObj.totalScore);
    showGameEndDialog({
        "totalScore":gameObj.totalScore,
        "totalTime":gameObj.totalTime,
        "antiAddictionState":localGetAntiAddictionStateForJs(),
        "onEndGame":function () {
            sendData2FlashAndGoBack2Flash();
        },
        "onRestart":function () {
            clearCurrentCards();
            restartGameData();
            resetGame();
        }
    })
}

function sendData2FlashAndGoBack2Flash() {
    console.log("send to flash with score,and go back 2 flash"+gameObj.totalScore);
    localCloseVBox();
}

function onPopUpQuitConfirmDialog() {
    sendPlayOrStopMsg(false);
    isGameTimeCounting = false;
    autoTimeCounting = false;
    bgAudio.pause();
    showQuitConfirmDialog({
        "onContinueGame":function () {
            bgAudio.play();
            sendPlayOrStopMsg(true);
            isGameTimeCounting = true;
        },
        "onEndGame":onPopUpGameEndDialog
    })
}

function onPopUpStopDialog() {
    sendPlayOrStopMsg(false);
    isGameTimeCounting = false;
    autoTimeCounting = false;
    bgAudio.pause();
    showStopDialog({
        "onContinueGame":function () {
            sendPlayOrStopMsg(true);
            isGameTimeCounting = true;
            bgAudio.play();
        }
    })
}

var LINE ={
    createNew:function (x,y,width,height,images) {
        var tmpLine = {};
        tmpLine.x = x;
        tmpLine.y = y;
        if(width!=-1){
            tmpLine.width = width;
        }
        if(height!=-1){
            tmpLine.height = height;
        }
        tmpLine.images = images;

        tmpLine.render2canvas = function (ctx,callback) {
           playAnimation(ctx,tmpLine.images,tmpLine.x,tmpLine.y,callback,null,tmpLine.width,tmpLine.height);
        };
        return tmpLine;
    }
}

function drawLinkLine(start, path, end) {
    var linkArr = [];
    linkArr.push(path[0]);
    for(var i=1; i<path.length-1; i++) {
        if(path[i-1][0] != path[i+1][0] && path[i-1][1] != path[i+1][1]) {
            linkArr.push(path[i]);
        }
    }
    linkArr.push(path[path.length-1]);
    // console.log("real line is:", linkArr);

    var line = null;
    var card1 = null;
    var card2 = null;
    var tempLines = [];

    var x;
    var y;
    var images = [];
    var width;
    var height;
    for(i=0; i<linkArr.length-1; i++) {
        if(linkArr[i][0] == linkArr[i+1][0]) {
            card1 = llk.getMapArr()[linkArr[i][0]][linkArr[i][1]];
            card2 = llk.getMapArr()[linkArr[i+1][0]][linkArr[i+1][1]];
            if(card1.initY < card2.initY) {
                x = card1.initX + GAME_CONST.cardWidth/2;
                y = card1.initY + GAME_CONST.cardHeight/2;
            } else {
                x = card2.initX + GAME_CONST.cardWidth/2;
                y = card2.initY + GAME_CONST.cardHeight/2;
            }
            height= Math.abs(card2.initY - card1.initY);
            images = verticalLineImages;
            line = LINE.createNew(x,y,-1,height,images.concat());
            tempLines.push(line);
        } else if(linkArr[i][1] == linkArr[i+1][1]) {
            card1 = llk.getMapArr()[linkArr[i][0]][linkArr[i][1]];
            card2 = llk.getMapArr()[linkArr[i+1][0]][linkArr[i+1][1]];
            if(card1.initX < card2.initX) {
                x = card1.initX + GAME_CONST.cardWidth/2;
                y = card1.initY;
            } else {
                x = card2.initX + GAME_CONST.cardWidth/2;
                y = card2.initY ;
            }
            width = Math.abs(card2.initX - card1.initX);
            images = crossLineImages;
            line = LINE.createNew(x,y,width,-1,images.concat());
            tempLines.push(line);
        } else {
            // 出错了啊
            console.log("出错啦！！！！！！！！！！！！！！！！！！！！！！");
        }
    }

    for (i = 0; i <tempLines.length; i++) {
        var tmpLine = tempLines[i];
        tmpLine.render2canvas(animationCtx,function () {

        })
    }

}


function render() {
    if(isAllUiReady){
        ctx.drawImage(backgroundImage,-53,-18);
        ctx.drawImage(gamemainImage,78,64);
        ctx.drawImage(infoImage,80,17);

        renderText(ctx,remainSec,165,27);
        renderText(ctx,gameObj.curLevel,467,27);
        renderText(ctx,gameObj.totalScore,758,27);

        renderText(ctx,remainRefreshTime,921,260);
        renderText(ctx,remainTipTime,921,357);
    }

    if (isCardReady&&!isInitGame){
        createMap();
        isInitGame = true;
    }

    if(isReadyGoAnimationReady&&!hadStartedPlayReadyMovie){
        hadStartedPlayReadyMovie = true;
        playAnimation(animationCtx,readyGoAnimationImages, 129.55,168,function () {
            hadEndedPlayReadyMovie = true;
            isGameTimeCounting = true;
        },bgGrayImage)
    }

}


