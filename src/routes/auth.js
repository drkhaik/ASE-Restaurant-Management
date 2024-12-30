'use strict';

import Express from "express";
const router = Express.Router();
import {
    getUserLogin,
    handleLogin,
    handleLogout
}
from "../controllers/user.controller.js"


// login
router.get('/login', getUserLogin);
router.post('/login', handleLogin);

// logout
router.get('/logout', handleLogout);

export default router;