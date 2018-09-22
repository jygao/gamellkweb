
var LLK_ROUTE=
{
    createNew:function() {
        var llkRoute={};
        llkRoute.setMapArr = function(values) {
            llkRoute.mapArr = values;
            llkRoute.rowNum = llkRoute.mapArr.length;
            llkRoute.colNum = llkRoute.mapArr[0].length;
            llkRoute.getTypes();
         };

        llkRoute.getMapArr = function() {
            return llkRoute.mapArr;
        };

        llkRoute.getTypes = function() {
            llkRoute.types = new Array();
            for(var x_=0; x_<llkRoute.rowNum; x_++)
            {
                for(var y_=0; y_<llkRoute.colNum; y_++)
                {
                    llkRoute.types[String(llkRoute.mapArr[x_][y_].type)] = "aola";
                }
            }
        };

        llkRoute.link = function(a_, b_, test) {
            if(!llkRoute.mapArr)return null;
            var a = llkRoute.mapArr[a_[0]][a_[1]];
            var b = llkRoute.mapArr[b_[0]][b_[1]];

            if (a.type != b.type) return null;
            if (a.x == b.x && a.y == b.y) return null;

            // 如果两个点中有一个是孤立的，直接返回
            // trace(checkSeparate(a_, a.type), checkSeparate(b_, b.type));
            if(checkSeparate(a_, a.type) || checkSeparate(b_, b.type) ) {
                return null;
            }

            var path = new Array();
            // v：增量
            var t1, t2, v;
            var _p;
            //横
            for (var x_=0; x_<llkRoute.rowNum; x_++) {
                _p = new Array();
                //循环A
                v = x_ < a.x?-1:1;
                t1 = a.x;
                t2 = x_;
                for (; t1 != t2; t1 += v) {
                    _p.push([t1,a.y]);
                }
                //循环A2B
                v = a.y < b.y?1:-1;
                t1 = a.y;
                t2 = b.y;
                for (; t1 != t2; t1 += v) {
                    _p.push([x_,t1]);
                }
                //循环B
                v = x_ < b.x?1:-1;
                t1 = x_;
                t2 = b.x;
                for (; t1 != t2; t1 += v) {
                    _p.push([t1,b.y]);
                }
                //每次路径删除A点本身
                _p.shift();
                path.push(_p);
            }
            //printArr(path);
            //竖
            for (var y_=0; y_<llkRoute.colNum; y_++) {
                _p = new Array();
                //循环A
                v = y_ < a.y?-1:1;
                t1 = a.y;
                t2 = y_;
                for (; t1 != t2; t1 += v) {
                    _p.push([a.x,t1]);
                }
                //循环A2B
                v = a.x < b.x?1:-1;
                t1 = a.x;
                t2 = b.x;
                for (; t1 != t2; t1 += v) {
                    _p.push([t1,y_]);
                }
                //循环B
                v = y_ < b.y?1:-1;
                t1 = y_;
                t2 = b.y;
                for (; t1 != t2; t1 += v) {
                    _p.push([b.x,t1]);
                }
                //每次路径删除A点本身
                _p.shift();
                path.push(_p);
            }
            //printArr(path);
            path = path.filter(pathFilter);
            //printArr(path);
            if (path.length > 0) {
                path.sort(pathSort);
                if(!test){
                    a.type = -1;
                    b.type = -1;
                    var temp = path[0];
                    //添加首尾两点于路径中
                    temp.unshift([a.x, a.y]);
                    temp.push([b.x, b.y]);
                    return temp;
                }
                return path[0];
            } else {
                return null;
            }
        };

        llkRoute.getLink = function(){
            for( var i in llkRoute.types){
                if(i == "-1") continue;
                var mapArrArray = getTypesMap(i);
                if(!mapArrArray) continue;
                for(var k = 0; k<mapArrArray.length; k++)
                {
                    for(var j = 0;j<mapArrArray.length;j++)
                    {
                        if(k==j) continue;
                        var p = llkRoute.link(mapArrArray[k], mapArrArray[j], true);
                        if(p) {
                            return [mapArrArray[k], mapArrArray[j]];
                        }
                    }
                }
            }
            return null;
    };
        function getTypesMap(_type){
            var _mapArr = new Array();
            for(var x_ = 0; x_<llkRoute.rowNum; x_++)
            {
                for(var y_ = 0;y_<llkRoute.colNum;y_++)
                {
                    if(llkRoute.mapArr[x_][y_].type == _type && !checkSeparate([x_,y_],_type)) {
                        _mapArr.push([x_,y_]);
                    }
                }
            }
            return _mapArr.length>0 ? _mapArr:null;
        }

        function checkSeparate(arr, _type){
            if(llkRoute.mapArr[arr[0]][arr[1]-1].type == -1 || llkRoute.mapArr[arr[0]][arr[1]-1].type == _type)return false;
            if(llkRoute.mapArr[arr[0]+1][arr[1]].type == -1 || llkRoute.mapArr[arr[0]+1][arr[1]].type == _type)return false;
            if(llkRoute.mapArr[arr[0]][arr[1]+1].type == -1 || llkRoute.mapArr[arr[0]][arr[1]+1].type == _type)return false;
            if(llkRoute.mapArr[arr[0]-1][arr[1]].type == -1 || llkRoute.mapArr[arr[0]-1][arr[1]].type == _type)return false;
            return true;
        }

        function pathFilter(a, b, c)
        {
            for (var i = 0; i<a.length; i++) {
                if (llkRoute.mapArr[a[i][0]][a[i][1]].type != -1) {
                    return false;
                }
            }
            return true;
        }

        return llkRoute;
    }
}


function printArr(path) {
    for (var i = 0; i < path.length; i++) {
        var arr = path[i];
        console.log(arr);
    }
}

function pathSort(a, b) {
    return a.length < b.length ? -1 : 1;
}