var mongoose = require("mongoose");
var jwt = require('jsonwebtoken');
var config = {
    secretToken : 'aMdoeb5ed87zorRdkD6greDML81DcnrzeSD648ferFejmplx',
}
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var userSchema = new mongoose.Schema({
      email:{
            type:String,
            validate: {
                validator: function (v) {
                    return new RegExp(/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/).test(v);
                },
                message: '{VALUE} 不是一个邮箱地址',
            },
            //default:""


      },
      phoneno:{
            type:String,
            validate: {
                validator: function (v) {
                    return /^1[3|4|5|8][0-9]\d{4,8}$/.test(v);
                },
                message: '{VALUE} 不是一个电话号码',
            },
            //default:""
      },

      name: {
            type:String,
            required: true,
            maxlength: 30,
            default: "用户"+new Date().getTime()
      },
      sex:{
            type:String,
            default:"男" // 男 女 未知
      },

      register_date:{
            type: Date,
            default: Date.now
      },

      register_source:{
            type:String,
        // 用户使用什么来源注册
      },

      avatar:{
            type:String,

      },

      //我们可以将 用户的 wechat qq sina 等第三方平台的用户信息放入这个数组
      third_party_platform:[{
            platform_name:String,
            openid:String,
            detail:{

            }
      }],

      password:{
            type:String,
            required: true,
      },

      // 最近的一次登录时间
      recent_login_time:{
            type: Date,
            default: Date.now
      },

      // 最近的一次登录设备信息
      recent_login_device:{

      },

      // 最近的一次登录app的信息
      app_version_info:{

      },

    // hm00 表示最高级别管理员 hm01表示次级程序员
      role:{
            type:String,
            default:"hm01"
      },
      is_activation:{
            type:Boolean,
            default:false
      },

      access_token:{
            type:String,
      },
      shop_id:{
          type:String,
      }

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

//Password verification
userSchema.method({
    comparePassword: function (password, cb) {
        var that = this
        bcrypt.compare(password, that.password, function (err, isMatch) {
            if (err) {
                return cb(err, false);
            } else {
                return cb(null, isMatch);
            }

        });
    },
})


// 静态方法
userSchema.static({
    list: function(rows,page,callback){
        return this.model("User").find({role:{$ne:"hm00"}},{email:1,phoneno:1,name:1,avatar:1})
            .skip(page * rows)
            .limit(rows)
            .exec(callback)
    },
    findByToken: function(access_token,callback){
        return this.model("User").findOne({access_token:access_token}).exec(callback)
    },
    findByPhone: function(phoneno,callback){

        return this.model("User").findOne({phoneno:phoneno}).exec(callback)
    },
    findByEmail: function(email,callback){
        return this.model("User").findOne({email:email}).exec(callback)
    },
    findByWechat: function(platform_name,openid,callback){
        return this.model("User").findOne({
            third_party_platform:{
                $elemMatch:{
                platform_name:platform_name,
                openid:openid
            }
        }
      },{password:0}).exec(callback)
    },
    findByQQ: function(openid,callback){
        // to do something
    },



})




module.exports = mongoose.model('User',userSchema)
