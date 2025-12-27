const { OTPSenderService, VerifyLoginService, SaveProfileService, ProfileDetailsService } = require("../service/UserService");

exports.OTPSender = async (req, res) => {
    let data = await OTPSenderService(req);
    return res.status(200).json(data)
}

exports.VerifyLogin = async (req, res) => {
    let data = await VerifyLoginService(req);
    if(data?.['status'] === 'success'){
        let cookieOption = {
            expires: new Date(Date.now() + 48 * 60 * 60 * 1000),
            httpOnly: false,
        }
        res.cookie('token', data['token'], cookieOption)
        return res.status(200).json(data)
    }else{
        return res.status(200).json(data)
    }

}

exports.Logout = async (req, res) => {
    try {
        let cookieOption = {
            expires: new Date(Date.now() + 48 * 60 * 60 * 1000),
            httpOnly: false
        }
        res.cookie('token', "", cookieOption)
        return res.status(200).json({status: 'Logout', message: 'You\'ve logout successfully '})
    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}

exports.SaveProfile = async (req, res) => {
    let data = await SaveProfileService(req);
    return res.status(200).json(data)
}

exports.ProfileDetails = async (req, res) => {
    let data = await ProfileDetailsService(req);
    return res.status(200).json(data)
}