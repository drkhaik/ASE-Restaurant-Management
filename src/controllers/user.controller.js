import {
    handleLoginService,
    saveUserService,
    fetchAllUserService
} from '../services/user.service.js';

export const handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
        return res.status(200).json({
            errCode: 1,
            message: 'Missing input parameters!'
        })
    }
    try {
        let response = await handleLoginService(email, password)
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


export const saveNewUser = async (req, res) => {
    try {
        let response = await saveUserService(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            message: "Error from server...",
        })
    }
}

export const fetchAllUser = async (req, res) => {
    try {
        let response = await fetchAllUserService();
        if (response.errCode === 0) {
            res.render('user/manage-user', { title: 'Get all User', users: response.data });
        } else {
            res.status(500).json({ message: response.message });
        }
    } catch (e) {
        console.log("check e", e);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server...",
        })
    }
}
