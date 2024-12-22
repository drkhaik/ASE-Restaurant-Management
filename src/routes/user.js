'use strict';

import Express from "express";
const router = Express.Router();

router.use('/users', (req, res, next) => {
    // authorize here
    next();
});

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

router.get('/test', (req, res) => {
    res.render('index', { title: 'Home Page' });
});

router.get('/manage-user', (req, res) => {
    res.render('user/manage-user', { title: 'Manage User', empSalary: empSalary });
});

export default router;