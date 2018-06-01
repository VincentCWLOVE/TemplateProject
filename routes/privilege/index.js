
let until = require("../../until")
let {UserModel} = require('../../model')

let CheckUser = (access_token) => {
    return new Promise((resolve , reject)=> {
        UserModel.findOne({access_token:access_token}).exec((err,result)=>{
            if(err) reject(err)

            resolve(result)
        })
    })
}

let ensureAdmin = (req, res, next) => {
    if(req.method.toUpperCase() == "POST"){

        // req.body.token  查找数据库 校验tokenh

        CheckUser(req.body.token).then((result)=>{
            if(result.role == "admin_type_1"){
                next()
            }else {
                res.send(403)
            }



        }).catch((err)=>{
            res.json(until.dbErrMsg())
        })


    }else {
        res.json(until.illegalMsg())
    }
}

let ensureUser = (req, res, next) => {
    if(req.method.toUpperCase() == "POST"){

        // req.body.token  查找数据库 校验tokenh

        CheckUser(req.body.token).then((result)=>{
            if(result.role == "user"){
                next()
            }else {
                res.send(403)
            }

        }).catch((err)=>{
            res.json(until.dbErrMsg())
        })


    }else {
        res.json(until.illegalMsg())
    }
}

module.exports = {
    ensureUser,
    ensureAdmin
}