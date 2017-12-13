'use strict';
/**
 * @author: walei
 * @date:   2017-12-13
 * @desc:   日常工具方法
 */
var AsyQueue = function(){
    this._arrayFn = [];   //事件集合
    this._callback = {};  //最终回调
    this._backdata = [];  // 返回数据集合
    this._isParallel = false;  // 是否并行，默认否
    this._num = 1;  // 默认并发数
};

// 加入队列
AsyQueue.prototype.add = function(fn){
    this._arrayFn.push(fn);
    return this;
};

// 队列数目
AsyQueue.prototype.size = function(){
    return this._arrayFn.length;
};

// 获取返回数据集合
AsyQueue.prototype.getCallBack = function(){
    return this._backdata;
}

// 依次运行队列
AsyQueue.prototype.next = function(data){

    var fn = this.getNext();
    
    // 并行 or 串行
    (this._isParallel)?((fn)&&fn()):((fn)&&((data)?fn(data):fn()));
    
    // 集合返回数据
    (data)?this._backdata.push(data):this._backdata.push(false);
    
    // 返回总回调
    if(!this.size() && !fn) {
        if(typeof this._callback === 'function') {
            (data)?this._callback(data):this._callback();
        }
    };
    
    return this;
};

// 队列执行
AsyQueue.prototype.getNext = function(){
    if(this.size()){
        return this._arrayFn.shift();
    }
    return false;
}

// 初始化，完成后执行,第一个参数是默认并发数，第2个参数是否并行，第3个参数返回
AsyQueue.prototype.run = function(){
    var that = this;
    if(arguments.length === 1 ){
        that._callback = (typeof arguments[0] === 'function')?arguments[0]:{};
        that._isParallel = (typeof arguments[0] === 'boolean')?arguments[0]:false;
        that._num = (typeof arguments[0] === 'number')?arguments[0]:1;
    }      
    if(arguments.length === 2 ){
        that._num = (typeof arguments[0] === 'number')?arguments[0]:1;
        that._isParallel = (typeof arguments[1] === 'boolean')?arguments[0]:false;
    } 
    if(arguments.length === 3 ){
        that._num = (typeof arguments[0] === 'number')?arguments[0]:1;
        that._isParallel = (typeof arguments[1] === 'boolean')?arguments[0]:false;
        that._callback = (typeof arguments[2] === 'function')?arguments[0]:{};
    } 
    for (var index = 0; index < that._num; index++) {
        that.next();
    }
    
    return that;
};
return AsyQueue;
