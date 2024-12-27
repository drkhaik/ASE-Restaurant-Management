'use strict';

import Express from "express";
const router = Express.Router();
import {
    fetchAllDish,
    getDishCreate,
    postDishCreate,
    getDishEdit,
    postDishUpdate,
    deleteDish
}
from "../controllers/dish.controller.js"

// Add dish
router.get('/add-dish', getDishCreate);
router.post('/add-dish', postDishCreate);

// Get dish
router.get('/', fetchAllDish);

// Update dish
router.get('/edit-dish/:id', getDishEdit); // Thêm :id để nhận ID của Dish
router.post('/update-dish', postDishUpdate); 

// Delete dish
router.get('/:id', deleteDish); // Add route for deleting dish

export default router;