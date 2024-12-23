import {
    handleLoginService,
    saveUserService,
    fetchAllUserService,
    getRolesService
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

/*Get và post tạo user mới*/
export const getUserCreate = async (req, res, next) => {
    try {
        let response = await getRolesService();
        if (response.errCode === 0) {
            res.render('./user/form-add-user', { title: 'Add new User', roles: response.data });
        } else {
            res.status(500).json({ message: response.message });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Sth went wrong...');
    }
}

export const postUserCreate = async (req, res, next) => {
    try {
        let response = await saveUserService(req.body);
        console.log("check req.body", req.body);
        if (response.errCode === 0) {
            return res.redirect('/users');
        } else {
            return res.status(500).json({ message: response.message });
        }
    } catch (e) {
        console.log("check e", e);
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
            res.render('user/manage-user', { title: 'User Management', users: response.data });
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
