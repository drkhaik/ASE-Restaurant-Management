import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import Role from '../models/role.model.js';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    })
}

let fetchUserByUsername = async (username) => {
    return await User.findOne({username}).select({ createdAt: 0, updatedAt: 0 });
};

export const fetchUserExceptManagerRole = async() => {
    return await User.find({ role: { $ne: 'Manager' } });
}

export const saveUserService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isExist = await fetchUserByUsername(data.username);
            if (isExist) {
                resolve({
                    errCode: 1,
                    message: "Username already exists!"
                })
            } else {
                console.log("check data", data);
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await User.create({
                    name: data.name,
                    username: data.username,
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    role: data.role,
                    createdAt: new Date(),
                    updatedAt: new Date()
                })
                resolve({
                    errCode: 0,
                    message: "OK",
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

export const getRolesService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let roles = await Role.find({}).select({ createdAt: 0, updatedAt: 0, description: 0 });
            resolve({
                errCode: 0,
                message: "OK",
                data: roles
            })
        } catch (e) {
            reject(e)
        }
    })
}

export const fetchUserById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await User.findOne({
                // raw: true,
                _id: id
            }).select({
                __v: 0,
                createdAt: 0,
                updatedAt: 0,
                password: 0,
            });
            // users.get({ plain: true });
            resolve({
                errCode: 0,
                message: "OK",
                data: user
            })
        } catch (e) {
            reject(e)
        }
    })
}

export const updateUserService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data._id) {
                resolve({
                    errCode: 2,
                    message: 'Missing required parameters!'
                })
            }
            let user = await User.findOne({
                _id: data._id
            })
            // console.log("check res", user);
            if (user) {
                user.name = data.name;
                user.email = data.email;
                user.status = data.status;
                user.role = data.role;
                user.updatedAt = new Date();
                // await user.save(); // lưu 1 đối tượng ko quan tâm đã có hay chưa
                await User.updateOne({ _id: data._id }, user);
                resolve({
                    errCode: 0,
                    message: `Ok`
                });
            } else {
                resolve({
                    errCode: 1,
                    message: `The User not found!`
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

export const fetchUsersService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await User.find({}, { password: 0 })
                // .populate('roleID', 'name');
            resolve({
                errCode: 0,
                message: "OK",
                data: users
            })
        } catch (e) {
            reject(e)
        }
    })
}


// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (payload) => {
  return jwt.sign({ payload }, process.env.JWT_SECRET, {
    expiresIn: maxAge
  });
};

export const handleLoginService = (username, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {}
            const userFromDB = await fetchUserByUsername(username);
            if (userFromDB) {
                let isPasswordCorrect = bcrypt.compareSync(password, userFromDB.password);
                if (isPasswordCorrect) {
                    const role = userFromDB.role;
                    let user = {
                        ...userFromDB._doc,
                    };
                    user.role = role.name;
                    delete user.password;

                    let payload = { id: user._id, name: user.name, role };
                    let token = createToken(payload);

                    response.errCode = 0;
                    response.message = "Ok";
                    response.data = {
                        access_token: token
                    };
                } else {
                    response.errCode = 3;
                    response.message = "Wrong password!";
                }
            } else {
                response.errCode = 2;
                response.message = "User not found";
            }
            resolve(response)
        } catch (e) {
            reject(e)
        }
    })
}



