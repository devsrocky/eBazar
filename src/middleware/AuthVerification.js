const { DecodeToken } = require("../utility/TokenHelper")

module.exports = (req, res, next) => {
    let token = req.headers['token']
    if(!token){
        token = req.cookies['token']
    }

    let decoded = DecodeToken(token);
    if(decoded === null){
        res.status(200).json({status: 'failed', message: 'Token decoding failed'})
    }else{
        req.headers['Userdetails'] = JSON.stringify(decoded)
        next()
    }
}