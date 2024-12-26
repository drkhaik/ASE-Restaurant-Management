'use strict';

import Express from "express";
const router = Express.Router();
import {
    fetchAllOrder,
    getOrderCreate,
    postOrderCreate
}
from "../controllers/order.controller.js"

// const empOrder = [
//     {
//         name: "Sayan Ghosh",
//         salary: 37000
//     },
//     {
//         name: "Susmita Sahoo",
//         salary: 365000
//     },
//     {
//         name: "Nabonita Santra",
//         salary: 36000
//     },
//     {
//         name: "Anchit Ghosh",
//         salary: 30000
//     }
// ]


router.get('/add-order', getOrderCreate);
router.post('/add-order', postOrderCreate);
router.get('/orders', fetchAllOrder);


export default router;