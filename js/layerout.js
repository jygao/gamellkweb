var rows;
var cols;
var LayoutManager = {
    createNew: function () {
        var tmpLayout = {};
        tmpLayout.handleLayout = function (level, map) {
            tmpLayout.cols = map.length;
            cols = tmpLayout.cols;
            tmpLayout.rows = map[0].length;
            rows = tmpLayout.rows;
            switch (level) {
                case 1:
                    return;
                    break;
                case 2:
                    return;
                    break;
                case 3:
                    return;
                    break;
                case 4:
                    return;
                    break;
                case 5:
                    change_AllDown(map);
                    break;
                case 6:
                    change_AllLeft(map);
                    break;
                case 7:
                    change_AllRight(map);
                    break;
                case 8:
                    change_AllUp(map);
                    break;

                case 9:
                    change_LeftRightToCenter(map);
                    break;
                case 10:
                    change_CenterToLeftRight(map);
                    break;
                case 11:
                    change_TopBottomToMiddle(map);
                    break;
                case 12:
                    change_MiddleToTopBottom(map);
                    break;
            }
        }


        return tmpLayout;
    }
};

function change_AllLeft(map) {
    for (var j = 1; j < rows - 1; j++) {
        var temp = new Array();
        for (var i = 1; i < cols - 1; i++) {
            if (map[i][j].type > -1) {
                temp.push(map[i][j].type);
                map[i][j].type = -1;
            }
        }
        //如果该列仍有方块
        if (temp.length > 0) {
            for (var k = 0; k < temp.length; k++) {
                map[k + 1][j].type = temp[k];
            }
        }
    }
}

//整个地图的方块都往右靠
function change_AllRight(map) {
    for (var j = 1; j < rows - 1; j++) {
        var temp = new Array();
        for (var i = cols - 1; i > 0; i--) {
            if (map[i][j].type > -1) {
                temp.push(map[i][j].type);
                map[i][j].type = -1;
            }
        }
        //如果该列仍有方块
        if (temp.length > 0) {
            for (var k = 0; k < temp.length; k++) {
                map[cols - 2 - k][j].type = temp[k];
            }
        }
    }
}

//整个地图的方块都往上升
function change_AllUp(map) {
    for (var i = 1; i < cols; i++) {
        var temp = new Array(); //记录非零的数据
        for (var j = 1; j < rows; j++) {
            if (map[i][j].type > -1) {
                temp.push(map[i][j].type);
                map[i][j].type = -1;
            }
        }
        //如果该列仍有方块
        if (temp.length > 0) {
            for (var k = 0; k < temp.length; k++) {
                map[i][k + 1].type = temp[k];
            }
        }
    }
}

//整个地图的方块都往下沉
function change_AllDown(map) {
    for (var i = 1; i < cols - 1; i++) {
        var temp = new Array(); //记录非零的数据
        for (var j = rows - 1; j > 0; j--) {
            if (map[i][j].type > -1) {
                temp.push(map[i][j].type);
                map[i][j].type = -1;
            }
        }
        //如果该列仍有方块
        if (temp.length > 0) {
            for (var k = 0; k < temp.length; k++) {
                map[i][rows - 2 - k].type = temp[k];
            }
        }
    }
}

//整个地图的方块都往左右两边靠
//原理,统计每一列的非零数据并存于临时数组同时记录应往左靠的方块个数.
function change_CenterToLeftRight(map) {
    for (var j = 1; j < rows - 1; j++) {
        var temp = new Array(); //记录非零的数据
        var leftCount = 0; //应靠往左边的方块数
        for (var i = 1; i < cols - 1; i++) {
            if (map[i][j].type > -1) {
                temp.push(map[i][j].type);
                if (i < cols / 2)
                    leftCount++;
            }
        }
        //如果该行仍有方块
        if (temp.length > 0) {
            var t = 0;
            for (var k = 1; k < cols - 1; k++) {
                if (k <= leftCount || k >= cols - 1 - (temp.length - leftCount)) {
                    map[k][j].type = temp[t++];
                } else {
                    map[k][j].type = -1;
                }
            }
        }
    }
}

//地图上的所有方块从左右往中间靠
function change_LeftRightToCenter(map) {
    for (var j = 1; j < rows; j++) {
        var temp = new Array(); // 保存非0数据
        var leftCount = 0; //左边往中靠的方块数
        for (var i = 1; i < cols - 1; i++) {
            if (map[i][j].type > -1) {
                temp.push(map[i][j].type);
                if (i < cols / 2)
                    leftCount++;
            }
        }
        //如果该行仍有方块
        if (temp.length > 0) {
            var t = 0;
            for (i = 1; i < cols - 1; i++) {
                if (i >= (cols / 2 - leftCount) && i < cols / 2 + temp.length - leftCount) {
                    map[i][j].type = temp[t++];
                } else {
                    map[i][j].type = -1;
                }
            }
        }
    }
}

//方块从中间往上下分开
function change_MiddleToTopBottom(map) {
    for (var i = 1; i < cols - 1; i++) {
        var temp = new Array(); //保存非0数据
        var topCount = 0; //应该往上升的方块数量
        for (var j = 1; j < rows - 1; j++) {
            if (map[i][j].type > -1) {
                temp.push(map[i][j].type);
                if (j < rows / 2)
                    topCount++;
            }
        }
        //如果该列仍有方块
        if (temp.length > 0) {
            var t = 0;
            for (j = 1; j < rows - 1; j++) {
                if (j <= topCount || j >= rows - 1 - (temp.length - topCount)) {
                    map[i][j].type = temp[t++];
                } else {
                    map[i][j].type = -1;
                }
            }
        }
    }
}

function change_TopBottomToMiddle(map) {
    for (var i = 1; i < cols - 1; i++) {
        var temp = new Array(); //保存非0数据
        var topCount = 0; //应该往上升的方块数量
        for (var j = 1; j < rows - 1; j++) {
            if (map[i][j].type > -1) {
                temp.push(map[i][j].type);
                if (j < rows / 2)
                    topCount++;
            }
        }
        //如果该列仍有方块
        if (temp.length > 0) {
            var t = 0;
            for (j = 1; j < rows - 1; j++) {
                if (j >= (rows / 2 - topCount) && j < rows / 2 + temp.length - topCount) {
                    map[i][j].type = temp[t++];
                } else {
                    map[i][j].type = -1;
                }
            }
        }
    }
}