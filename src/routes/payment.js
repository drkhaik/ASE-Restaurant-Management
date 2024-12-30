'use strict';

import Express from "express";
const router = Express.Router();
import {
    getUserCreate,
    postUserCreate,
    getUserEdit,
    postUserUpdate
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

router.get('/', (req, res) => {
    res.render('payment/form-payment', { title: 'payment' });
});


export default router;