const ProfileModel = require('../model/ProfileModel');
const UserModel = require('../model/UserModel');
const mailTemplates = require('../templates/mailTemplates');
const SendEmail = require('../utility/SendEmail');
const { EncodeToken } = require('../utility/TokenHelper');

const OTPSenderService = async (req) => {
    try {
        let email = req.params.email;
        let Otp = Math.floor(100000 + Math.random() * 900000)
        let subject = `Shop verification OTP code`

        const tmp = new mailTemplates().OTPTemplate(Otp)
        let send = await SendEmail(email, subject, tmp)
        if(send && send.accepted && send.accepted.length > 0){
            await UserModel.updateOne({email: email}, {$set: {otp: Otp}}, {upsert: true})
            return {status: 'success', message: 'We\'ve sent 6 digit otp'}
        }
        return {status: 'failed', message: 'There went something wrong!'}
    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}

const VerifyLoginService = async (req) => {
    try{
        let email = req.params.email;
        let OTP = req.params.OTP;

        let matchUser = await UserModel.find({email: email, otp: OTP}).countDocuments();
        if(matchUser === 1){

            let userID = await UserModel.find({email: email, otp: OTP}).select('_id')
            let Userdetails = {email: email, userID: userID[0]['_id']}
            let token = EncodeToken(Userdetails)
            await UserModel.updateOne({email: email}, {$set: {otp: '0'}})
            return {status: 'success', token: token}

        }else{
            return {status: 'Invalid', message: 'Invalid otp code'}
        }
    }catch(err){
        return {status: 'failed', message: err.toString()}
    }
}

const SaveProfileService = async (req) => {
    try {
        const Userdetails = JSON.parse(req.headers['Userdetails'])
        const Postbody = req.body;
        Postbody.userID = Userdetails['userID'];
        await ProfileModel.updateOne({userID: Userdetails['userID']}, {$set: Postbody}, {upsert: true})
        return {status: 'success', message: 'Profile saved success'}
        
    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}

const ProfileDetailsService = async (req, res) => {
    try {
        let user = JSON.parse(req.headers['Userdetails'])
        let details = await ProfileModel.find({userID: user['userID']})
        return {status: 'success', data: details}
    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}

module.exports = {
    OTPSenderService,
    VerifyLoginService,
    SaveProfileService,
    ProfileDetailsService
}