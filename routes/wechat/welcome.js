var wechat = require('wechat');

var express = require('express');

var router = express.Router();
var config = {
    token: '',
    appid: '',
    appsecret:"",
    EncodingAESKey: ''

};


var API = require('wechat-api');
var api = new API(config.appid, config.appsecret);

var until = require('../../until')

router.use(express.query());

router.use('/', wechat(config, (req, res, next) => {

    var message = req.weixin;

    var Event = message.Event

    var openid = message.FromUserName

    res.reply("请稍候...")
    switch(Event) {

        case "subscribe":

            message.EventKey = message.EventKey.substr(8)

        case  "SCAN":


        case "CLICK":


        default :
            var MsgType = message.MsgType
            res.reply("请稍候...")
            switch (MsgType){
                case "text":

                    break;
                case "location":

                    res.transfer2CustomerService();

                    break;
                case "voice":

                    res.transfer2CustomerService();

                    break;
                case "video":

                    res.transfer2CustomerService();

                    break;
                case "image":

                    res.transfer2CustomerService();

                    break;
                default :

                    res.transfer2CustomerService();

                    break;
            }

            break;
    }


}))

module.exports = router;