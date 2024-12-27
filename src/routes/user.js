'use strict';

import Express from "express";
const router = Express.Router();
import {
    fetchAllUser,
    getUserCreate,
    postUserCreate,
    getUserEdit,
    postUserUpdate,
    getUserLogin,
    handleLogin
}
from "../controllers/user.controller.js"

const empSalary = [
    {
        name: "Sayan Ghosh",
        salary: 37000
    },
    {
        name: "Susmita Sahoo",
        salary: 365000
    },
    {
        name: "Nabonita Santra",
        salary: 36000
    },
    {
        name: "Anchit Ghosh",
        salary: 30000
    }
]

// login
router.get('/login', getUserLogin);
router.post('/login', handleLogin);


// add user
router.get('/add-user', getUserCreate);
router.post('/add-user', postUserCreate);

// get user
router.get('/', fetchAllUser);

// update user
router.get('/edit-user/:id', getUserEdit); // Thêm :id để nhận ID người dùng
router.post('/update-user', postUserUpdate); 


export default router;