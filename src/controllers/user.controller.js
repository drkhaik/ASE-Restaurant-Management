import userService from '../services/user.service';

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
        return res.status(200).json({
            errCode: 1,
            message: 'Missing input parameters!'
        })
    }
    try {
        let response = await userService.handleLoginService(email, password)
        // if (response?.data?.access_token) {
        //     res.cookie("jwt", response.data.access_token,
        //         { httpOnly: true, maxAge: 60 * 60 * 1000, secure: true, sameSite: 'none' });
        // }
        return res.status(200).json(response);
    } catch (e) {
        // console.log("check e", e);
        return res.status(200).json({
            errCode: -1,
            // message: res.message,
        })
    }
}


let saveNewUser = async (req, res) => {
    try {
        let response = await userService.saveUserService(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            message: "Error from server...",
        })
    }
}

let fetchAllUser = async (req, res) => {
    try {
        let response = await userService.fetchAllUserService();
        return res.status(200).json(response);

    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            message: "Error from server...",
        })
    }
}


module.exports = {
    handleLogin,
    fetchAllUser,
    saveNewUser
}