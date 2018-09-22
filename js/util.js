
/**
 * 渲染文字
 * @param ctx
 * @param text
 * @param x
 * @param y
 */
function renderText(ctx,text,x,y) {
    ctx.fillStyle = "#00000";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(text, x,y);
}

/**
 *画动画
 * @param ctx
 * @param imgs
 * @param x
 * @param y
 * @param callback
 */
var animationCanvasZindex;
var isInit = false;
var grayBgDiv;
function playAnimation(ctx,imgs,x,y,callback,bgGrayIamge,dWidth,dHeight) {
    imgs = imgs.concat();
    if(!isInit){
        animationCanvas= document.getElementById('animation');
        animationCanvasZindex = animationCanvas.style.zIndex;
        if(bgGrayIamge!=null&&bgGrayIamge!=undefined){
            grayBgDiv = document.createElement("div");
            grayBgDiv.appendChild(bgGrayIamge);
            grayBgDiv.style ="position:absolute;left:0px;top:0px;z-index:98;opacity:0.5;"
            document.body.appendChild(grayBgDiv);
        }
        isInit = true;
    }
    if(imgs.length==0){
        if(bgGrayIamge!=null){
            document.body.removeChild(grayBgDiv);
        }
        animationCanvas.style.zIndex = animationCanvasZindex;
        isInit = false;
        ctx.clearRect(0,0,960,560);
        if(callback!=null){
            callback();
        }
        return;
    }
    animationCanvas.style.zIndex = "99";
    renderImg(imgs,bgGrayIamge)

    function renderImg(imgs,bgGrayIamge) {
        var tmpImg = imgs.shift();
        if(dWidth==undefined){
            dWidth = tmpImg.width;
        }
        if(dHeight==undefined){
            dHeight = tmpImg.height;
        }
        ctx.drawImage(tmpImg,x,y,dWidth,dHeight);
        setTimeout(function () {
            // ctx.clearRect(0,0,960,560);
            ctx.clearRect(x,y,dWidth,dHeight);
            playAnimation(ctx,imgs,x,y,callback,bgGrayIamge,dWidth,dHeight);
        },42)
    }
}

/**
 * createButton
 * @param parent
 * @param clsName
 * @param onClick
 * @param title
 */
function createButton(parent,clsName,onClick,title) {
    var btn = document.createElement("button");
    btn.className = clsName;
    if(title!=undefined&&title!=null){
        btn.title = title;
    }
    btn.onclick = function () {
        onClick();
    };
    parent.appendChild(btn);
    return btn;
}

/**
 * createTextDiv
 * @param parent
 * @param clsName
 * @param textValue
 * @returns {HTMLDivElement}
 */
function createTextDiv(parent,clsName,textValue) {
    var div = document.createElement("div");
    var tmpText = document.createTextNode(textValue);
    div.appendChild(tmpText);
    div.className = clsName;
    parent.appendChild(div);
    return div;
}
/**
 * 生成地图图标类型
 * @param row
 * @param col
 * @param cardTypeNum
 * @returns {Array}
 */
function generateIcons(row,col,cardTypeNum) {
    var icons = [];
    var totalGridNum = row*col;
    fillArray(icons,totalGridNum,cardTypeNum);
    return icons;

}

function fillArray(container, emptys, types) {
    if(emptys <= 0) {
        return;
    }
    var _num = Math.floor(emptys/types);
    _num += _num%2 == 1?-1:0;
    if(_num < 2) {
        fillArray(container, emptys, --types);
        return;
    }
    for(var i=0; i<types*_num; i++) {
        container.push( Math.floor(i/_num) );
    }

    fillArray(container, emptys-types*_num, --types);
}