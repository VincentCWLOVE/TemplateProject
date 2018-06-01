var express = require('express');
var router = express.Router();


var mongoose = require("mongoose")

var until = require('../until')

var {ensureUser,ensureAdmin} = require('./privilege')


/*
*
*
* RestFul Api 路由
* */

router.all('/api/*', function(req, res, next) {
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});


// 不授权访问
router.all("/welcome",require("./welcome"))

// 授权访问
router.all("/user/welcome",ensureUser,require("./welcome"))
router.all("/admin/welcome",ensureAdmin,require("./welcome"))

router.all("/api/is/success/connected/db",function(req, res, next){
    var db = mongoose.connect("mongodb://@localhost:27017/dbname",function(err){
        if(err){
            res.json(until.dbErrMsg(err))
        }else{
            res.json(until.successMsg({
                type:"success connect db"
            }))
        }
    })
})

/*
*
* 微信相关
* */
router.all("/wechat/welcome",require("./wechat/welcome"))

module.exports = router;
