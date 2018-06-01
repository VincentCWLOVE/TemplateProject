/**
 * Created by vincent on 2018/5/2.
 */

var paramsErrMsg = function(params_name){
    return {
        errCode:0,
        msg:"缺少参数："+params_name
    }
}
var dbErrMsg = function(err){
    return {
        errCode:0,
        msg:"发生了错误",
        err:err
    }
}
var successMsg = function(result){
    return {
        errCode:1,
        msg:"请求成功",
        result:result
    }
}

var illegalMsg = function(){
    return {
        errCode:0,
        msg:"非法请求"

    }
}

var descMsg = function(des){
    return {
        errCode:0,
        msg:des
    }
}

module.exports = {
    paramsErrMsg:paramsErrMsg,
    dbErrMsg:dbErrMsg,
    successMsg:successMsg,
    illegalMsg:illegalMsg,
    descMsg:descMsg
}