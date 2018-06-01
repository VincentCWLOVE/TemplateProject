const crypto = require('crypto');
let token = '您的微信公众号设定的token';
function checkSignature(signature,timestamp,nonce,token){
   let tmpArr = [token,timestamp,nonce];
   tmpArr.sort();
   let tmpStr = tmpArr.join('');
   let shasum = crypto.createHash('sha1');
   shasum.update(tmpStr);
   let shaResult = shasum.digest('hex');
   if(shaResult === signature){
       return true;
   }
   return false;
}




module.exports =  (req, res) => {
   let signature = req.param('signature');
   let timestamp = req.param('timestamp');
   let nonce = req.param('nonce');
   let echostr = req.param('echostr');
   if(checkSignature(signature,timestamp,nonce,token)){
       res.send(echostr);
   }else{
       res.send('invalid request');
   }


};

