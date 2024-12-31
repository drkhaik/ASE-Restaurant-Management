'use strict';

import Express from "express";
import {
    fetchUsers,
    getUserCreate,
    postUserCreate,
    getUserEdit,
    postUserUpdate,
    getUserLogin,
    handleLogin
} from "../controllers/user.controller.js";
import { checkPermission } from '../middleware/roleMiddleware.js';

const router = Express.Router();

// login
router.get('/login', getUserLogin);
router.post('/login', handleLogin);

// Add user
router.get('/add-user', checkPermission("manage_staff"), getUserCreate);
router.post('/add-user', checkPermission("manage_staff"), postUserCreate);

// Get users
router.get('/', checkPermission("view_staff"), fetchUsers);

// Update user
router.get('/edit-user/:id', checkPermission("manage_staff"), getUserEdit);
router.post('/update-user', checkPermission("manage_staff"), postUserUpdate);

export default router;
