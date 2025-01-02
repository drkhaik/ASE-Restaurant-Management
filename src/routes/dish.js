'use strict';

import Express from "express";
import {
    fetchAllDish,
    getDishCreate,
    postDishCreate,
    getDishEdit,
    postDishUpdate,
    deleteDish
} from "../controllers/dish.controller.js";
import { checkPermission } from '../middleware/roleMiddleware.js';

const router = Express.Router();

// Add dish
router.get('/add-dish', checkPermission("manage_dishes"), getDishCreate);
router.post('/add-dish', checkPermission("manage_dishes"), postDishCreate);

// Get dishes
router.get('/', checkPermission("view_dishes"), fetchAllDish);

// Update dish
router.get('/edit-dish/:id', checkPermission("manage_dishes"), getDishEdit);
router.post('/update-dish', checkPermission("manage_dishes"), postDishUpdate);

// Delete dish
router.get('/:id', checkPermission("manage_dishes"), deleteDish);

export default router;
