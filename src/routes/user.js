'use strict';

import Express from "express";
const router = Express.Router();
import {
    fetchUsers,
    getUserCreate,
    postUserCreate,
    getUserEdit,
    postUserUpdate,
    getUserLogin,
    handleLogin
}
from "../controllers/user.controller.js"

// login
router.get('/login', getUserLogin);
router.post('/login', handleLogin);


// add user
router.get('/add-user', getUserCreate);
router.post('/add-user', postUserCreate);

// get user
router.get('/', fetchUsers);

// update user
router.get('/edit-user/:id', getUserEdit);
router.post('/update-user', postUserUpdate); 


export default router;