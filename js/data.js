
var gameObj={};
gameObj.curLevel = 1;
gameObj.totalScore = 0;
gameObj.totalTime  =0;

function restartGameData() {
    gameObj.curLevel = 1;
    gameObj.totalScore = 0;
    gameObj.totalTime  =0;
    updateLevelConfig();
}

var GAME_CONST = {
    // 每消去一对所得分�?
    LINK_SCORE:5,
    MAX_SCORES:[80,200,350,560,800,1070,1370,1700,2060,2450,2870,3320],

    levels:12,
    GameId:1,

    AutoTipNeedSec:15,

    GAME_STATE:{
        ENTER_NEXT_LEVEL:1,
        GAME_OVER_FAILURE:2,
        GAME_OVER_THROUGH:3,
        GAME_OVER_EXIT:4,
        GAME_PLAYING:5
    },

    maxCardNum:30,

    cardWidth:48.5,
    cardHeight:48.5,

    levelSettings:[
        {cardNum:4, row:4, col:4, prompt:4, refresh:4, time:40},
        {cardNum:8, row:4, col:6, prompt:4, refresh:4, time:50},
        {cardNum:10, row:6, col:8, prompt:4, refresh:4, time:90},
        {cardNum:15, row:6, col:8, prompt:4, refresh:4, time:90},
        {cardNum:15, row:8, col:12, prompt:4, refresh:4, time:180},
        {cardNum:15, row:8, col:12, prompt:4, refresh:4, time:180},
        {cardNum:15, row:8, col:12, prompt:4, refresh:4, time:180},
        {cardNum:20, row:8, col:14, prompt:4, refresh:4, time:230},
        {cardNum:20, row:8, col:14, prompt:4, refresh:4, time:230},
        {cardNum:20, row:8, col:14, prompt:4, refresh:4, time:230},
        {cardNum:25, row:8, col:14, prompt:4, refresh:4, time:230},
        {cardNum:30, row:8, col:14, prompt:4, refresh:4, time:250}

    ]
};



function updateLevelConfig() {
    gameObj.levelConfig = GAME_CONST.levelSettings[gameObj.curLevel-1];
}

function hasPassAllLevel(){
    return gameObj.curLevel>=GAME_CONST.levels;
}

updateLevelConfig();