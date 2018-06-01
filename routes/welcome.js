
const until = require('../until')

module.exports = (req,res)=>{
    res.json(until.successMsg({}))
}