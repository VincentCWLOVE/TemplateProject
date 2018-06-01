const  mongoose = require('mongoose')
const  jwt = require('jsonwebtoken')
const config = {
    secretToken:"d123dsaqwsdfsdf"
}
const bcrypt = require('bcrypt')
const SALT_WORK_FATOR = 10

let userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        validate:{
            validator: function (v) {
                return /^1[3|4|5|8][0-9]\d{4,8}$/.test(v)
            },
            message:"{VALUE}不是一个电话号码"
        }
    },
    role:{
        type:String,
        default:"user",
        validate:{
            validator: function (v) {
                return v == 'admin_type_1' || v == 'admin_type_2' || v == 'user'
            },
            message:"{VALUE}应该是admin_type_1 admin_type_2 user 中的一个"
        },
        require:true
    },

    access_token:{
        type:String,
    },

})

// Bcrypt middleware on UserSchema
userSchema.pre('save', function(next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            user.access_token = jwt.sign({id: user._id}, config.secretToken);
            next();
        });
    });
});

userSchema.method({
    comparePassword: function (password) {
        var that = this

       return new Promise((resolve,reject)=>{
            bcrypt.compare(password, that.password, function (err, isMatch) {
                if (err) {
                    reject(err)
                } else {
                    resolve(isMatch)
                }

            });
        })

    },
})


// 静态方法
userSchema.static({

    findByToken: function(access_token,callback){
        return this.model("User").findOne({access_token:access_token}).exec(callback)
    },
    findByPhone: function(phoneno,callback){

        return this.model("User").findOne({phoneno:phoneno}).exec(callback)
    },



})




module.exports = mongoose.model('User',userSchema)